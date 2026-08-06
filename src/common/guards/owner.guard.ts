import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ProduitService } from '../../produit/produit.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private produitService: ProduitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const productId = parseInt(request.params.id);

    if (!user || !user.id) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    const isOwner = await this.produitService.isOwner(productId, user.id);

    if (!isOwner) {
      throw new ForbiddenException(
        "Vous n'êtes pas le propriétaire de ce produit",
      );
    }

    return true;
  }
}
