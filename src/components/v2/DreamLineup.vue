<template>
  <div>lol {{ $props.userInfo.user_id }}</div>
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
