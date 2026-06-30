import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { Role } from '../../../generated/enums';

function makeContext(user?: { role?: Role }): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => null,
    getClass: () => null,
  } as unknown as ExecutionContext;
}

function makeReflector(roles?: Role[]): Reflector {
  return { getAllAndOverride: () => roles } as unknown as Reflector;
}

describe('RolesGuard', () => {
  it('allows the request when no roles are required', () => {
    const guard = new RolesGuard(makeReflector(undefined));
    expect(guard.canActivate(makeContext({ role: Role.USER }))).toBe(true);
  });

  it('allows an ADMIN when ADMIN is required', () => {
    const guard = new RolesGuard(makeReflector([Role.ADMIN]));
    expect(guard.canActivate(makeContext({ role: Role.ADMIN }))).toBe(true);
  });

  it('denies a USER when ADMIN is required', () => {
    const guard = new RolesGuard(makeReflector([Role.ADMIN]));
    expect(() => guard.canActivate(makeContext({ role: Role.USER }))).toThrow(
      ForbiddenException,
    );
  });

  it('denies a request with no authenticated user', () => {
    const guard = new RolesGuard(makeReflector([Role.ADMIN]));
    expect(() => guard.canActivate(makeContext())).toThrow(ForbiddenException);
  });
});
