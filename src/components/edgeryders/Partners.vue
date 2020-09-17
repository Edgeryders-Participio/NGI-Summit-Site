<template>
  <div class="section md:section-md" :style="containerStyle(data.style)" id="partners">
    <div
      class="wrapper md:wrapper-md mx-auto"
      :style="wrapperStyle(data.style)"
    >
      <div class="flex" :style="textStyle('title', data.style)" v-if="data.title" >
        <h3 :class="titleClassSize(data.style)">{{ data.title }}</h3>
      </div>
      <div class="flex my-4">
        <a class="partner md:partner-md" v-for="item in data.content" :key="item.title" :href="item.url">
        	<img :src="item.logo" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
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
  props: ["data", "stylesheet", "globalStyle"]
};
</script>

