<template>
  <div class="section md:section-md" :style="containerStyle(data.style)">
    <div class="flex font-bold justify-between items-center mx-auto" v-if="data.title" :style="textStyle('title', data.style)" >
      <h3 class="m-0 p-0 w-full" :class="titleClassSize(data.style)">{{ data.title }}</h3>
      <div class="toggle_menu mr-6 md:flex md:mr-0" v-if="data.view == 'featured' && $mq == 'md'">
        <div
          class="toggle previous"
          :style="uiStyle('toggle', data.style)"
          @click="changeSlide('back')"
        ></div>
        <div
          class="toggle next"
          :style="uiStyle('toggle', data.style)"
          @click="changeSlide('next')"
        ></div>
      </div>
    </div>
    <div
      class="wrapper md:wrapper-md mx-auto"
      v-if="data.text"
      :style="wrapperStyle(data.style)"
    >
      <div v-if="data.text.content" class="section_text" :style="textStyle('paragraph', data.style)" v-html="data.text.content">
      </div>
    </div>

    <Slider
      v-if="topics && data.view == 'featured'"
      :autoplay="5000"
      :data="topics"
      :stylesheet="data.style"
      class="mx-auto  pb-10"
      ref="slider"
      :globalStyle="globalStyle"
      :display="data.display"
    />

    <Row v-if="topics && data.view == 'cards'" :topics="topics" :stylesheet="data.style" :display="data.display" :globalStyle="globalStyle" />
  </div>
</template>

<script>
import Slider from "@/components/ui/Slider.vue";
import Row from "@/components/ui/Row.vue";
import axios from "axios";

export default {
  props: ["data", "stylesheet", "baseUrl", "globalStyle"],
  data() {
    return {
      topics: null,
      full_width: false
    };
  },
  components: {
    Slider,
    Row
  },
  created() {
    if (this.data.tag) {
      this.getTopics(this.data.tag, 'tags');
    }
    if (this.data.category) {
      this.getTopics(this.data.category, 'category');
    }
  },
  methods: {
    getTopics(value, filter) {
      axios.get(
        `${this.baseUrl}/webkit_components/topics.json?${filter}=${value}&per=500&serializer=organizer`
      ).then(({ data }) => {
        this.topics = data;
        if (this.data.sort_by) {
           data = this.sortBy(data, this.data.sort_by.property, this.data.sort_by.order)
         }
        this.topics = data;
      });
    },
    sortBy(data, value, order) {
      var ord_val = -1;
      if (order == 'ascending') {
        ord_val = 1;
      };
      var sorted = data.sort((a,b) => (a[value] > b[value]) ? ord_val : ((b[value] > a[value]) ? -ord_val : 0));
      return sorted
    },
    changeSlide(value) {
      if(value == 'next') {
        this.$refs.slider.next()
      }
      if(value == 'back') {
        this.$refs.slider.back()
      }
    }
  }
};
</script>
