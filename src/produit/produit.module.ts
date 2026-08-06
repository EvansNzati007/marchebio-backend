import { Module } from '@nestjs/common';
import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OwnerGuard } from '../common/guards/owner.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ProduitController],
  providers: [ProduitService, OwnerGuard],
  exports: [ProduitService],
})
export class ProduitModule {}
