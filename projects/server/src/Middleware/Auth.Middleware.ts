import { middleware } from '~server/Utils/trpc.utils';
import * as jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';

const TOKENKEY = 'TEST';

export const AuthMiddleware = middleware(async ({ ctx, next }) => {
  const res = (await jwt.verify(
    ctx.req.cookies['access_token'],
    TOKENKEY
  )) as jwt.JwtPayload;
  console.log(res);

  const checkUser = await ctx.prisma.user.findUnique({
    where: {
      email: res.email,
    },
  });
  if (!checkUser) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx });
});

// authenticate: publicProcedure.mutation(async ({ ctx }) => {
//     console.log('*******************');
//     console.log(ctx.req.cookies);
//     console.log('*******************');

//     let sessionState = false;
//     const res = (await jwt.verify(
//       ctx.req.cookies['access_token'],
//       TOKENKEY
//     )) as jwt.JwtPayload;

//     const checkUser = await ctx.prisma.user.findUnique({
//       where: {
//         email: res.user.email,
//       },
//     });
//     if (checkUser) sessionState = true;
//     return {
//       sessionState,
//     };
//   }),
