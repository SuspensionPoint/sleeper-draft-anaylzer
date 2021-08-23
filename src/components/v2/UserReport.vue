<template>
  <div>
    <h1>{{ $props.userInfo.display_name }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { DisplayedUserInfo } from '../models';
export default defineComponent({
  // name: 'ComponentName'
  props: {
    userInfo: {
      type: Object as PropType<DisplayedUserInfo>,
      required: true,
    },
  },
});
</script>
