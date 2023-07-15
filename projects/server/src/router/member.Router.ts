import { router } from '~server/Utils/trpc.utils';
import { publicProcedure } from '~server/Utils/trpc.utils';
import { AuthMiddleware } from '~server/Middleware/Auth.Middleware';
import MemberController from '~server/Controller/Member.Controller';

export const memberRoute = router({
  list: publicProcedure.use(AuthMiddleware).query(({ ctx }) => {
    return new MemberController().getAllList(ctx);
  }),
});
