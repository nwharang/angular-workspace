// import { TRPCError } from '@trpc/server';
import { InvitationStatus } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { authContext } from '~server/Middleware/Auth.Middleware';

export default class MemberController {
  async getAllList(ctx: authContext) {
    const memberList = await ctx.prisma.member.findMany({
      where: {
        AND: [{ userId: ctx.user.id }, { InvitationStatus: 'Pending' }],
      },
      include: {
        Project: true,
      },
    });
    return memberList;
  }

  async invitation(
    ctx: authContext,
    input: { projectId: string; status: InvitationStatus }
  ) {
    const member = await ctx.prisma.member.findFirst({
      where: {
        projectId: input.projectId,
        userId: ctx.user.id,
      },
    });
    if (member) {
      await ctx.prisma.member.update({
        where: {
          id: member.id,
        },
        data: {
          InvitationStatus: input.status,
        },
      });
      return await this.getAllList(ctx);
    }
    throw new TRPCError({ code: 'NOT_FOUND' });
  }
}
