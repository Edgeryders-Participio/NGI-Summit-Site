<template>
  <div class="row md:row-md">
    <div class="card_row" ref="content" v-if="users">
      <Card
        v-for="(item, index) in users"
        :key="index"
        class="card md:card-md"
        :url="item.url"
      >
        <template slot="front">
          <div
            class="avatar mt-4"
            @click="scroll"
            :style="{ backgroundImage: 'url(' + item.avatar_url + ')' }"
          ></div>
          <div class="card_name">
            <h3>
              <span v-if="item.name">{{ item.name }}</span
              ><span v-else>{{ item.username }}</span>
            </h3>
            <p>Active since {{ item.created_at | formatDate }}</p>
          </div>
        </template>
        <template slot="back">
          <h3>
            About
          </h3>
          <div class="card_excerpt" v-html="item.bio_raw"></div>
          <div class="card_footer">Connect with @{{ item.username }}</div>
        </template>
      </Card>
    </div>
    <div class="card_row md:card_row-md" ref="content" v-if="topics">
      <Card
        v-for="item in topics"
        :key="item"
        ref="flipCard"
        :url="item.url"
        class="card topic md:card-md"
      >
        <template slot="image">
          <div
            class="image"
            :style="{ backgroundImage: 'url(' + item.image_url + ')' }"
          ></div>
        </template>
        <template slot="front">
          <div class="topic_data">
            <div class="topic_title" v-if="show('title')">
              <h2>{{ item.title }}</h2>
            </div>

            <Profile v-if="show('author')" :data="item.author" />
          </div>
        </template>
        <template slot="back">
          <div class="card_excerpt" v-html="strippedCooked(item.cooked)"></div>
          <a class="card_footer" :href="item.url" target="_blank">Discuss this topic</a>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Card from "@/components/FlipCard.vue";
import Profile from "@/components/Profile.vue";
export default {
  props: ["users", "topics", "display"],
  components: {
    Card,
    Profile
  },
  data() {
    return {
      flip: false
    };
  },
  methods: {
    strippedCooked(cooked) {
      let stripped = cooked.replace( /(<span([^>].*)<\/span>)/ig, '');
      return stripped.replace( /(<([^>]+)>)/ig, '');
    },
    show(value) {
      return this.display.includes(value);
    },
    toggleCard(){
      this.$refs.flipCard.flipMobile();
    },
    scroll() {
      this.$nextTick(() => {
        this.$refs.content.scrollLeft += 1000;
      });
    },
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("MM/DD/YY");
    }
  }
};
</script>

<style lang="scss">


</style>
