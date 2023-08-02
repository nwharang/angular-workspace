import { OrderStatus } from '@prisma/client';
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
    let session = await ctx.prisma.shoppingSession.findUnique({
      where: {
        userId: ctx.user.id,
      },
    });
    if (!session)
      await ctx.prisma.shoppingSession.create({
        include: {
          CartItem: {
            include: {
              Product: true,
            },
          },
        },
        data: {
          userId: ctx.user.id,
          CartItem: {
            create: {
              productId: input.productId,
              qty: 1,
            },
          },
        },
      });
    else
      await ctx.prisma.shoppingSession.update({
        where: {
          id: session.id,
        },
        include: {
          CartItem: {
            include: {
              Product: true,
            },
          },
        },
        data: {
          CartItem: {
            upsert: {
              where: {
                shoppingSessionId_productId: {
                  shoppingSessionId: session.id,
                  productId: input.productId,
                },
              },
              create: {
                productId: input.productId,
                qty: 1,
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

  async updateQty(
    ctx: authContext,
    input: { productId: string; quantity: number; shoppingSessionId: string }
  ) {
    const cart = await ctx.prisma.cartItem.upsert({
      where: {
        shoppingSessionId_productId: {
          productId: input.productId,
          shoppingSessionId: input.shoppingSessionId,
        },
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
    const cart = await ctx.prisma.cartItem.delete({
      where: {
        shoppingSessionId_productId: input,
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

    const total = session.CartItem.map((e) => e.Product.price * e.qty).reduce(
      (a, b) => a + b
    );
    return await ctx.prisma.order.create({
      include: {
        ShoppingSession: true,
      },
      data: {
        address: input.address,
        shoppingSessionId: session.id,
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
  async updateOrderStatus(
    ctx: authContext,
    input: { orderId: string; status: OrderStatus }
  ) {
    return await ctx.prisma.order.update({
      where: {
        id: input.orderId,
      },
      data: {
        status: input.status,
        updatedAt: new Date(),
      },
    });
  }
}
