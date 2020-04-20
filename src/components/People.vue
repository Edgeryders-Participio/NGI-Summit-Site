<template>
  <div class="section md:section-md" :style="{background: data.style && data.style.background}" id="people">
    <div class="section_title md:section_title-md justify-between items-center pt-4 md:pt-8" :style="titleWidth()" >
      <h3 v-if="$mq=='md'" class="text-2xl md:text-4xl">{{ data.title }}</h3>

      <div class="toggle_menu" v-if="data.views.length > 1">
        <div
          class="toggle list"
          v-if="data.view.includes('list')"
          :class="{ active: view == 'list' }"
          @click="toggleView('list')"
        ></div>
        <div
          class="toggle grid"
          v-if="data.view.includes('grid')"
          :class="{ active: view == 'grid' }"
          @click="toggleView('grid')"
        ></div>
      </div>
      <div class="toggle_menu" v-if="data.views.includes('custom_ngi_people') && $mq=='md'">
          <div
          class="toggle previous"
          @click="previous"
          ></div>
          <div
            class="toggle next"
            @click="next"
          ></div>
      </div>
    </div>
    <div
      class="flex mx-auto px-5"
    >
      <List v-if="$mq=='sm'" :header="data.title" :items="people" image="image" title="name" info="excerpt" filter="name" url="url" :search="true" type="user" />

      <div class="user_grid md:user_grid-md mx-auto pb-8" v-if="$mq=='md'" 
      style="width: 80vw">
        <a
          class="user_avatar md:user_avatar-md"
          v-for="item in data.profiles.slice(thumbnail_index, thumbnail_index + thumbnail_count)"
          :key="item.name"
          :href="item.url"
          target="_blank"
          :style="{ backgroundImage: 'url(' + item.image + ')' }"
        >
          <div class="profile_info">
            <h2>{{item.name}}</h2>
            <p>{{item.excerpt}}</p>
          </div>
        </a>
      </div>
      <div class="user_grid md:user_grid-md" v-if="view == 'grid'">
        <div
          class="user_avatar md:user_avatar-md"
          v-for="(item, index) in data.profiles"
          :key="index"
          @click="setActive(item.id)"
          :class="{ active: selected.id === item.id }"
          :style="{ backgroundImage: 'url(' + item.image_url + ')' }"
        >
        </div>
      </div>
      
      <div class="user_info md:user_info-md" v-if="selected && (view == 'grid' || view == 'list')">
        <a
          class="user_name"
          :href="selected.url"
          target="_blank"
        >
          {{ selected.title }} <span>{{ getUser(selected.excerpt) }}</span>
        </a>

        <div class="user_bio md:user_bio-md">
          {{selected.excerpt}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import List from "@/components/MobileList.vue";
export default {
  props: ["data", "stylesheet", "baseUrl"],
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
      if (this.thumbnail_index + this.thumbnail_count > this.people.length) {
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

