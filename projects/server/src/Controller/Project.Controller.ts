// import { TRPCError } from '@trpc/server';
import { InvitationStatus, Member } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { authContext } from '~server/Middleware/Auth.Middleware';

export default class ProjectController {
  async getAllProject(ctx: authContext) {
    const memberList = (await ctx.prisma.member.findMany({
      where: {
        userId: ctx.user.id,
        InvitationStatus: InvitationStatus.Accepted,
      },
    })) as unknown as Member[];
    const projectList = memberList.map((e) => e.projectId);
    if (!projectList.length)
      return {
        data: projectList,
      };
    return ctx.prisma.project.findMany({
      where: {
        id: { in: projectList as string[] },
      },
    });
  }
  async createProject(
    ctx: authContext,
    input: { name: string; description?: string }
  ) {
    const res = await ctx.prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        member: {
          create: [
            {
              userId: ctx.user.id,
              InvitationStatus: InvitationStatus.Accepted,
              owner: true,
            },
          ],
        },
      },
      include: {
        member: true,
      },
    });
    return {
      message: res ? 'Success' : 'Error',
    };
  }
  async deleteProject(ctx: authContext, input: { id: string }) {
    const res = await ctx.prisma.project.delete({
      where: {
        id: input.id,
      },
      include: {
        member: true,
        task: true,
      },
    });
    return {
      message: res ? 'Success' : 'Error',
    };
  }
  async addMember(
    ctx: authContext,
    input: { projectId: string; email: string }
  ) {
    if (input.email === ctx.user.email)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: "Can't Invite Yourseft",
      });
    const isOwner = await ctx.prisma.member.findMany({
      where: {
        OR: [{ projectId: input.projectId }],
      },
      include: {
        User: true,
      },
    });

    if (isOwner.find((e) => e.owner)?.userId !== ctx.user.id)
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not owner of this project',
      });
    if (isOwner.find((e) => e.User?.email === input.email))
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User already invited',
      });
    const newMember = await ctx.prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!newMember)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invite user not exist',
      });
    const res = await ctx.prisma.project.update({
      where: {
        id: input.projectId,
      },
      include: {
        member: true,
      },
      data: {
        member: {
          create: [
            {
              userId: newMember.id,
              InvitationStatus: 'Pending',
            },
          ],
        },
      },
    });
    return {
      message: res ? 'Success' : 'Error',
    };
  }
  async getMemberByProjectId(ctx: authContext, input: { projectId: string }) {
    const res = await ctx.prisma.member.findMany({
      where: {
        AND: [
          { projectId: input.projectId },
          { InvitationStatus: InvitationStatus.Accepted },
        ],
      },
      include: {
        User: true,
      },
    });
    return res;
  }
  async removeMember(ctx: authContext, input: { memberId: string }) {
    const check = await ctx.prisma.member.findUnique({
      where: {
        id: input.memberId,
      },
    });
    if (!check || check.owner)
      throw new TRPCError({
        code: 'BAD_REQUEST',
      });
    const res = await ctx.prisma.member.delete({
      where: {
        id: input.memberId,
      },
    });

    return {
      message: res ? 'Success' : 'Error',
    };
  }
  async isOwner(ctx: authContext, input: { projectId: string }) {
    const res = await ctx.prisma.member.findMany({
      where: {
        AND: [
          { projectId: input.projectId },
          { userId: ctx.user.id },
          { owner: true },
        ],
      },
    });
    return res.length > 0;
  }
}
