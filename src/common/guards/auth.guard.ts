import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization;

    if (!header) {
      return false;
    }
    const token = header.split(' ')[1]; // Récupère le token après "Bearer"
    //const user = findUserByToken(token);

  /*  if (!user) {
      return false;
    }*/

   // request.user = user; // Ajoute l'utilisateur à la requête pour qu'il soit accessible dans les contrôleurs

    return true;
  }
}
