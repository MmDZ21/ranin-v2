import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new LocalAuthGuard()).toBeDefined();
  });

  it('rejects oversized passwords before Passport authentication runs', async () => {
    const request = {
      body: {
        email: 'user@example.com',
        password: 'x'.repeat(73),
      },
    };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as ExecutionContext;

    await expect(new LocalAuthGuard().canActivate(context)).rejects.toThrow(
      BadRequestException,
    );
  });
});
