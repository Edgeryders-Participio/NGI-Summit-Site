<template>
  <div class="w-full bg-gray-100 p-6 md:p-8 md:px-20" id="people">
    <div class="section_title md:section_title-md justify-between items-center">
      <h3 class="text-2xl md:text-4xl">{{ custom.title }}</h3>
      <div class="toggle_menu" v-if="$mq == 'md'">
        <div
          class="toggle list"
          v-if="$mq == 'md'"
          :class="{ active: view == 'list' }"
          @click="toggleView('list')"
        ></div>
        <div
          class="toggle grid"
          :class="{ active: view == 'grid' }"
          @click="toggleView('grid')"
        ></div>
      </div>
    </div>
    <div class="flex">
      <div class="user_grid md:user_grid-md" v-if="view == 'grid'">
        <div
          class="user_avatar md:user_avatar-md"
          v-for="(item, index) in people"
          :key="index"
          @click="setActive(item.id)"
          :class="{ active: selected.id === item.id }"
          :style="{ backgroundImage: 'url(' + item.image_url + ')' }"
        ></div>
      </div>
      <div class="user_list md:user_list-md" v-if="view == 'list'">
        <input v-model="search" placeholder="search speakers.." />
        <ul>
          <li
            v-for="(item, index) in filteredPeople"
            :key="index"
            @click="setActive(item.id)"
            :class="{ active: selected.id === item.id }"
          >
            <div
              class="user_avatar"
              :style="{ backgroundImage: 'url(' + item.image_url + ')' }"
            ></div>
            <div class="h-full items-start justify-start">
              <p class="m-0 p-0 inline-block w-full">{{ item.title }}</p>
              <p class="m-0 p-0">{{ item.excerpt.substring(0,80) }}..</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="user_info md:user_info-md" v-if="selected">
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
export default {
  props: ["custom", "baseUrl"],
  data() {
    return {
      people: [],
      selected: null,
      search: '',
      view: 'list'
    };
  },
  methods: {
    setActive(value) {
      this.selected = this.people.filter(x => x.id == value)[0];
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
        this.people = data;
        this.selected = data[0];
      });

    }
  },
  computed: {
    filteredPeople() {
      return this.people.filter(item => {
        return item.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  mounted: function() {
    this.getPeople(this.custom.tag);
  }
};
</script>

