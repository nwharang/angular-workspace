// import { TRPCError } from '@trpc/server';
import { Member } from '@prisma/client';
import { authContext } from '~server/Middleware/Auth.Middleware';

export default class MemberController {
  async getAllList(ctx: authContext) {
    const memberList = (await ctx.prisma.member.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        Project: true,
      },
    })) as unknown as Member[];
    return {
      data: memberList,
    };
  }
}
