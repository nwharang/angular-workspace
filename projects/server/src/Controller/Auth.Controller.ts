import { TRPCError } from '@trpc/server';
import { compare, hash } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { Context } from '~server/Utils/trpc.utils';

const TOKENKEY = 'TEST';

export default class AuthController {
  /**
   * Login User
   */
  async login(ctx: Context, input: { email: string; password: string }) {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!user)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not exist',
      });
    const comparePassword = await compare(input.password, user.password);
    if (comparePassword) {
      const access_token = jwt.sign({ email: user.email }, TOKENKEY, {
        expiresIn: '24h',
      });
      ctx.res.cookie('access_token', access_token, {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
      return {
        message: 'Success',
      };
    }
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  /**
   * Register User
   */
  async register(
    ctx: Context,
    input: { email: string; password: string }
  ) {
    let user = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (user)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User already exists',
      });
    const hashedPassword = await hash(input.password, 10);
    user = (await ctx.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword
      },
    })) as unknown as User;
    const access_token = jwt.sign({ id: user.id, email: user.email }, TOKENKEY);
    ctx.res.cookie('access_token', access_token, {
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      message: 'Success',
    };
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  async logout(ctx: Context) {
    ctx.res.clearCookie('access_token', {
      path: '/',
    });
    return;
  }
}
