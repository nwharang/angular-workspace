import { OrderStatus } from '@prisma/client';
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

  checkout: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        shoppingSessionId: z.string(),
        address: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new CartController().checkout(ctx, input);
    }),

  removeCart: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        shoppingSessionId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new CartController().removeCartitem(ctx, input);
    }),

  getListOrders: publicProcedure.use(AuthMiddleware).query(({ ctx }) => {
    return new CartController().getListOrders(ctx);
  }),

  updateOrderStatus: publicProcedure
    .use(AuthMiddleware)

    .input(
      z.object({
        orderId: z.string(),
        status: z.nativeEnum(OrderStatus),
      })
    )
    .mutation(({ ctx, input }) => {
      return new CartController().updateOrderStatus(ctx, input);
    }),
});
