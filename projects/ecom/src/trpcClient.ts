import { createTRPCProxyClient, httpLink } from '@trpc/client';
import type { AppRouter } from '~server/Router';
import superjson from 'superjson';

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpLink({
      url: 'http://localhost:4200/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});
