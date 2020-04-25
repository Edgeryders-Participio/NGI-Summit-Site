<template>
  <div class="section px-5 md:px-0 md:section-md events" id="events" :style="containerStyle(data.style)">
    <List v-if="$mq=='sm'" :header="data.title" :items="events" image="image_url" title="title" info="excerpt" filter="id" url="url" :search="true" type="event" :share="true" />

    <div v-else class="wrapper md:wrapper-md bg-gray-100 rounded-lg overflow-hidden">
      <div class="events_title" :style="textStyle('title', data.style)" :class="titleClassSize(data.style)">{{data.title}}</div>
      <div class="flex">
      <Timeline :custom="data" :filters="getEventFilters()" :globalStyle="globalStyle" :items="events" :data="events" />
      <div class="w-full flex flex-col border-l events_sidebar">
        <Search v-if="isView('search') || $mq == 'sm'" :stylesheet="data.style" :globalStyle="globalStyle"/>
        <Calendar v-if="isView('calendar')  && events.length" :dates="dataReverse" :stylesheet="data.style" :items="events" :filters="getEventFilters()" :globalStyle="globalStyle" />
        <Filters v-if="isView('filter') && events.length" :stylesheet="data.style" :items="events" :filters="getEventFilters()" :globalStyle="globalStyle" />
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import List from "@/components/ui/List.vue";
import Timeline from "@/components/ui/Timeline.vue";
import Calendar from "@/components/ui/Calendar.vue";
import Search from "@/components/ui/Search.vue";
import Filters from "@/components/ui/Filters.vue";
import { bus } from '@/main';

export default {
  props: ["data", "stylesheet", "baseUrl", "globalStyle"],
  data() {
    return {
      view: null,
      events: [],
    };
  },
   components: {
    List,
    Timeline,
    Calendar,
    Search,
    Filters
  },
  methods: {
    titleObj() {
      var titleObj = {
        maxWidth: ''
      };
      if (this.stylesheet && this.stylesheet.wrapper) {
        titleObj["maxWidth"] = this.stylesheet.title;
      };
      if (this.data.style && this.data.style.wrapper) {
        titleObj["maxWidth"] = this.data.style.title;
      };
      return titleObj;
    },
    isView(type) {
      if (this.$mq == "md") {
        return true
      } else {
        if (this.view == type) {
          return true
        } else {
          return false
        }
      }
    },
    selectView(type) {
      if (this.view == type) {
        if (this.view == 'calendar') {
          bus.$emit('clearDate', null);
        }
        this.view = null;
      } else {
        this.view = type;
        if (type == 'calendar') {
          bus.$emit('clearType', null);
          bus.$emit('clearSearch', null);
          bus.$emit('clearDate', null);
        }
        if (type == 'filter') {
          bus.$emit('clearSearch', null);
          bus.$emit('clearType', null);
          bus.$emit('clearDate', null);
        }
        if (type == 'search') {
          bus.$emit('clearType', null);
          bus.$emit('clearDate', null);
        }
      }
    },
    getEventFilters() {
      if (this.data.filters) {
        return this.data.filters;
      } else {
        return false
      }
    },
    getEvents(tag) {
      axios.get(
        `${this.baseUrl}/webkit_components/topics.json?serializer=event&tags=${tag}&per=500`
      ).then(({ data }) => {
        this.events = data.filter(({ event }) => event)
          .map(event => ({
            ...event,
            date: this.formatDate(event.event.start),
            json: this.getJson(event.cooked)
          }))
          .sort((a, b) => a.event.start.localeCompare(b.event.start));
      });
    },
    formatDate(value) {
      return moment(value).format("D-M-YYYY");
    }
  },
  created() {
    this.getEvents(this.data.tag);
  }
};
</script>
<style lang="scss" scoped>
.events_sidebar {
  background: rgba(0,0,0,0.01);
  border-radius: 0 10px 10px 0;
  padding: 30px 20px 0 20px;
}
.events_title {
    @apply text-2xl font-bold;

  padding: 20px 30px !important;
}
</style>