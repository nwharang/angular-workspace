import { ShoppingSession } from '@prisma/client';
import { authContext } from '~server/Middleware/Auth.Middleware';

export default class CartController {
  async getCart(ctx: authContext) {
    const cart = await ctx.prisma.shoppingSession.findMany({
      where: {
        userId: ctx.user?.id,
      },
      include: {
        CartItem: {
          include: {
            Product: true,
          },
        },
      },
    });
    return cart;
  }

  async addToCart(
    ctx: authContext,
    input: { productId: string; quantity: number }
  ) {
    console.log(ctx.user.id);
    const shoppingSession = (await ctx.prisma.user.findUnique({
      where: {
        id: ctx.user.id,
      },
      select: {
        ShoppingSession: true,
      },
    })) as unknown as ShoppingSession;
    if (!shoppingSession) {
      await ctx.prisma.shoppingSession.create({
        include: {
          CartItem: true,
        },
        data: {
          userId: ctx.user.id,
          CartItem: {
            create: {
              qty: input.quantity,
              Product: {
                connect: {
                  id: input.productId,
                },
              },
            },
          },
        },
      });
    } else {
      await ctx.prisma.shoppingSession.update({
        where: {
          userId: ctx.user.id,
        },
        include: {
          CartItem: true,
        },
        data: {
          CartItem: {
            upsert: {
              where: {
                productId: input.productId,
              },
              create: {
                qty: 1,
                productId: input.productId,
              },
              update: {
                qty: {
                  increment: 1,
                },
              },
            },
          },
        },
      });
    }
    return;
  }

  async updateQty(
    ctx: authContext,
    input: { productId: string; quantity: number; shoppingSessionId: string }
  ) {
    const cart = await ctx.prisma.cartItem.upsert({
      where: {
        productId: input.productId,
      },
      update: {
        qty: input.quantity,
      },
      create: {
        qty: input.quantity,
        productId: input.productId,
        shoppingSessionId: input.shoppingSessionId,
      },
    });
    return cart;
  }

  async deleteItem(
    ctx: authContext,
    input: { productId: string; shoppingSessionId: string }
  ) {
    const cart = await ctx.prisma.cartItem.deleteMany({
      where: {
        productId: input.productId,
        shoppingSessionId: input.shoppingSessionId,
      },
    });
    return cart;
  }

  async removeCartitem(ctx: authContext, input: { shoppingSessionId: string }) {
    const cart = await ctx.prisma.cartItem.deleteMany({
      where: {
        shoppingSessionId: input.shoppingSessionId,
      },
    });
    return cart;
  }

  async checkout(
    ctx: authContext,
    input: { shoppingSessionId: string; address: string }
  ) {
    // goi len server tao order
    const session = await ctx.prisma.shoppingSession.findUnique({
      where: {
        id: input.shoppingSessionId,
      },
      include: {
        CartItem: {
          include: {
            Product: true,
          },
        },
      },
    });
    if (!session) return;
    console.log('nosession' + session);

    const total = session.CartItem.map((e) => e.Product.price * e.qty).reduce(
      (a, b) => a + b
    );
    return await ctx.prisma.order.create({
      data: {
        address: input.address,
        ShoppingSession: {
          connect: {
            id: input.shoppingSessionId,
            total,
          },
        },
      },
    });
  }

  async getListOrders(ctx: authContext) {
    return await ctx.prisma.order.findMany({
      include: {
        ShoppingSession: {
          include: {
            CartItem: {
              include: {
                Product: true,
              },
            },
          },
        },
      },
    });
  }
}
