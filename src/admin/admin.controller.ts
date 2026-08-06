import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../generated/prisma/enums';


@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}
  // 1. Statistiques dashboard
  @Get('stats')
  async getStats() {
    return {
      totalUsers: await this.prisma.user.count(),
      totalProducts: await this.prisma.product.count(),
      totalOrders: await this.prisma.commande.count(),
      totalRevenue: await this.prisma.commande.aggregate({
        _sum: { montantTotal: true },
      }),
    };
  }

  // 2. Liste des utilisateurs
  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
        numTel: true,
      },
    });
  }

  // 3. Changer rôle d'un utilisateur
  @Patch('users/:id/role')
  async changeUserRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.prisma.user.update({
      where: { id: +id },
      data: { role },
    });
  }

  // 4. Supprimer un utilisateur
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id: +id } });
  }

  // 5. Liste des commandes
  @Get('commandes')
  async getAllCommandes() {
    return this.prisma.commande.findMany({
      include: {
        user: true,
        ligneCommandes: { include: { product: true } },
      },
    });
  }
}
