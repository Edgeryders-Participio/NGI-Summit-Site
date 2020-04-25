<template>
  <div class="section md:section-md" :style="containerStyle(data.style)">
    <div class="flex justify-between items-center p-0 m-0 mx-auto" v-if="data.title && $mq=='md'" :style="textStyle('title', data.style)">
      <h3 :class="titleClassSize(data.style)">{{ data.title }}</h3>
      <div class="toggle_menu">
          <div
          class="toggle previous"
          :style="uiStyle('toggle', data.style)"
          @click="previous"
          ></div>
          <div
            class="toggle next"
            :style="uiStyle('toggle', data.style)"
            @click="next"
          ></div>
      </div>
    </div>
    <div
      class="flex mx-auto px-5"
    >

      <List v-if="$mq=='sm'" :header="data.title" :items="data.profiles" image="image" title="name" info="excerpt" filter="name" url="url" :search="true" type="user" />

      <div class="user_grid md:user_grid-md mx-auto pb-8" v-else style="width: 80vw">
        <a
          class="user_avatar md:user_avatar-md"
          v-for="item in data.profiles.slice(thumbnail_index, thumbnail_index + thumbnail_count)"
          :key="item.name"
          :href="item.url"
          target="_blank"
          :style="{ backgroundImage: 'url(' + item.image + ')' }"
        >
          <div class="profile_info" :style="textStyle('paragraph', data.style)">
            <h2>{{item.name}}</h2>
            <p>{{item.excerpt}}</p>
          </div>
        </a>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import List from "@/components/ui/List.vue";
export default {
  props: ["data", "stylesheet", "baseUrl", "globalStyle"],
  data() {
    return {
      people: [],
      thumbnail_count: 12,
      thumbnail_index: 0,
      selected: null,
      toggle: false,
      search: '',
      view: 'custom_ngi_people'
    };
  },
  methods: {
    previous() {
      if (this.thumbnail_index - this.thumbnail_count < 0) {
        this.thumbnail_index = 0;
      } else {
        this.thumbnail_index = this.thumbnail_index - this.thumbnail_count;
      }
    },
    next() {
      if (this.thumbnail_index + this.thumbnail_count > this.data.profiles.length) {
        this.thumbnail_index = 0;
      } else {
        this.thumbnail_index = this.thumbnail_index + this.thumbnail_count;
      }
    },
    setActive(value) {
      this.selected = this.people.filter(x => x.id == value)[0];
      this.toggle = !this.toggle;
    },
    toggleView(view) {
      this.view = view;
    },
    getUser(excerpt) {
      var username = excerpt.match(/(@[^\s]*(?=<\/a>))/g);
      if (username == null) {
        return null;
      } else {
        return username[0];
      }
    },
    getPeople(tag) {
      axios.get(
        `${this.baseUrl}/webkit_components/topics.json?serializer=organizer&tags=${tag}&per=500`
      ).then(({ data }) => {
        function mapProfile(entry) {
          var obj = {
            id: entry.id,
            name: entry.title,
            excerpt: entry.excerpt,
            image: entry.image_url,
            url: entry.url
          }
          return obj
        }
        this.people = data.map(mapProfile)
        this.selected = this.people[0];
      });
    }
  },
  computed: {
    filteredPeople() {
      return this.people.filter(item => {
        return item.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  components: {
    List
  },
  mounted: function() {
    this.view = this.data.views[0]
  }
};
</script>

