// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/loginDtdo';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Créer l'utilisateur (délègue toute la logique à UserService)
    const user = await this.userService.create(dto);

    // 2. Générer un token JWT pour connecter l'utilisateur直接 après inscription
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      user,
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    // 1. Retrouver l'utilisateur par email
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // 2. Comparer le mot de passe fourni avec le hash stocké
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // 3. Générer le token
    const token = this.generateToken(user.id, user.email, user.role);

    // ✅ Retourner user + token
    return {
      access_token: token.access_token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        numTel: user.numTel,
        adresse: user.adresse,
      },
    };
  }

  private generateToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
