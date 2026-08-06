import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommandeDto } from './dto/create-commande.dto';

@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  // ✅ Créer une commande (acheteur)
  async create(userId: number, dto: CreateCommandeDto) {
    // 1. Vérifier que les produits existent et ont assez de stock
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException("Un ou plusieurs produits n'existent pas");
    }

    // 2. Calculer le montant total et vérifier les stocks
    let total = 0;
    const ligneData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new BadRequestException(`Produit ${item.productId} non trouvé`);
      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour ${product.name} (disponible: ${product.quantity})`,
        );
      }
      total += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        prixUnitaire: product.price,
      };
    });

    // 3. Créer la commande et les lignes (transaction)
    return this.prisma.$transaction(async (tx) => {
      // 3.1 Créer la commande
      const commande = await tx.commande.create({
        data: {
          userId,
          montantTotal: total,
          statut: 'NOUVELLE',
        },
      });

      // 3.2 Créer les lignes de commande
      for (const item of ligneData) {
        await tx.ligneCommande.create({
          data: {
            commandeId: commande.id,
            productId: item.productId,
            quantity: item.quantity,
            prixUnitaire: item.prixUnitaire,
          },
        });

        // 3.3 Diminuer le stock
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      // 3.4 Retourner la commande complète
      return tx.commande.findUnique({
        where: { id: commande.id },
        include: {
          ligneCommandes: {
            include: { product: true },
          },
          user: {
            select: { userName: true, email: true, numTel: true },
          },
        },
      });
    });
  }

  // ✅ Mes commandes (acheteur)
  async findMyOrders(userId: number) {
    return this.prisma.commande.findMany({
      where: { userId },
      include: {
        ligneCommandes: {
          include: { product: true },
        },
      },
      orderBy: { dateCommande: 'desc' },
    });
  }

  // ✅ Commandes reçues (producteur)
  async findOrdersForProducer(userId: number) {
    // Récupérer les produits du producteur
    const products = await this.prisma.product.findMany({
      where: { producteurId: userId },
      select: { id: true },
    });
    const productIds = products.map((p) => p.id);

    if (productIds.length === 0) {
      return [];
    }

    return this.prisma.commande.findMany({
      where: {
        ligneCommandes: {
          some: {
            productId: { in: productIds },
          },
        },
      },
      include: {
        ligneCommandes: {
          include: { product: true },
        },
        user: {
          select: { userName: true, email: true, numTel: true },
        },
      },
      orderBy: { dateCommande: 'desc' },
    });
  }

  // ✅ Changer le statut d'une commande (producteur)
  // Dans la méthode updateStatus
  async updateStatus(commandeId: number, userId: number, statut: string) {
    // ... vérifications ...

    // ✅ Correction : Convertir en enum
    const validStatus = ['NOUVELLE', 'PREPAREE', 'LIVREE'];
    if (!validStatus.includes(statut)) {
      throw new BadRequestException(
        'Statut invalide. Utilisez: NOUVELLE, PREPAREE, LIVREE',
      );
    }

    return this.prisma.commande.update({
      where: { id: commandeId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        statut: statut as any, // ✅ Forcer le typage
      },
      include: {
        ligneCommandes: {
          include: { product: true },
        },
        user: {
          select: { userName: true, email: true, numTel: true },
        },
      },
    });
  }
}
