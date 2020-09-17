<template>
  <div class="hero md:hero-md" :style="styleObject">
    
    <CategoryView v-if="category" :globalStyle="globalStyle" :data="category" :baseUrl="baseUrl"></CategoryView>
    <CustomView :globalStyle="globalStyle" v-else :data="data"></CustomView>

  </div>
</template>

<script>
import moment from "moment";
import CustomView from "@/components/ui/Hero_Custom.vue";
import CategoryView from "@/components/ui/Hero_Category.vue";

export default {
  methods: {
  },
  components: {
    CustomView,
    CategoryView
  },
  computed: {
    styleObject() {
      if (this.data.background.url) {
        return {
          background: `url('${this.data.background.url}')`,
          backgroundPosition: "0",
          backgroundSize: "cover"
        }
      } else if (this.data.background.color) {
        return { 
          background: this.data.background.color 
        }
      } 
      else {
        return { background: "#efefef" }
      }
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("MMMM Do YYYY");
    }
  },
  props: ["category", "data", "baseUrl", "globalStyle"]
};
</script>
