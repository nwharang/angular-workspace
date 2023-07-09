import { router } from '~server/Utils/trpc.utils';
import { authRoute } from './auth.Router';

export const appRouter = router({
  auth: authRoute,
});
export type AppRouter = typeof appRouter;
