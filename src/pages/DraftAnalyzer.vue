<template>
  <q-page class="site-theme" padding>
    <!-- content -->
    <!-- <h1 class="text-center">Draft Analyzer</h1> -->
    <draft-entry-list />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DraftEntryList from 'src/components/DraftEntryList.vue';
import { useStore } from 'src/store';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: { DraftEntryList },
  // name: 'PageName'
  setup() {
    const store = useStore();
    const route = useRoute();

    const draftYear = route.params.year;
    const ids = route.params.idList as string;
    if (draftYear && ids) {
      const idList = ids === '' ? [] : ids.split(',');
      idList.forEach((user_id: string) => {
        store
          .dispatch('getDraftsFromUserId', { userId: user_id, year: draftYear })
          .catch((err) => {
            console.log(`Error loading data for user id: ${user_id}`, err);
          });
      });
    }
  },
});
</script>

<style lang="scss">
@import 'src/css/app.scss';

.site-theme {
  background-color: $theme-background-color;
}
</style>
