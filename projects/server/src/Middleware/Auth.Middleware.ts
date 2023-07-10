import { Context, middleware } from '~server/Utils/trpc.utils';
import * as jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { User } from '@prisma/client';

const TOKENKEY = 'TEST';

export const AuthMiddleware = middleware(async (opts) => {
  const { ctx } = opts;
  const res = (await jwt.verify(
    ctx.req.cookies['access_token'],
    TOKENKEY
  )) as jwt.JwtPayload;

  const checkUser = (await ctx.prisma.user.findUnique({
    where: {
      email: res.email,
    },
  })) as unknown as User;
  if (!checkUser) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return opts.next({
    ctx: {
      ...ctx,
      user: checkUser,
    },
  });
});

export interface authContext extends Context {
  user: User;
}
