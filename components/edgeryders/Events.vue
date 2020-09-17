<template>
  <div class="section px-5 md:px-0 md:section-md md:my-10 events" id="events" :style="containerStyle(data.style)">
    <List v-if="$mq=='sm'" :header="data.title" :items="eventsData.data.events" image="image_url" title="title" info="text" filter="title" url="url" :search="true" type="event" :share="true" />

    <div v-else class="wrapper md:wrapper-md">
      <div class="events_title" :style="textStyle('title', data.style)" :class="titleClassSize(data.style)">{{data.title}}</div>
      <p class="timezone">All times set to {{Intl.DateTimeFormat().resolvedOptions().timeZone}} timezone</p>
      <div class="flex px-3">
      <Timeline2 :custom="filtered" :filters="eventsData.data.config.filters" :globalStyle="globalStyle" :items="filtered" :data="filtered" />
<!--       <div class="w-full flex flex-col border-l events_sidebar">
        <Filters  :filters="eventsData.data.config.filters" />
      </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import List from "@/components/ui/List.vue";
import Timeline2 from "@/components/ui/Timeline2.vue";
// import Filters from "@/components/ui/Filters.vue";
import { bus } from '@/main';

import eventsData from "@/data/events.json"

export default {
  props: ["data", "stylesheet", "baseUrl", "globalStyle"],
  data() {
    return {
      eventsData,
      view: null,
      events: [],
      type: null
    };
  },
   components: {
    List,
    Timeline2  },
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
  },
  mounted() {
    bus.$on('filterType', (data) => {
      this.type = data;
    })
  },
  computed: {
    filtered() {
      if (this.type !== null) {
        return this.eventsData.data.events.filter(x => x.event.type == this.type)
      } else {
        return this.eventsData.data.events
      }
    }
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
    @apply text-3xl font-bold;
    color: rgb(46, 164, 138);

  padding: 0px 10px 0 !important;
}

.timezone {
  @apply text-base font-bold;
    color: black;

  padding: 10px 10px 0px !important;
}

.events .wrapper, .timeline_container-md, .filters {
  min-height: 500px;
}
</style>