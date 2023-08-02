import { Localize } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { authContext } from '~server/Middleware/Auth.Middleware';

export default class UserController {
  /**
   * User Info
   */
  async info(ctx: authContext) {
    return {
      ...(({ name, email, photo, localize }) => ({
        name,
        email,
        photo,
        localize,
      }))(ctx.user),
    };
  }
  async changeLocalization(ctx: authContext, input: { localize: Localize }) {
    const res = await ctx.prisma.user.update({
      where: {
        email: ctx.user.email,
      },
      data: {
        localize: input.localize,
      },
    });
    if (res) {
      return {
        message: 'Success',
      };
    }
    throw new TRPCError({ code: 'BAD_REQUEST' });
  }

  async getUserbyId(ctx: authContext, input: { id: string }) {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
    });
    if (user) {
      return {
        ...(({ name, email, photo }) => ({
          name,
          email,
          photo,
        }))(user),
      };
    }
    throw new TRPCError({ code: 'BAD_REQUEST' });
  }
}
