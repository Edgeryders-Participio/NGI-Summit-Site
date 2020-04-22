<template>
  <div class="section px-5 md:px-0 md:section-md events" id="events" :style="containerStyle()">
    <List v-if="$mq=='sm'" :header="data.title" :items="events" image="image_url" title="title" info="excerpt" filter="id" url="url" :search="true" type="event" :share="true" />

    <div v-else class="wrapper md:wrapper-md bg-gray-100 rounded-lg overflow-hidden">
      <div class="w-full py-4 px-3 events_title">{{data.title}}</div>
      <div class="flex">
      <Timeline :custom="data" :config="getEventFilters()" :items="events" :data="events" />
      <div class="w-full flex flex-col border-l sidebar_black">
        <Search v-if="isView('search') || $mq == 'sm'" />
        <Calendar v-if="isView('calendar')  && events.length" :dates="dataReverse" :items="events" :config="getEventFilters()" />
        <Filters v-if="isView('filter') && events.length" :items="events" :config="getEventFilters()" />
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import List from "@/components/MobileList.vue";
import Timeline from "@/components/views/Timeline.vue";
import Calendar from "@/components/views/Calendar.vue";
import Search from "@/components/views/Search.vue";
import Filters from "@/components/views/Filters.vue";
import { bus } from '@/main';

export default {
  props: ["data", "stylesheet", "baseUrl"],
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
.sidebar_black {
  background: rgba(0,0,0,0.01);
  border-radius: 0 10px 10px 0;
  padding: 30px 20px 0 20px;
}
.events_title {
  @apply text-2xl font-bold;
background: linear-gradient(60deg, #2EA48A 0%, rgba(0,189,146,0.2) 55%, rgba(0,189,146,0) 100%);
  color: #fff;
  padding: 20px 30px;
}
</style>