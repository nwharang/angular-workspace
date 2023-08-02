import { router } from '~server/Utils/trpc.utils';
import { z } from 'zod';
import { publicProcedure } from '~server/Utils/trpc.utils';
import { AuthMiddleware } from '~server/Middleware/Auth.Middleware';
import UserController from '~server/Controller/User.Controller';
import { Localize } from '@prisma/client';

export const userRoute = router({
  info: publicProcedure.use(AuthMiddleware).query(({ ctx }) => {
    return new UserController().info(ctx);
  }),
  changeLocalize: publicProcedure
    .use(AuthMiddleware)
    .input(z.object({ localize: z.nativeEnum(Localize) }))
    .mutation(({ ctx, input }) => {
      return new UserController().changeLocalization(ctx, input);
    }),

  getUserbyId: publicProcedure
    .use(AuthMiddleware)
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return new UserController().getUserbyId(ctx, input);
    }),
});
