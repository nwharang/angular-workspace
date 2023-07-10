import AuthController from '~server/Controller/Auth.Controller';
import { router } from '~server/Utils/trpc.utils';
import { z } from 'zod';
import { publicProcedure } from '~server/Utils/trpc.utils';
import * as jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { User } from '@prisma/client';
const TOKENKEY = 'TEST';

export const authRoute = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(24),
      })
    )
    .mutation(({ ctx, input }) => {
      return new AuthController().login(ctx, input);
    }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(24),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new AuthController().register(ctx, input);
    }),
  authenticate: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.req.cookies['access_token'])
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    const res = (await jwt.verify(
      ctx.req.cookies['access_token'],
      TOKENKEY
    )) as jwt.JwtPayload;

    const checkUser = (await ctx.prisma.user.findUnique({
      where: {
        email: res.email,
      },
    })) as unknown as User;
    if (checkUser)
      return {
        localize: checkUser.localize,
      };
    else throw new TRPCError({ code: 'UNAUTHORIZED' });
  }),
});
