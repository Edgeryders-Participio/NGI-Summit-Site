<template>
  <div class="section md:section-md" :style="containerStyle()" id="partners">
    <div
      class="wrapper md:wrapper-md mx-auto"
      :style="wrapperStyle()"
    >
      <h3 class="font-bold text-left" :class="titleClassSize()">
        Organised by
      </h3>
      <div class="flex mt-4">
        <a class="partner md:partner-md" v-for="item in data.content" :key="item.title" :href="item.url">
        	<img :src="getImg(item.logo)" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
  	getImg(value) {
      return require('../assets/img/logos/' + value);
    },
    wrapperObj() {
      var wrapperObj = {
        maxWidth: ''
      };
      if (this.stylesheet && this.stylesheet.wrapper) {
        wrapperObj["maxWidth"] = this.stylesheet.wrapper;
      };
      if (this.data.style && this.data.style.wrapper) {
        wrapperObj["maxWidth"] = this.data.style.wrapper;
      };
      return wrapperObj;
    }
  },
  props: ["data", "stylesheet"]
};
</script>

