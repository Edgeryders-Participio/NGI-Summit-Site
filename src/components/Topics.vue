<template>
  <div class="md:mt-2" :class="{'section-md': custom.view == 'featured' && $mq == 'md' }">
    <div class="section_title items-center md:section_title-md justify-between">
      <h1 class="pt-1 px-6 md:px-0 leading-tight">{{ custom.title }}</h1>
      <div class="toggle_menu mr-6 md:flex md:mr-0" v-if="custom.view == 'featured' && $mq == 'md'">
        <div
          class="toggle previous"
          @click="changeSlide('previous')"
        ></div>
        <div
          class="toggle next"
          @click="changeSlide('next')"
        ></div>
      </div>
    </div>
    <div
      class="wrapper md:wrapper-md"
      v-if="custom.text"
      :class="{ reverse: custom.text.position == 'left' }"
    >
      <div v-if="custom.text.content" class="w-full font-light px-6 pb-3 md:w-2/3 md:pt-5 md:px-0 md:pb-0 md:text-2xl md:pl-2 md:leading-normal md:font-light section_text" v-html="custom.text.content">
      </div>
    </div>

    <Slider
      v-if="topics && custom.view == 'featured'"
      :autoplay="5000"
      :custom="topics"
      ref="slider"
      :display="custom.display"
    />

    <Row v-if="topics && custom.view == 'cards'" :topics="topics" :display="custom.display" />
  </div>
</template>

<script>
import Slider from "@/components/Slider.vue";
import Row from "@/components/Row.vue";
import axios from "axios";

export default {
  props: ["custom", "baseUrl"],
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
    if (this.custom.tag) {
      this.getTopics(this.custom.tag, 'tags');
    }
    if (this.custom.category) {
      this.getTopics(this.custom.category, 'category');
    }
  },
  methods: {
    getTopics(value, filter) {
      axios.get(
        `${this.baseUrl}/webkit_components/topics.json?${filter}=${value}&per=500&serializer=organizer`
      ).then(({ data }) => {
        this.topics = data;
        if (this.custom.sort) {
          this.sortBy(data, this.custom.sort_by.property, this.custom.sort_by.order)
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
      if(value == 'previous') {
        this.$refs.slider.previous()
      }
    }
  }
};
</script>
