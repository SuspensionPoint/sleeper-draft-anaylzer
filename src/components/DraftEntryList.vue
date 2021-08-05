<template>
  <div>
    <q-input filled v-model="userEnteredDraftUrl" label="League ID">
      <template v-slot:after>
        <q-btn
          color="black"
          label="Add Draft"
          dense
          @click="onDraftSubmitted(userEnteredDraftUrl)"
        />
      </template>
    </q-input>

    <q-list bordered padding>
      <q-item v-for="url in draftUrls" :key="url" tag="label">
        <q-item-section>
          <q-item-label>{{ url }}</q-item-label>
        </q-item-section>

        <!-- <q-item-section side>
          <q-toggle color="blue" val="battery" />
        </q-item-section> -->
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import { DraftsApi } from 'src/api/';

export default defineComponent({
  // name: 'ComponentName'
  setup() {
    let userEnteredDraftUrl = ref();
    let draftUrls = ref(new Set<string>());

    const parseIdFromUrl = (url: string): string | undefined => {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      const draftId = url.match(/(?!\/)\d+(?=)/);
      return draftId?.shift();
    };

    const onDraftSubmitted = (sleeperDraftUrl: string) => {
      const draftId = parseIdFromUrl(sleeperDraftUrl);
      if (draftId) {
        draftUrls.value?.add(draftId);
      }

      // const draftsApi = new DraftsApi();
      // const draftId = '728382747239923712';

      // await draftsApi
      //   .draftDraftIdGet(draftId)
      //   .catch((err) => {
      //     console.log('Error getting draft data', err);
      //   })
      //   .then((draft) => {
      //     console.table(draft);
      //   });

      // await draftsApi
      //   .draftDraftIdPicksGet(draftId)
      //   .catch((err) => {
      //     console.log('error getting picks', err);
      //   })
      //   .then((picks) => {
      //     draftPicks.value = picks;
      //     console.table(picks);
      //   });
    };

    return { userEnteredDraftUrl, onDraftSubmitted, draftUrls };
  },
});
</script>
