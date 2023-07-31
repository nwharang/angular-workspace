import { z } from 'zod';
import CartController from '~server/Controller/Cart.Controller';
import { AuthMiddleware } from '~server/Middleware/Auth.Middleware';
import { router } from '~server/Utils/trpc.utils';
import { publicProcedure } from '~server/Utils/trpc.utils';

export const cartRoute = router({
  list: publicProcedure.use(AuthMiddleware).query(({ ctx }) => {
    return new CartController().getCart(ctx);
  }),

  addToCart: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new CartController().addToCart(ctx, input);
    }),
  updateQty: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
        shoppingSessionId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new CartController().updateQty(ctx, input);
    }),
  deleteItem: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        productId: z.string(),
        shoppingSessionId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new CartController().deleteItem(ctx, input);
    }),
});
