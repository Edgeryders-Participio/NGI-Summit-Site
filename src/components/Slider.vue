<template>
  <div
    class="slider_container"
    @mouseover="clear_interval"
    @mouseleave="toggle_play"
  >

    <transition-group tag="div" class="slider" :name="currentTransition" mode="out-in">
      <div v-for="number in [currentIndex]" :key="number" class="slide md:slide-md border rounded-lg overflow-hidden" v-touch:swipe.left="next" v-touch:swipe.right="prev">
        <div v-if="$mq == 'md'" class="item_post md:item_post-md" :style="{ background: 'url(' + currentSlide.image_url + ')' }">
          <Profile class="ml-3" v-if="show('author')" :data="currentSlide.author" />
        </div>
        <div class="w-full md:w-1/2 p-6 bg-white flex items-start flex-col overflow-scroll md:overflow-auto">
            <div class="item_title md:item_title-md">
            <div v-if="show('title')">
              <a :href="currentSlide.url" target="_blank">
                <h4>{{ currentSlide.title }}</h4>
              </a>
            </div>
              <p class="date" v-if="show('date')">
                <b>{{ currentSlide.created_at | formatDate }}</b>
              </p>
          </div>
          <div class="mt-3" v-html="currentSlide.excerpt"></div>
        </div>
      </div>
    </transition-group>

  </div>
</template>

<script>
import moment from "moment";
import Profile from "@/components/Profile.vue";

export default {
  data() {
    return {
      play: false,
      users: [],
      slides: [],
      currentIndex: 0,
      currentTransition: 'next'
    };
  },
  components: {
   Profile
  },
  methods: {
    show(value) {
      return this.display.includes(value);
    },
    next() {
      this.changeSlide('next');
      this.set_interval();
    },
    prev() {
      this.changeSlide('previous');
      this.set_interval();
    },
    changeSlide(dir) {
      this.currentIndex = dir === 'next' ? this.currentIndex + 1 : this.currentIndex - 1;
      this.currentTransition = dir;
    },
    getUser(userId) {
      if (this.users.length) {
        return this.users.filter(user => user.id == userId)[0];
      }
    },
    clear_interval() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = false;
      }
    },
    set_interval() {
      this.clear_interval();
      var self = this;
      this.interval = setInterval(function() {
        self.changeSlide('next');
      }, this.autoplay);
      this.play = true;
    },
    getPermalink(slug) {
      return "https://edgeryders.eu/t/" + slug;
    },
    toggle_play() {
      if (this.autoplay && this.interval) {
        this.play = false;
        this.clear_interval();
      }
      if (this.autoplay && !this.interval) {
        this.set_interval()
      }
    }
  },
  computed: {
    currentSlide: function() {
      return this.slides[Math.abs(this.currentIndex) % this.slides.length];
    },
    cooked: function() {
      if (!this.currentSlide) { return ""; }

      return this.currentSlide.cooked.replace(
        'class="lightbox-wrapper"',
        'class="lightbox-wrapper hidden"'
      )
    }
  },
  created() {
    if (this.data.length) {
      this.slides = this.data.slice(0);
    }
    else if (this.data.users && this.data.users.length) {
      this.users = this.data.users.slice(0);
    }
    if (this.autoplay != undefined) {
      this.toggle_play();
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(String(value)).format("dddd, MMMM DD YYYY");
    }
  },
  props: ["autoplay", "data", "display"]
};
</script>

<style lang="scss" scoped>
.slider_container {
  width: 100%;
}
.slider{
  overflow: hidden;
  position: relative;
  height: 20em;
  border-radius: 10px;
  width: 100%;
}

.slider .slide {
  position: absolute;
  width: 100%;
  border-radius: 10px;
  top: 0;
  left: 0;
  bottom: 0;
  right:0;
}

.slider .excerpt {
  overflow: auto;
  background: white;
}

.slider .slide .item_title {
    p.date {
      margin: 20px 10px !important;
      background: black;
      display: inline-block;
      width: auto;
      color: white;
      padding: 10px;
      font-size: 14px;
    }
    p.excerpt {
          margin-top: 10px;

      font-size: 14px;
    }
  h4 {
      font-weight: bold;
      background: #2EA48A;
      color: white;
      display: inline;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      padding: 10px 10px;
    }
}
.slide-md {
  .image {
    .item_data {
      color: white;
      position: relative;
      height: 50px;
      display: flex;
      align-items: center;
      padding: 10px 15px 15px;
      bottom: 0;
      width: 100%;
      background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      &:before {
        content: "";
        width: 90%;
        position: absolute;
        left: 5%;
        top: -5px;
        background: rgba(255, 255, 255, 0.3);
        height: 1px;
      }
      p {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 100;
      }
    }
  }
  .item_post-md {
    display: flex;
    padding: 20px;
    height: 100%;
    background: #fff;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
  }
}

.next-leave-active,
.next-enter-active,
.previous-leave-active,
.previous-enter-active {
  transition: 1s;
}
.next-enter {
  transform: translate(100%, 0);
}
.next-leave-to {
  transform: translate(-100%, 0);
}
.previous-enter {
  transform: translate(-100%, 0);
}
.previous-leave-to {
  transform: translate(100%, 0);
}


</style>
