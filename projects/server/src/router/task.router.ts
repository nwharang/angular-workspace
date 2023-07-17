import { router } from '~server/Utils/trpc.utils';
import { z } from 'zod';
import { publicProcedure } from '~server/Utils/trpc.utils';
import { AuthMiddleware } from '~server/Middleware/Auth.Middleware';
import { TaskController } from '~server/Controller/Task.Controller';
import { Status } from '@prisma/client';

export const taskRoute = router({
  getTaskByProjectId: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return new TaskController().getTaskByProjectId(ctx, input);
    }),
  createTask: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        status: z.nativeEnum(Status),
        endDate: z.date(),
        memberId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new TaskController().createTask(ctx, input);
    }),
  updateTask: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        status: z.nativeEnum(Status),
        endDate: z.date(),
        memberId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new TaskController().updateTask(ctx, input);
    }),
  deleteTask: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new TaskController().deleteTask(ctx, input);
    }),
});
