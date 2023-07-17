import { router } from '~server/Utils/trpc.utils';
import { z } from 'zod';
import { publicProcedure } from '~server/Utils/trpc.utils';
import { AuthMiddleware } from '~server/Middleware/Auth.Middleware';
import ProjectController from '~server/Controller/Project.Controller';
export const projectRoute = router({
  list: publicProcedure.use(AuthMiddleware).query(({ ctx }) => {
    return new ProjectController().getAllProject(ctx);
  }),
  create: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new ProjectController().createProject(ctx, input);
    }),
  delete: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new ProjectController().deleteProject(ctx, input);
    }),
  addMember: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        projectId: z.string(),
        email: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new ProjectController().addMember(ctx, input);
    }),
  getMember: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return new ProjectController().getMemberByProjectId(ctx, input);
    }),
  removeMember: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        memberId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return new ProjectController().removeMember(ctx, input);
    }),
  isOwner: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return new ProjectController().isOwner(ctx, input);
    }),
});
