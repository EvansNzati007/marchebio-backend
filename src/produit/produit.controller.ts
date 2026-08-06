import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { OwnerGuard } from '../common/guards/owner.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { ProduitService } from './produit.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { UpdateProduitDto } from './dto/update-produit.dto';

@Controller('produits')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('PRODUCTEUR')
  create(@Request() req, @Body() dto: CreateProduitDto) {
    return this.produitService.create(req.user.id, dto);
  }

  @Get()
  findAll() {
    return this.produitService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.produitService.search(query);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('PRODUCTEUR')
  findMyProducts(@Request() req) {
    return this.produitService.findMyProducts(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produitService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, OwnerGuard)
  @Roles('PRODUCTEUR')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateProduitDto,
  ) {
    return this.produitService.update(+id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, OwnerGuard)
  @Roles('PRODUCTEUR')
  remove(@Param('id') id: string, @Request() req) {
    return this.produitService.remove(+id, req.user.id);
  }
}
