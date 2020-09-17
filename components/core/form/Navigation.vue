<template>
  <div class="navigation flex">
    <div v-if="!allowBack" />
    <button
      :title="backTitle"
      class="custom_form_button"
      v-if="allowBack"
      v-on:click="back"
    >
      {{ backText }}
    </button>
    <Progress :index="index" :maxIndex="maxIndex" />
    <button
      :title="nextTitle"
      class="custom_form_button"
      :style="uiStyle('action', stylesheet)"
      v-if="allowNext"
      v-on:click="next"
    >
      {{ nextText }}
    </button>
  </div>
</template>

<script>
import Progress from "./Progress";

export default {
  props: {
    back: Function,
    stylesheet: Object,
    globalStyle: Object,
    backText: String,
    backTitle: String,
    next: Function,
    nextText: String,
    nextTitle: String,
    nextUrl: String,
    index: Number,
    maxIndex: Number
  },
  computed: {
    allowBack() {
      return this.back && this.backText;
    },
    allowNext() {
      return this.next && this.nextText;
    }
  },
  components: { Progress }
};
</script>

<style scoped>
.flex {
  @apply mt-4;
  display: flex;
  width: 100%;
  align-items: center;
}
</style>
