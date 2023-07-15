import * as fs from 'node:fs';
import { join } from 'path';
import { router } from '~server/Utils/trpc.utils';
import { publicProcedure } from '~server/Utils/trpc.utils';
export const localizeRoute = router({
  en: publicProcedure.query(async () => {
    return JSON.parse(
      fs.readFileSync(
        join(__dirname, '../../app/browser/assets/i18n', 'en.json'),
        'utf-8'
      )
    );
  }),
  vi: publicProcedure.query(async () => {
    return JSON.parse(
      fs.readFileSync(
        join(__dirname, '../../app/browser/assets/i18n', 'vi.json'),
        'utf-8'
      )
    );
  }),
});
