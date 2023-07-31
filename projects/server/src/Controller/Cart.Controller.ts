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
    if (!ctx.user) {
      throw new Error('User not found');
    }
    const shoppingSession = await ctx.prisma.shoppingSession.findMany({
      where: {
        userId: ctx.user?.id,
      },
    });
    if (shoppingSession.length === 0) {
      const cart = await ctx.prisma.user.update({
        where: {
          id: ctx.user?.id,
        },
        data: {
          ShoppingSession: {
            upsert: {
              create: {
                CartItem: {
                  create: {
                    qty: input.quantity,
                    productId: input.productId,
                  },
                },
              },
              update: {
                CartItem: {
                  create: {
                    qty: input.quantity,
                    productId: input.productId,
                  },
                },
              },
            },
          },
        },
      })
      return cart;
    }
      // else {
      //   const shoppingSessionId = shoppingSession[0].id;
      //   const update = {
          
      //   }
      //   this.updateQty(ctx, { input.productId, quantity, shoppingSessionId });
        

      // }
    return shoppingSession;
  }

  async updateQty(
    ctx: authContext,
    input: { productId: string; quantity: number; shoppingSessionId: string }
  ) {
    const cart = await ctx.prisma.cartItem.update({
      where: {
        productId: input.productId,
        shoppingSessionId: input.shoppingSessionId,
      },
      data: {
        qty: input.quantity,
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

  updateTotalPrice(ctx: authContext) {
    const cart = ctx.prisma.cartItem.findMany({
      where: {
        shoppingSessionId: ctx.user?.id,
      },
    });
    return cart;
  }

}
