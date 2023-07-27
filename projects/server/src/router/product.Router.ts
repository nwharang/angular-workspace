import { z } from 'zod';
import ProductController from '~server/Controller/Product.Controller';
import { router } from '~server/Utils/trpc.utils';
import { publicProcedure } from '~server/Utils/trpc.utils';

export const productRoute = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return new ProductController().getProducts(ctx, input);
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return new ProductController().getProductById(ctx, input);
    }),
});
