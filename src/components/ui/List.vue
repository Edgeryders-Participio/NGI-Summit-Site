<template>
  <div class="mobile_list" :class="type">

    <div class="list_container" :class="{active: active}">
      <div class="list_header" v-if="header">
        <h3>{{header}}</h3>
        <div class="toggle search_list_mobile mr-3" @click="toggleSearch()" :class="{active: active_search}"></div>
      </div>
      <div class="list_search" :class="{active: active_search}" >
        <input v-if="search" v-model="searchValue" placeholder="search.." />
      </div>
      <ul class="list_scroll">
        <li
          v-for="(item, index) in filteredList"
          :key="index"
          class="item_entry"
          :class="{active: selected && item[filter] == selected[filter], new_date: showDate(item, index)}"
          @click="setActive(item[filter])"
        >
          <div class="item_time_marker" v-if="showDate(item, index)">
            {{formatDate(item.event.start)}}
          </div>
          <div
            class="item_image"
            v-if="item[image] && type == 'user'"
            :style="{backgroundImage: 'url(' + item[image] + ')'}"
          >
          </div>
          <div class="item_text">
            <p class="item_title">{{ item[title] }}</p>
            <p v-if="description" class="item_description">{{ item[description] }}..</p>
            <p v-if="item.event" class="event_time">Starts {{ formatTime(item.event.start) }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="list_slide" :class="{'active': active}">
      <div v-if="selected" class="list_back" :class="{float: selected[image] && type=='event'}" @click="removeActive()">
        <button class="list_back_toggle"></button>
        <h3 v-if="type == 'user'">{{selected[title]}}</h3>
        <div class="share_links mr-4" v-if="share">
          <a class="social twitter" :href="'https://twitter.com/intent/tweet?url=' + selected[url] + '&text=' + selected[title]"></a>
          <a class="social facebook" :href="'https://www.facebook.com/sharer/sharer.php?u=' + selected[url]"></a>
          <a class="social email" :href="'mailto:?subject=' + selected[title] + '&body=' + selected[url]"></a>
        </div>
      </div>
      <div v-if="selected" class="list_item_info">
        <div v-if="selected[image] && type=='event'" class="event_image" :style="{backgroundImage: 'url(' + selected[image] + ')'}"></div>
        <div class="list_event_title" v-if="type == 'event'">
          <h3>{{selected[title]}}</h3>
          <p v-if="selected.event">{{ formatDate(selected.event.start) }} at {{ formatTime(selected.event.start) }}</p>
        </div>
        <p class="list_item_description">{{selected[info]}}</p>
        <a v-if="url && type=='event'" class="event_url" :href="selected[url]" target="_blank">Find out more</a>
        <a v-if="url && selected[url] && type!='event'" class="list_item_url mt-4" :href="selected[url]" target="_blank">Read More</a>

      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "List",
  props: ["header", "items", "image", "title", "description", "info", "filter", "search", "url", "type", "share"],
  data: function() {
    return {
      active: false,
      selected: null,
      searchValue: '',
      active_search: false
    };
  },
  methods: {
    setActive(val){
      this.selected = this.items.filter(x => x[this.filter] == val)[0];
      this.toggleList();
    },
    removeActive(){
      this.toggleList();
      setTimeout(()=>{ this.selected = null; }, 500);
    },
    toggleList(){
      this.active = !this.active;
    },
    toggleSearch(){
      this.active_search = !this.active_search;
    },
    formatDate: function(value) {
      return moment(value).format("dddd, MMMM Do");
    },
    formatTime: function(value) {
      return moment(value).format("HH:mm A");
    },
    showDate(item, index){
      if (item.event) {
        if (!this.filteredList[index-1] || this.formatDate(this.filteredList[index-1].event.start) !== this.formatDate(item.event.start)) {
          return true
        } else {
          return false
        } 
      } else {
        return false
      }
    }
  },
  computed: {
    filteredList() {
      return this.items.filter(item => {
        return item[this.title].toLowerCase().includes(this.searchValue.toLowerCase())
      })
    }
  }
};
</script>

<style lang="scss" scoped>

.mobile_list {
  @apply relative;
  width: 100%;
}

.list_container, .list_slide {
  @apply h-full w-full flex flex-col;
}

.list_container {
  @apply flex flex-col;
  transition: transform .3s ease;
  &.active {
    transform: translateX(-100%);
  }
}

.list_slide {
  @apply absolute top-0 left-0 w-full;
  transform: translateX(100%);
  transition: transform .3s ease;
  &.active {
    transform: translateX(0%);
    transition: transform .35s ease;
  }
}

.event_url {
  @apply font-bold p-4 bg-gray-200 w-full block;
}

</style>
