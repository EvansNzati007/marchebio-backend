import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from './dto/create-commande.dto';

@Controller('commandes')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}

  // ✅ Créer une commande (ACHETEUR)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ACHETEUR')
  create(@Request() req, @Body() dto: CreateCommandeDto) {
    return this.commandeService.create(req.user.id, dto);
  }

  // ✅ Mes commandes (ACHETEUR)
  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ACHETEUR')
  findMyOrders(@Request() req) {
    return this.commandeService.findMyOrders(req.user.id);
  }

  // ✅ Commandes reçues (PRODUCTEUR)
  @Get('producteur')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('PRODUCTEUR')
  findOrdersForProducer(@Request() req) {
    return this.commandeService.findOrdersForProducer(req.user.id);
  }


  @Patch(':id/statut')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('PRODUCTEUR')
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body('statut') statut: string,
  ) {
    return this.commandeService.updateStatus(+id, req.user.id, statut);
  }
}
