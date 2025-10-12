import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TurnstileService {
  constructor(private readonly configService: ConfigService) {}

  public async verify(token: string): Promise<boolean> {
    const response = await fetch(`https://challenges.cloudflare.com/turnstile/v0/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret: this.configService.get('TURNSTILE_SECRET_KEY'), response: token }),
    });
    const data = await response.json();
    return data.success;
  }
}
