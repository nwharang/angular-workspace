import { router } from '~server/Utils/trpc.utils';
import { authRoute } from './auth.Router';
import { userRoute } from './user.Router';

export const appRouter = router({
  auth: authRoute,
  user: userRoute,
});
export type AppRouter = typeof appRouter;
