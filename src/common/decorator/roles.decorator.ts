// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

// ✅ Version qui accepte plusieurs rôles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
