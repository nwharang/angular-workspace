import { Context } from '~server/Utils/trpc.utils';

export default class ProductController {
  async getProducts(
    ctx: Context,
    input: {
      page: number;
      filter: { string: string | null; sort: number | null },
      isAll: boolean | null;
    }
  ) {
    const page = Number(input.page) - 1 || 0;
    const itemPerPage = 10;
    const items = await ctx.prisma.product.findMany({
      skip: page * itemPerPage,
      take: !input.isAll ? itemPerPage : undefined,
      where: input.filter?.string
        ? {
            name: {
              contains: input.filter?.string || undefined,
              mode: 'insensitive',
            },
          }
        : undefined,
      orderBy: {
        price: input.filter?.sort ? 'asc' : 'desc',
      },
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

  async createProduct(
    ctx: Context,
    input: {
      name: string;
      price: bigint;
      description: string;
      image: string;
      unit: string;
    }
  ) {
    const product = await ctx.prisma.product.create({
      data: {
        name: input.name,
        price: input.price,
        description: input.description,
        image: input.image,
        unit: input.unit,
      },
    });
    return product;
  }
  async updateProduct(
    ctx: Context,
    input: {
      id: string;
      name: string;
      price: bigint;
      description: string;
      image: string;
      unit: string;
    }
  ) {
    const product = await ctx.prisma.product.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        price: input.price,
        description: input.description,
        image: input.image,
        unit: input.unit,
      },
    });
    return product;
  }
  async deleteProduct(ctx: Context, input: { id: string }) {
    const product = await ctx.prisma.product.delete({
      where: {
        id: input.id,
      },
    });
    return product;
  }
}
