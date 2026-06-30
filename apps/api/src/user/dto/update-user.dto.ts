import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-dto';

/**
 * Update DTO derived from CreateUserDto. Deliberately does NOT expose `role`,
 * so an authenticated caller cannot escalate privileges via a profile update.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
