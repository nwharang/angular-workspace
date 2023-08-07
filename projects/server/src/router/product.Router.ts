import { z } from 'zod';
import ProductController from '~server/Controller/Product.Controller';
import { router } from '~server/Utils/trpc.utils';
import { publicProcedure } from '~server/Utils/trpc.utils';

export const productRoute = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number(),
        filter: z.object({
          string: z.string().nullable(),
          sort: z.number().nullable(),
        }),
        isAll: z.boolean().nullable(),
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

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.bigint(),
        description: z.string(),
        image: z.string(),
        unit: z.string(),
      })
    )

    .mutation(({ ctx, input }) => {
      return new ProductController().createProduct(ctx, input);
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.bigint(),
        description: z.string(),
        image: z.string(),
        unit: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new ProductController().updateProduct(ctx, input);
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new ProductController().deleteProduct(ctx, input);
    }),
});
