import { boot } from 'quasar/wrappers';
import VueAnimXyz from '@animxyz/vue3';
import '@animxyz/core';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  // something to do
  app.use(VueAnimXyz);
});
