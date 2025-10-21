import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GoogleProfileEntities } from './entities/google-profile.entities';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async googleLogin(profile: GoogleProfileEntities) {
    const user = await this.userService.findOrCreateGoogleUser(profile);
    const token = await this.userService.createToken(user.id);
    return token;
  }
}
