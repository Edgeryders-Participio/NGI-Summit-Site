<template>
  <div class="section md:section-md" :style="containerStyle(data.style)">
    <div
      class="wrapper md:wrapper-md mx-auto"
      :style="wrapperStyle(data.style)"
    >
      <div class="flex" :style="textStyle('title', data.style)" v-if="data.title" >
        <h3 :class="titleClassSize(data.style)">{{ data.title }}</h3>
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
        <div v-html="data.text.content" :style="textStyle('paragraph', data.style)" class="w-full section_text"></div>
    
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
  props: ["data", "html", "stylesheet", "globalStyle"],
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
