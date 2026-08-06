import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 1. Récupère la requête EN DIRECT
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    // 2. ATTRAPE quelque chose DANS la requête
    return data ? user[data as keyof typeof user] : user;
  },
);
