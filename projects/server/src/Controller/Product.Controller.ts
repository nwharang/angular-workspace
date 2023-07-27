import { Context } from '~server/Utils/trpc.utils';

export default class ProductController {
  async getProducts(ctx: Context, input: { page: string }) {
    const page = Number(input.page) - 1 || 0;
    const items = await ctx.prisma.product.findMany({
      skip: page * 20,
      take: 1,
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        image: true,
        unit: true,
      },
    });
    return {
      items,
      page,
      allItem: await ctx.prisma.product.count(),
    };
  }

  async getProductById(ctx: Context, input: { id: string }) {
    const product = await ctx.prisma.product.findUnique({
      where: {
        id: input.id,
      },
    });
    return product;
  }
}
