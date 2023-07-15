import { router } from '~server/Utils/trpc.utils';
import { authRoute } from './auth.Router';
import { userRoute } from './user.Router';
import { projectRoute } from './project.Router';
import { memberRoute } from './member.Router';
import { localizeRoute } from './localize.Router';
export const appRouter = router({
  auth: authRoute,
  user: userRoute,
  project: projectRoute,
  member: memberRoute,
  localize: localizeRoute,
});
export type AppRouter = typeof appRouter;
