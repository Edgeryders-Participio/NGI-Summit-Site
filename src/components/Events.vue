<template>
  <div class="section md:section-md" id="events">
    <div class="section_title">
      {{ custom.title }}
      <div class="toggle_menu mt-0 mb-0 md:flex">
        <div
          class="toggle calendar"
          :class="{ active: view == 'calendar' }"
          @click="toggleView('calendar')"
        ></div>
        <div
          class="toggle list"
          :class="{ active: view == 'list' }"
          @click="toggleView('list')"
        ></div>
      </div>
    </div>
    <div class="wrapper md:wrapper-md" :class="view">
      <div class="list md:list-md" v-if="view == 'list'">
        <div
          v-for="(item, index) in dataReverse"
          :key="index"
          :class="{ active: item.created_at == selected[0].created_at }"
          class="list_item"
          @click="selectEvent(item.created_at)"
        >
          <p class="font-bold">{{ item.event.start | formatDate }}</p>
          <h4>{{ item.title }}</h4>
        </div>
      </div>
      <div
        class="calendar_container md:calendar_container-md"
        :class="{ active: minimize == true }"
        v-if="view == 'calendar'"
      >
        <div class="calendar_nav md:calendar_nav-md" v-if="selected">
          <button class="arrow left" @click="previous"></button>
          <h3 @click="toggleCalendar">
            <span class="triangle md:hidden"></span>
            <span v-if="$mq == 'sm'">{{
              selected[0].event.start | formatDate
            }}</span>
            <span v-else>{{ selected[0].event.start | formatMonth }}</span>
          </h3>
          <button class="arrow right" @click="next"></button>
        </div>
        <FunctionalCalendar
          v-if="data"
          ref="Calendar"
          @choseDay="selectEvent"
          :hiddenElements="['navigationArrows']"
          :date-format="'dd-mm-yyyy'"
          :change-month-function="true"
          :change-year-function="true"
          :marked-dates="data"
          :isDatePicker="true"
        >
        </FunctionalCalendar>
      </div>
      <div class="selected_event md:selected_event-md">
        <h2
          class="text-2xl font-bold pb-2 border-b mb-2 pl-2"
          v-if="selected && selected.length > 1 && $mq !== 'sm'"
        >
          {{ selected[0].event.start | formatDate }}
        </h2>
        <Event
          v-for="(event, index) in selected"
          :data="event"
          :multiple="selected && selected.length > 1"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { FunctionalCalendar } from "vue-functional-calendar";
import Event from "@/components/EventNGI.vue";
import moment from "moment";

export default {
  props: ["custom", "baseUrl"],
  data() {
    return {
      view: "calendar",
      data: null,
      excerpts: null,
      full: null,
      selected: null,
      minimize: true
    };
  },
  components: {
    FunctionalCalendar,
    Event
  },
  methods: {
    toggleView(view) {
      this.view = view;
      if (view == "calendar") {
        this.$nextTick(() => {
          this.$refs.Calendar.ChooseDate(this.selected[0].date);
        });
      }
    },
    toggleCalendar() {
      if (this.$mq == "sm") {
        this.minimize = !this.minimize;
      }
    },
    selectEvent(value, toggle) {
      var event;
      if (value.date) {
        event = this.data.filter(function(obj) {
          return obj.date == value.date;
        });
        if (event.length) {
          this.selected = event;
          this.$nextTick(() => {
            this.$refs.Calendar.ChooseDate(value.date);
          });
          if (toggle !== false) {
            this.toggleCalendar()
          }
        }
      }
      else {
        event = this.data.filter(function(obj) {
          return obj.created_at == value;
        });
        this.selected = event;
      }
    },
    next() {
      var next;
      if (this.$mq === "md") {
        next =
          this.data.find(
            ({ event: { start } }) =>
              moment(start) >
              moment(this.selected[0].event.start)
                .add(1, "month")
                .startOf("month")
          ) || this.selected[0];
      } else {
         next = this.data.find(
              ({ event: { start } }) =>
                moment(start) > moment(this.selected[0].event.start)
            ) || this.selected[0];
      }
      this.selectEvent(next, false);
    },
    previous() {
      var prev;
      if (this.$mq === "md") {
        prev = this.dataReverse.find(
            ({ event: { start } }) =>
              moment(start) <
              moment(this.selected[0].event.start)
                .add(-1, "month")
                .endOf("month")
          ) || this.selected[0];
      } else {
        prev = this.dataReverse.find(
            ({ event: { start } }) =>
              moment(start) < moment(this.selected[0].event.start)
          ) || this.selected[0];
      }
       this.selectEvent(prev, false);
    },
    getEventsOld(tag) {
      axios.get(
        `${this.baseUrl}/webkit_components/topics.json?serializer=event&tags=${tag}&per=500`
      ).then(({ data }) => {
        this.data = data
          .filter(({ event }) => event)
          .map(event => ({
            ...event,
            date: this.formatDate(event.event.start),
            class: "marked"
          }))
          .sort((a, b) => a.event.start.localeCompare(b.event.start));
        this.selectEvent(this.dataReverse[0]);
      });
    },
    getEvents(tag) {
      axios.get(
        `${this.baseUrl}/webkit_components/topics.json?tags=${tag}&per=500&serializer=event`
      ).then(({ data }) => {
        this.excerpts = data
        return axios.get(
        `${this.baseUrl}/webkit_components/topics.json?tags=${tag}&per=500&serializer=organizer`
        )
      }).then(({ data }) => {
        this.full = data
        this.data = this.excerpts
          .filter(({ event }) => event)
          .map(event => ({
            ...event,
            date: this.formatDate(event.event.start),
            class: "marked",
            cooked: data.find( ({ id }) => id === event.id ).cooked
          }))
          .sort((a, b) => a.event.start.localeCompare(b.event.start));
        this.selectEvent(this.dataReverse[0]);
      })
    },
    formatDate(value) {
      return moment(value).format("D-M-YYYY");
    },
    formatTime(value) {
      return moment(value).format("HH:mm");
    }
  },
  created() {
    this.getEvents(this.custom.tag);
  },
  computed: {
    dataReverse: function() {
      return this.data.slice().reverse();
    }
  },
  mounted() {
    if (this.$mq == "md") {
      this.minimize = false;
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(value).format("MMMM Do YYYY");
    },
    formatMonth: function(value) {
      return moment(value).format("MMMM YYYY");
    }
  }
};
</script>