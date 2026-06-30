import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import { Request } from 'express';

import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import type { AuthPayload } from '../types/auth.jwtPayload';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    @Inject(refreshConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private readonly authService: AuthService,
  ) {
    const { secret } = refreshTokenConfig;
    if (!secret) {
      throw new Error('Refresh token secret is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: secret,
      ignoreExpiration: false,
      passReqToCallback: true, // Enable access to request object
    });
  }
  validate(req: Request, payload: AuthPayload) {
    const userId = payload.sub;
    if (!userId) {
      return null;
    }
    // Extract refresh token from request body for validation
    const refreshToken = (req.body as { refresh?: string })?.refresh;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
