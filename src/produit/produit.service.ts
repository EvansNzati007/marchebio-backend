import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';

@Injectable()
export class ProduitService {
  constructor(private prisma: PrismaService) {}

  // ✅ Créer un produit (seul un producteur)
  async create(userId: number, dto: CreateProduitDto) {
    // Validation de la taille de l'image (max 500KB)
    if (dto.photoData && dto.photoData.length > 700000) {
      throw new BadRequestException("L'image est trop lourde (max 500KB)");
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        photoData: dto.photoData,
        photoMimeType: dto.photoMimeType,
        producteurId: userId, // ← L'utilisateur connecté
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            numTel: true,
          },
        },
      },
    });
  }

  // ✅ Liste publique des produits (page d'accueil)
  async findAll() {
    return this.prisma.product.findMany({
      where: {
        quantity: { gt: 0 }, // Seulement les produits en stock
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            numTel: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  // ✅ Détail d'un produit (public)
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            numTel: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return product;
  }

  // ✅ Mes produits (pour un producteur)
  async findMyProducts(userId: number) {
    return this.prisma.product.findMany({
      where: { producteurId: userId },
      include: {
        user: {
          select: {
            userName: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  // ✅ Vérifier si l'utilisateur est propriétaire (pour le guard)
  async isOwner(productId: number, userId: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { producteurId: true },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    return product.producteurId === userId;
  }

  // ✅ Mettre à jour un produit (seul le propriétaire)
  async update(id: number, userId: number, dto: UpdateProduitDto) {
    // Vérifier que le produit existe et appartient à l'utilisateur
    const isOwner = await this.isOwner(id, userId);
    if (!isOwner) {
      throw new ForbiddenException(
        "Vous n'êtes pas le propriétaire de ce produit",
      );
    }

    // Validation de l'image si elle est modifiée
    if (dto.photoData && dto.photoData.length > 700000) {
      throw new BadRequestException("L'image est trop lourde (max 500KB)");
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            userName: true,
            email: true,
          },
        },
      },
    });
  }

  // ✅ Supprimer un produit (seul le propriétaire)
  async remove(id: number, userId: number) {
    const isOwner = await this.isOwner(id, userId);
    if (!isOwner) {
      throw new ForbiddenException(
        "Vous n'êtes pas le propriétaire de ce produit",
      );
    }

    // Vérifier que le produit n'a pas de commandes en cours
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        ligneCommandes: {
          where: {
            commande: {
              statut: {
                in: ['NOUVELLE', 'PREPAREE'],
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    if (product.ligneCommandes.length > 0) {
      throw new BadRequestException(
        'Ce produit a des commandes en cours, vous ne pouvez pas le supprimer',
      );
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async search(query: string) {
    return this.prisma.product.findMany({
      where: {
        AND: [
          { quantity: { gt: 0 } },
          {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
            ],
          },
        ],
      },
      include: {
        user: {
          select: {
            userName: true,
            email: true,
          },
        },
      },
    });
  }
}
