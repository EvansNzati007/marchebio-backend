// src/user/user.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/RegisterDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: RegisterDto) {
    // 1. Vérifier que l'email n'est pas déjà utilisé
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // 2. Vérifier que le numéro de téléphone n'est pas déjà utilisé
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const existingPhone = await this.prisma.user.findUnique({
      where: { numTel: dto.numTel },
    });
    if (existingPhone) {
      throw new ConflictException('Ce numéro de téléphone est déjà utilisé');
    }

    // 3. Hacher le mot de passe — JAMAIS stocker en clair
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 4. Créer l'utilisateur en base
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        userName: dto.userName,
        password: hashedPassword,
        adresse: dto.adresse,
        numTel: dto.numTel,
        role: dto.role,
      },
    });

    // 5. Ne jamais renvoyer le mot de passe, même haché
    const { password, ...userSansPassword } = user;
    return userSansPassword;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
        numTel: true,
        adresse: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findMe(id: number) {
    return this.findById(id);
  }
}
