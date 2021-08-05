<template>
  <q-page padding>
    <!-- content -->
    <h1 center>Draft Analyzer</h1>
    <draft-entry-list />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DraftEntryList from 'src/components/DraftEntryList.vue';

export default defineComponent({
  components: { DraftEntryList },
  // name: 'PageName'
});
</script>
