<template>
  <div class="section md:section-md mt-10" :style="{background: data.style && data.style.background}" id="people">
    <div class="section_title md:section_title-md justify-between items-center pt-8 mx-auto text-center" v-if="data.title" :style="titleWidth()" >
      <h3 class="text-2xl md:text-4xl text-center md:text-left w-full">{{ data.title }}</h3>
      <div class="toggle_menu mr-6 md:flex md:mr-0" v-if="data.view == 'featured' && $mq == 'md'">
        <div
          class="toggle previous"
          @click="changeSlide('back')"
        ></div>
        <div
          class="toggle next"
          @click="changeSlide('next')"
        ></div>
      </div>
    </div>
    <div
      class="wrapper md:wrapper-md mx-auto"
      v-if="data.text"
      :style="wrapperWidth()"
    >
      <div v-if="data.text.content" class="section_text" v-html="data.text.content">
      </div>
    </div>

    <Slider
      v-if="topics && data.view == 'featured'"
      :autoplay="5000"
      :data="topics"
      :style="titleWidth()"
      class="mx-auto  pb-10"
      ref="slider"
      :display="data.display"
    />

    <Row v-if="topics && data.view == 'cards'" :topics="topics" :display="data.display" />
  </div>
</template>

<script>
import Slider from "@/components/Slider.vue";
import Row from "@/components/Row.vue";
import axios from "axios";

export default {
  props: ["data", "stylesheet", "baseUrl"],
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
        if (this.data.sort) {
          this.sortBy(data, this.data.sort_by.property, this.data.sort_by.order)
        }
      });
    },
    sortBy(data, value, order) {
      var ord_val = -1;
      if (order == 'ascending') {
        ord_val = 1;
      };
      var sorted = data.sort((a,b) => (a[value] > b[value]) ? ord_val : ((b[value] > a[value]) ? -ord_val : 0));
      this.data = sorted;
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
