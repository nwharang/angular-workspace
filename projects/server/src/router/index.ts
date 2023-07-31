import { router } from '~server/Utils/trpc.utils';
import { authRoute } from './auth.Router';
import { userRoute } from './user.Router';
import { projectRoute } from './project.Router';
import { memberRoute } from './member.Router';
import { localizeRoute } from './localize.Router';
import { taskRoute } from './task.router';
import { productRoute } from './product.Router';
import { cartRoute } from './cart.Router';
productRoute
export const appRouter = router({
  auth: authRoute,
  user: userRoute,
  project: projectRoute,
  member: memberRoute,
  localize: localizeRoute,
  task: taskRoute,
  product: productRoute,
  cart: cartRoute,
});
export type AppRouter = typeof appRouter;
