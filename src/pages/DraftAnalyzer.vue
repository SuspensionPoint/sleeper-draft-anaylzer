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
    const season = 2021;
    const ids = route.params.idList as string;
    if (season && ids) {
      const idList = ids === '' ? [] : [...new Set(ids.split(','))];
      idList.forEach((id: string) => {
        const split = id.split(':');
        const userId = split[0];
        const draftSlot = split[1];
        const privateOnly = split[2];
        const isPrivateOnly = privateOnly === 'PrivateOnly';
        store
          .dispatch('getDraftsFromUserId', {
            userId: userId,
            season,
            draftSlot: draftSlot ? draftSlot : 'All',
            privateDraftsOnly: isPrivateOnly,
          })
          .catch((err) => {
            console.log(
              `Error loading data for user id: ${userId} draft slot: ${draftSlot}`,
              err
            );
          });
      });
    }
  },
});
</script>

<style lang="scss">
@import 'src/css/app.scss';

.site-theme {
  background-color: $theme-sleeper-blue;
}
</style>
