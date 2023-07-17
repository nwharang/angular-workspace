import { Status } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { authContext } from '~server/Middleware/Auth.Middleware';
export class TaskController {
  async getTaskByProjectId(ctx: authContext, input: { projectId: string }) {
    const res = await ctx.prisma.task.findMany({
      where: {
        projectId: input.projectId,
      },
    });
    return {
      data: res,
    };
  }
  async createTask(
    ctx: authContext,
    input: {
      name: string;
      description: string;
      status: Status | 'Backlog';
      endDate: Date;
      memberId: string;
      projectId: string;
    }
  ) {
    const res = await ctx.prisma.task.create({
      data: {
        name: input.name,
        description: input.description,
        status: input.status,
        endDate: input.endDate,
        memberId: input.memberId,
        projectId: input.projectId,
      },
      include: {
        Member: true,
      },
    });
    return res;
  }
  async updateTask(
    ctx: authContext,
    input: {
      id: string;
      name: string;
      description: string;
      status: Status | 'Backlog';
      endDate: Date;
      memberId: string;
      projectId: string;
    }
  ) {
    const res = await ctx.prisma.task.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
        status: input.status,
        endDate: input.endDate,
        memberId: input.memberId,
        projectId: input.projectId,
      },
      include: {
        Member: true,
      },
    });
    return res;
  }
  async deleteTask(ctx: authContext, input: { id: string }) {
    await ctx.prisma.task
      .delete({
        where: {
          id: input.id,
        },
      })
      .catch(() => {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      });
    return { message: 'Success' };
  }
}
