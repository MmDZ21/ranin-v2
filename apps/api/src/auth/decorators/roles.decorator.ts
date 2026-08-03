import { SetMetadata } from '@nestjs/common';
import { Role } from '../../generated/enums';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route (or controller) to the given roles. Must be combined with
 * JwtAuthGuard + RolesGuard, e.g. `@UseGuards(JwtAuthGuard, RolesGuard)`.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
