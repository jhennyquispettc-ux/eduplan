import { PartialType } from '@nestjs/swagger';
import { UserProfileFieldsDto } from './user-profile-fields.dto.js';

export class UpdateProfileDto extends PartialType(UserProfileFieldsDto) {}
