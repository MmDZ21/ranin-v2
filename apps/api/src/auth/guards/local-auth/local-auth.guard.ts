import { ExecutionContext, Injectable, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isObservable, lastValueFrom } from 'rxjs';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly loginValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ body: unknown }>();

    // Guards run before controller parameter pipes. Validate and bound the raw
    // credentials before Passport performs a database lookup or Argon2 work.
    request.body = await this.loginValidationPipe.transform(request.body, {
      type: 'body',
      metatype: LoginDto,
    });

    const result = super.canActivate(context);
    return isObservable(result) ? lastValueFrom(result) : result;
  }
}
