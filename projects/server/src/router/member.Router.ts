import { router } from '~server/Utils/trpc.utils';
import { publicProcedure } from '~server/Utils/trpc.utils';
import { AuthMiddleware } from '~server/Middleware/Auth.Middleware';
import MemberController from '~server/Controller/Member.Controller';
import { z } from 'zod';
import { InvitationStatus } from '@prisma/client';

export const memberRoute = router({
  list: publicProcedure.use(AuthMiddleware).query(({ ctx }) => {
    return new MemberController().getAllList(ctx);
  }),
  invitation: publicProcedure
    .use(AuthMiddleware)
    .input(
      z.object({
        projectId: z.string(),
        status: z.nativeEnum(InvitationStatus),
      })
    )
    .mutation(({ ctx, input }) => {
      return new MemberController().invitation(ctx, input);
    }),
});
