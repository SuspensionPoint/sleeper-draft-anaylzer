<template>
  <q-layout view="hHh lpR fFf" class="site-theme font-helvetica">
    <q-page-container>
      <router-view />
      <!-- <q-page style="background-color: pink">
        <div class="tab-pages" style="background: green">Test</div>
      </q-page> -->
      <!-- <q-page id="troublemaker" style="background-color: green"> </q-page> -->
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {},
});
</script>

<style lang="scss" scoped>
@import 'src/css/app.scss';

.site-theme {
  background-color: $theme-sleeper-blue;
  color: white;
}
</style>
