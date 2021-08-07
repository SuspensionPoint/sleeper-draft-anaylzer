<template>
  <q-card class="my-card" flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar size="75px">
          <img :src="getAvatarUrl()" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="card-header-label text-overline text-dark">{{
          userInfo?.display_name
        }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-seperator />

    <q-card-actions>
      <q-item-label class="text-overline text-dark"> Draft Data </q-item-label>

      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subitle2">
          <q-img
            v-for="draftPick in userInfo?.picks"
            :key="draftPick.player_id + draftPick.draft_id"
            :src="getImageUrl(draftPick.player.player_id)"
            alt="Image not found"
            loading="lazy"
          >
          </q-img>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { DisplayedUserInfo } from 'src/components/models';
// import { Pick } from 'src/api';

export default defineComponent({
  // name: 'ComponentName'
  props: {
    userInfo: Object as PropType<DisplayedUserInfo>,
  },
  setup(props) {
    const getAvatarUrl = (): string => {
      if (props.userInfo?.avatar) {
        return `https://sleepercdn.com/avatars/${props.userInfo?.avatar}`;
      } else {
        return '';
      }
    };

    const getImageUrl = (playerId: string): string => {
      if (playerId) {
        return `https://sleepercdn.com/content/nfl/players/thumb/${playerId}.jpg`;
      }

      return '';
    };

    return {
      expanded: ref(false),
      getImageUrl,
      getAvatarUrl,
    };
  },
});
</script>

<style lang="scss">
.my-card {
  width: 100%;
  max-width: 350px;
}

.card-header-label {
  font-size: 15px;
}
</style>
