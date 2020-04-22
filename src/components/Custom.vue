<template>
  <div class="section md:section-md" :style="containerStyle()">
    <div
      class="wrapper md:wrapper-md mx-auto"
      :style="wrapperStyle()"
    >
      <div class="flex mb-3" :style="titleStyle()" v-if="data.title" >
      <h3 class="font-bold" :class="titleClassSize()">{{ data.title }}</h3>
      </div>
      <div class="content_wrapper md:content_wrapper-md">
      <div v-if="data.image.url" class="section_image md:section_image-md">
        <img class="w-full" :src="data.image.url" />
      </div>

      <div v-if="data.video.src" class="section_video">
        <video controls class="rounded-lg overflow-hidden">
          <source :src="data.video.src" type="video/mp4" />
        </video>
      </div>
      
      <div>
        <div v-if="html" v-html="data.text.content" class="w-full section_text"></div>
        <div v-else class="w-full section_text md:pt-4">{{ data.text.content }}</div>
    
        <div v-if="data.text.buttons" class="action_container">
          <a class="action" v-for="item in data.text.buttons" :href="item.url" :style="styleObj(item)" :key="item.url" target="_blank">
            {{item.text}}
          </a>
        </div>

      </div>
</div>
  </div>
</div>
</template>

<script>
export default {
  props: ["data", "html", "stylesheet"],
  methods: {
    styleObj(item) {
      var styleObj = {
        background: '#000',
        color: '#fff'
      };
      if (item.background) {
        styleObj["background"] = item.background;
      };
      if (item.color) {
        styleObj["color"] = item.color;
      };
      return styleObj;
    }
  }
};
</script>
