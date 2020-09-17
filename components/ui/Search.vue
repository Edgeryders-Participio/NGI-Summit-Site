<template>
  <div class="md:mb-2">
    <input class="rounded-lg" :style="hoverStyle('highlight', stylesheet)" v-model="search" placeholder="search events" />
  </div>
</template>

<script>
import { bus } from '@/main'

export default {
  name: 'Search',
  data() {
    return {
      search: ""
    };
  },
  watch: {
    search() {
      bus.$emit('clearDate', null);
      bus.$emit('clearType', null);
      bus.$emit('filterSearch', this.search);
    }
  },
  props: ["stylesheet", "globalStyle"]
};
</script>

<style lang="scss" scoped>

input {
  @apply w-full p-2 mb-4 border;
  &:focus {
    border-color: var(--hover-border-color);
  }
}
</style>
