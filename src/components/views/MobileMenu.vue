<template>
  <div class="mobile_menu" :class="{'active': open}" v-if="$mq == 'sm'">
      <div class="mobile_menu_container">
        <scrollactive
        class="mobile_nav"
        active-class="active"
        :offset="80"
        :duration="800"
        bezier-easing-value=".5,0,.35,1"
      >
        <a
          class="mobile-nav-item scrollactive-item"
          :href="'#' + item.id"
          @click="toggleMenu()"
          v-for="item in data"
          :key="item.id"
          >{{ item.id }}</a
        >
      </scrollactive>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toggleMenu(){
      this.$emit('toggle');
    }
  },
  props: ["open", "data"]
};
</script>

<style lang="scss">
.mobile_menu {
  @apply border-t fixed;
  width: 100vw;
  height: 90vh;
  overflow-y: scroll;
  z-index: 9999;
  left: 0;
  top: 60px;
  background: #fafafa;
  transform: scale(0);
  transition: transform .3s ease;
  &.active {
    transform: scale(1);
    transition: transform .45s ease;
  }
  .mobile_nav {
    display: flex;
    width: 100%;
    flex-direction: column;
    .mobile-nav-item {
      @apply p-4 px-6 border-b border-gray-200 font-bold text-lg;
      text-transform: capitalize;
    }
  }
}
</style>
