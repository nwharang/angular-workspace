// import { TRPCError } from '@trpc/server';
import { Project, InvitationStatus, Member } from '@prisma/client';
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
    return {
      data: (await ctx.prisma.project.findMany({
        where: {
          id: { in: projectList as string[] },
        },
      })) as unknown as Project[],
    };
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
    console.log(isOwner.find((e) => e.owner)?.id);

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
}
