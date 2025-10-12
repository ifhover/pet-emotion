import { Inject, Injectable } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { DB_CLIENT, type DbClient } from '@/infrastructure/drizzle/drizzle.types';
import { BusinessError } from '@/common/exception/business-exception';
import bcrypt from 'bcrypt';
import { token, user } from '@/infrastructure/drizzle/schema';
import { and, eq, gt } from 'drizzle-orm';
import dayjs from 'dayjs';
import { v7 } from 'uuid';
import { VerifyCodeBizType, VerifyCodeChannel } from '@/common/type/dict';
import { VerifyCodeService } from '../verify-code/verify-code.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './entities/user.entities';
import { UserCheckEmailDto } from './dto/user-check-email.dto';
import { TurnstileService } from '@/infrastructure/turnstile/turnstile.service';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  public constructor(
    @Inject(DB_CLIENT) private readonly db: DbClient,
    private readonly verifyCodeService: VerifyCodeService,
    private readonly turnstileService: TurnstileService,
  ) {}

  public async login(dto: UserLoginDto): Promise<string> {
    if (!(await this.turnstileService.verify(dto.turnstile_token))) {
      throw new BusinessError('验证失败，请重试');
    }

    const userResult = await this.db.query.user.findFirst({
      where: (user) => eq(user.email, dto.account),
    });

    if (!userResult) {
      throw new BusinessError('用户名或密码错误');
    }

    if (!(await bcrypt.compare(dto.password, userResult.password))) {
      throw new BusinessError('用户名或密码错误');
    }

    // 使旧token失效
    await this.db
      .update(token)
      .set({
        expired_at: dayjs().toDate(),
      })
      .where(eq(token.user_id, userResult.id));

    // 创建新token，并正确关联用户ID
    const tokenData = await this.db
      .insert(token)
      .values({
        user_id: userResult.id,
        token: v7(),
        expired_at: dayjs().add(1, 'day').toDate(),
      })
      .returning();

    return tokenData[0].token;
  }

  public async checkEmail(dto: UserCheckEmailDto) {
    return (await this.db.$count(user, eq(user.email, dto.email))) === 0;
  }

  public async register(dto: UserRegisterDto) {
    if (
      !(await this.verifyCodeService.verify({
        bizType: VerifyCodeBizType.注册,
        channel: VerifyCodeChannel.邮箱,
        receiver: dto.email,
        code: dto.email_verify_code,
      }))
    ) {
      throw new BusinessError('邮箱验证码错误');
    }
    if (!(await this.checkEmail({ email: dto.email }))) {
      throw new BusinessError('该邮箱已注册');
    }
    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);
    await this.db.insert(user).values({
      email: dto.email,
      password: hashedPassword,
    });
  }

  public async getByToken(tokenStr: string): Promise<User | undefined> {
    const tokenData = await this.db.query.token.findFirst({
      where: and(eq(token.token, tokenStr), gt(token.expired_at, new Date())),
      with: {
        user: true,
      },
    });

    if (!tokenData || !tokenData.user) {
      return undefined;
    }

    const result = new User();

    result.id = tokenData.user.id;
    result.email = tokenData.user.email;
    result.created_at = tokenData.user.created_at;
    result.updated_at = tokenData.user.created_at;

    return result;
  }
}
