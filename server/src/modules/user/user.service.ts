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
import { UserEntities } from './entities/user.entities';
import { UserCheckEmailDto } from './dto/user-check-email.dto';
import { TurnstileService } from '@/infrastructure/turnstile/turnstile.service';
import { GoogleProfileEntities } from '../auth/entities/google-profile.entities';
import { UserDetailEntities } from './entities/user-detail.entities';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  public constructor(
    @Inject(DB_CLIENT) private readonly db: DbClient,
    private readonly verifyCodeService: VerifyCodeService,
    private readonly turnstileService: TurnstileService,
  ) {}

  public async createToken(
    userId: string,
    expired_at: Date = dayjs().add(7, 'day').toDate(),
  ): Promise<string> {
    return (
      await this.db
        .insert(token)
        .values({
          user_id: userId,
          token: v7(),
          expired_at,
        })
        .returning()
    )[0].token;
  }

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
    return await this.createToken(userResult.id);
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

  public async myDetail(token: string): Promise<UserDetailEntities | null> {
    const user = await this.getByToken(token);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  public async getByRequest(request: Request): Promise<UserEntities | null> {
    if (request['user']) return request['user'] as UserEntities;

    const tokenValue = this.extractTokenFromHeader(request);
    if (!tokenValue) {
      return null;
    }
    return this.getByToken(tokenValue);
  }

  public async getByToken(tokenValue: string): Promise<UserEntities | null> {
    const tokenData = await this.db.query.token.findFirst({
      where: and(eq(token.token, tokenValue), gt(token.expired_at, new Date())),
      with: {
        user: true,
      },
    });

    if (!tokenData || !tokenData.user) {
      return null;
    }

    const result: UserEntities = {
      id: tokenData.user.id,
      email: tokenData.user.email,
      role: tokenData.user.role,
      gen_limit: tokenData.user.gen_limit,
      created_at: tokenData.user.created_at,
      updated_at: tokenData.user.created_at,
    };

    return result;
  }

  public async findOrCreateGoogleUser(profile: GoogleProfileEntities) {
    let userResult = await this.db.query.user.findFirst({
      where: eq(user.google_id, profile.id),
    });

    if (!userResult) {
      let email = profile.emails.find((email) => email.verified)?.value ?? null;
      if (email) {
        let emailUser = await this.db.query.user.findFirst({
          where: eq(user.email, email),
        });
        if (emailUser) {
          email = null;
        }
      }

      userResult = (
        await this.db
          .insert(user)
          .values({
            google_id: profile.id,
            email: email,
          })
          .returning()
      )[0];
    }

    return userResult;
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
