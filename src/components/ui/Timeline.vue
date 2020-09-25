<template>
  <div :style="customFont">


    <div class="navigation">
      <div class="dates">
      <div v-for="(item, index) in eventDates" class="date" :key="index" @click="selectDate(item)" :class="{active: selectedDate == item}">{{ item }}</div>
      </div>
      <div class="filters_options" :class="{'active': selectedFilter !== null }">
       <div v-for="(item, index) in getFilters" :key="index" @click="selectFilter(item)" class="filter" :class="{active: selectedFilter == item}" :style="selectedFilter == item ? 'background-color: ' + getColor(item) : 'background-color: white'">
       <span class="circle" :style="getCircleColor(item)">
         <svg v-if="selectedFilter == item" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill='white' fill-rule="nonzero"><path  d="M29 9a20 20 0 11-40 0 20 20 0 0140 0zM-5 9a14 14 0 1028 0A14 14 0 00-5 9z"/><path d="M13 9l4 4a3 3 0 01-4 4l-4-4-4 4a3 3 0 01-4-4l4-4-4-4a3 3 0 014-4l4 4 4-4a3 3 0 014 4l-4 4z"/></g></svg>
       </span>
       {{ item }}
       
       </div>
      </div>
    </div>


<!--          {{getRowStyle()}}
    <div v-for="(item, index) in filteredItems" :key='index' :class="'session'" :style="'grid-column: track-1; grid-row: ' + getRow(item.event)">
     {{ getRow(item.event) }}
      {{ item.event.start }}
    </div>
     -->


   <div class="schedule" aria-labelledby="schedule-heading" :style="getRowStyle()">

  <div v-for="item in filteredItems" :key='item.title' :style="'background-color: ' + getColor(item.event.type) + '; grid-column: track-' + item.column + '; grid-row: ' + getRow(item.event)" class="session" @click="toggleLightbox(item)">
      <h4>{{ item.title }}</h4>
      <p>{{ item.event.start | formatHour }} - {{ item.event.end | formatHour }}</p>
  </div>


    <div class="time" v-for="(item, index) in getRowTimes()" :key="index" :style="'grid-column-start: track-1; grid-column-end: track-4; grid-row: time-' + getRowPlace(item)">
        <p>{{ getHour(item) }}</p>
    </div>
  </div>

<transition name="fade">
<div class="lightbox" v-if="activeEvent">
  <div class="event_info">
      <div class="close" @click="toggleLightbox()"></div>

      
    <a class="title" :href="activeEvent.link.url" target="_blank" v-if="activeEvent.link && activeEvent.link.url !== ''">{{activeEvent.title}}</a>
      <h3 v-else>{{activeEvent.title}}</h3>
      <p><b>{{activeEvent.event.start | formatDate }}</b> from <b>{{ activeEvent.event.start | formatHour }}</b> to <b>{{ activeEvent.event.end | formatHour }}</b></p>
         <p>{{activeEvent.type}}</p>

    <p>{{activeEvent.text}}</p>
        <h4 class="text-xl font-bold border-b pb-3">Participants</h4>

      <div class="participants">
        <div class="participant" v-for="(item, index) in activeEvent.participants" :key="index">
          <div class="participant_name">
            <img :src="item.image" />
            <div>
              <a class="name" :href="item.url" target="_blank" v-if="item.url && item.url !== ''">{{item.name}}</a>
              <h4 v-else>{{item.name}}</h4>
               <div class="social" v-if="item.twitter || item.linkedin">
                <a class="twitter" v-if="item.twitter" :href="item.twitter" target="_blank">Twitter</a>
                <a class="linkedin" v-if="item.linkedin" :href="item.linkedin" target="_blank">LinkedIn</a>
              </div>
            </div>
          </div>
          <div class="participant_info" v-if="item.text">
            <p>{{item.text}}</p>
          </div>
        </div>
      </div>
  </div>

</div>
</transition>

  </div>
</template>

<script>
import moment from "moment";
import { bus } from '@/main';
export default {
  name: 'Timeline',
  data () {
    return {
      search: "",
      columnCount: 0,
      eventDates: [],
      selectedFilter: null,
      drawn: null,
      times: [],
      times2: {},
      times3: {},
      rows: null,
      columns_drawn: null,
      gridItems: null,
      columns: 1,
      created: false,
      location: null,
      expand: null,
      type: null,
      dates: null,
      selectedDate: null,
      activeEvent: null
    }
  },
  methods: {
    selectDate(item) {
      this.selectedDate = item;
      this.selectedFilter = null;
      this.getColumnCount();
    },
    toggleLightbox(item) {
      if (this.activeEvent == null) {
        this.activeEvent = item;
      } else {
        this.activeEvent = null;
      }
      
    },
    selectFilter(item) {
      
      if (this.selectedFilter == item) {
        this.selectedFilter = null
      } else {
        this.selectedFilter = item;

      }
    },
    getLine(event) {
      var start = moment(event.start).format("HH:mm");
      if (start.endsWith(0) || start.endsWith(5)) {
        return moment(event.start).format("HH:mm")
      }

    },
    gridItem(item, index) {
      var prevIndex = this.items[index-1];
      var column = 1;
      var self = this;

      if (index !== 0 && moment(item.event.start) >= moment(prevIndex.event.start) && moment(item.event.start) < moment(prevIndex.event.end)) {
        column = prevIndex.column + 1;
        self.columns++;
      }

      if (index !== 0 && prevIndex.column > 1 ) {
        column = 0;
      }


      if (index == 0 || moment(prevIndex.event.start).format("DD-MM-YY") !== moment(item.event.start).format("DD-MM-YY")) {
        this.eventDates.push(moment(item.event.start).format("dddd, MMMM Do"));
      } 

      if (index == 0) {
        this.selectedDate = moment(item.event.start).format("dddd, MMMM Do");
      }


      item["column"] = column
      return item
    },
    getRow(event) {
      var start = moment(event.start).format("HHmm");
      return "time-" + start + " / " +  "time-" + moment(event.end).format("HHmm");
    },
    drawRow(time, space, index) {
      var start = moment(time).format("HHmm");
      function isOdd(num) { return num % 2;}
      var row = "";
      var next = this.eventTimes()[index + 1];

      if (isOdd(index) == 0) {
        row = " [time-" + start + "] " + space;
      } 

      if (isOdd(index) == 1) {
        row = " [time-" + start + "] auto";
      }

      var start_hour = moment(time).format("HH");
      var start_minutes = moment(time).format("mm");

      var end_hour = moment(next).format("HH");
      var end_minutes = moment(next).format("mm");

      var startDate = new Date(0,0,0,start_hour, start_minutes);
      var endDate = new Date(0,0,0,end_hour, end_minutes);

      var millis = endDate - startDate;
      var minutes = millis/1000/60;

 

      if (isOdd(index) == 1 && minutes > 30 && this.columnCount > 1) {
        row = " [time-" + start + "] auto";
      }


      if (minutes < 30) {
        row = " [time-" + start + "] auto";
      }

      return row
      
    },
    drawRow2(item, index) {
      var start = null;
      if (item.start) {
        start = moment(item.start).format("HHmm");
      }
      var end = moment(item.end).format("HHmm");
      if (!item.start) {
        return "1fr [time-" + end + "] ";
      } else if (index == 0) {
        return "[time-" + start + "] ";
      } else {
        return "auto [time-" + start + "] 1fr [time-" + end + "] ";
      }
      
    },
    getHour(time) {
      return moment(time).format("HH:mm")
    },
    getRowPlace(time) {
      return moment(time).format("HH:mm").replace(":", '')
    },
    getRowTimes() {
      return this.eventTimes(true).filter((x, index) => this.getHour(x).endsWith(0) && !this.getHour(x).endsWith(30) || this.getHour(x).endsWith(5) || index == 0)
    },
    getRowLines() {
      return this.eventTimes().map((x, index) => this.drawRow(x, '1fr', index)).sort().join(" ");
    },
    getRowLines2() {
      return this.eventTimes2().map((x, index) => this.drawRow2(x, index)).join(" ");
    },
    getTime(event) {
      var start = moment(event.start).format("HH:mm");

      // var time = "[time-" + start  + " " +  "time-" + moment(event.end).format("HHmm") + ']';
      // array.push(time);
                  // var end = moment(event.end).format("HHmm");

     
      if (!this.times.includes(start) && (start.endsWith(0) || start.endsWith(5))) {
          this.times.push(start);
      }
    },
    getTime2(event) {
      var start = moment(event.start).format("DD-MM-YY");

      // var time = "[time-" + start  + " " +  "time-" + moment(event.end).format("HHmm") + ']';
      // array.push(time);
                  // var end = moment(event.end).format("HHmm");

      if (!this.times2[start]) {
        this.times2[start] = [];
      }
      if (!this.times3[start]) {
        this.times3[start] = [];
      }
      if (this.times2[start] && !this.times2[start].includes(event.start)) {
        this.times2[start].push(event.start);
      }
      if (this.times3[start] && !this.times3[start].includes(event.start)) {
        this.times3[start].push(event.start);
      }
      if (this.times3[start] && !this.times3[start].includes(event.end)) {
        this.times3[start].push(event.end);
      }
     
    },
    eventTimes(start) {

      // var time = "[time-" + start  + " " +  "time-" + moment(event.end).format("HHmm") + ']';
      // array.push(time);
                  // var end = moment(event.end).format("HHmm");
      var array = [];
      var i;

      for (i = 0; i < this.filteredItems.length; i++) { 
        if (!array.includes(this.filteredItems[i].event.start)) {
          array.push(this.filteredItems[i].event.start);
        }
        if (!start && !array.includes(this.filteredItems[i].event.end)) {
          array.push(this.filteredItems[i].event.end);
        }
      }

      return array.sort()
     
    },
    eventTimes2() {

      // var time = "[time-" + start  + " " +  "time-" + moment(event.end).format("HHmm") + ']';
      // array.push(time);
                  // var end = moment(event.end).format("HHmm");
      var array = [];
      var i;

      for (i = 0; i < this.filteredItems.length; i++) { 
        var obj = {}
        if (i !== 0 && this.filteredItems[i-1].event.end && this.filteredItems[i-1].event.end == this.filteredItems[i].event.start) {
          obj['end'] = this.filteredItems[i].event.end;
        } else {
          obj['start'] = this.filteredItems[i].event.start;
          obj['end'] = this.filteredItems[i].event.end;
        }
        array.push(obj);
      }

      return array.sort()
     
    },
    getColumn(event, index) {
      var prevIndex = this.items[index-1];
      if (index !== 0) {
        if (moment(event.start) >= moment(prevIndex.event.start) && moment(event.start) < moment(prevIndex.event.end)) {
          return true
        }
      } else {
        return false
      }
    },
    toggleEvent(index){
      if (this.$mq !== "md") {
        if (this.expand == index) {
          this.expand = null
        } else {
          this.expand = index
        }
      }
    },
    getType(tags){
      var types = this.filters;
      var tag = tags.filter(function(tag) {
        if (types[tag.name]){
          return tag;
        } else {
          return null
        }
      });
      var name = tag[0].name;
      var obj = {
        name: tag[0].name,
        color: types[name]
      }
      return obj;
    },
    getColor(type) {
      if (this.filters.filter(x => x.type.toLowerCase() == type.toLowerCase())[0]) {
      return this.filters.filter(x => x.type.toLowerCase() == type.toLowerCase())[0].color
    } else {
      return 'white'
    }
    },
    getCircleColor(type) {
      if (this.filters.filter(x => x.type.toLowerCase() == type.toLowerCase())[0]) {
      return "background-color: " +  this.filters.filter(x => x.type.toLowerCase() == type.toLowerCase())[0].color
    } else {
      return 'border: 1px solid rgba(0,0,0,0.3); background-color: white'
    }
    },
    clear(key){
      this[key] = null;
    },
    newDate(index, date){
      var prevIndex = this.items[index-1];
      if (index == 0 || moment(prevIndex.event.start).format("YYYY-MM-DD") !== moment(date).format("YYYY-MM-DD")) {
      return true;
      } else {
        return false
      }
    },
    dateId: function(value) {
      return moment(value).format("YYYYMMDD");
    },
    eventColor(type){
      var color = this.filters[type];
      if (color) {
        return color;
      } else {
        return null
      }
    },
    isActive(date) {
      if (this.selectedDate == moment(date).format("YYYYMMDD")) {
        return true
      } else {
        return false
      }
    },
    filtered() {
      if (this.type !== null || this.search !== "" || this.selectedDate || this.location) {
        return true
      } else {
        return false
      }
    },
    createRow(time, index){
 
      var height = "auto";
      var length = this.times[index + 1] - time;
      if (length > 30) {
        height = "100px"
      }
   
      return ' [time-' + time + '] ' + height
    },
    drawColumn(item, index) {
      var prevIndex = this.filteredItems[index-1];
      if (index !== 0 && moment(item.event.start) >= moment(prevIndex.event.start) && moment(item.event.start) < moment(prevIndex.event.end)) {
        this.columnCount++;
      }
    },
    getColumnCount() {
      this.columnCount = 0;
      this.filteredItems.map((x, index) => this.drawColumn(x, index))
    },
    getFormattedDate(value) {
      return moment(value).format("dddd, MMMM Do");
    },
    getRowStyle() {
      var columns = ["[times] 4em"];
      var i;
      var count = 3;
      if (this.columnCount > 1) {
        count = this.columnCount+2;
      }
      for (i = 1; i < count; i++) { 
        var pr = i - 1;
        var col = "";
        if (i == 1) {
          col = '[track-' + i + '-start] auto';
        }
        if (i !== 1 && i !== this.columnCount+2) {
          col = '[track-' + pr + '-end track-' + i + '-start] auto';
        }
        if (i == this.columnCount+2) {
          col = '[track-' + pr + '-end] auto';
        }
       columns.push(col)
      }

      this.columns_drawn = columns.join(" ");


      // var cols = "[times] 4em [track-1-start] 1fr [track-1-end track-2-start] 1fr [track-2-end track-3-start] 1fr [track-3-end track-4-start] 1fr [track-4-end];"
      // var rows = this.times.slice(0,12).map((x, index) => this.createRow(x, index)).join(' ');
      this.drawn = this.getRowLines();
     return "grid-template-rows: " + this.drawn + "; grid-template-columns: " + this.columns_drawn;
    }
  },
  created() {

    bus.$on('setDate', (data) => {
      this.selectedDate = data;
    })
    bus.$on('clearDate', (data) => {
      this.selectedDate = data;
    })
    bus.$on('clearType', (data) => {
      this.type = data;
    })
    bus.$on('clearSearch', (data) => {
      this.search = "";
      window.console.log(data)
    })
    bus.$on('filterDate', (data) => {
      this.selectedDate = data;
      this.type = null;
      this.location = null;
    })
    bus.$on('filterSearch', (data) => {
      this.search = data;
      this.type = null;
      this.selectedDate = null;
    })
    bus.$on('filterLocation', (data) => {
      this.location = data;
      this.selectedDate = null;
    })
    bus.$on('filterType', (data) => {
      this.type = data;
    })
  },
  filters: {
    formatTime: function(value) {
      return "time-" + moment(value).format("HHmm");
    },
    formatHour: function(value) {
      return moment(value).format("HH:mm");
    },
    formatDate: function(value) {
      return moment(value).format("dddd, MMMM Do");
    }
  },
  mounted() {
    this.created = true;
        this.gridItems = this.items.map((x, index) => this.gridItem(x, index));
    this.gridItems.map((x, index) => this.getTime(x.event, index));
      this.gridItems.map((x, index) => this.getTime2(x.event, index));

    this.getColumnCount();

  },
  computed: {
    getHoverColor(){
      return this.uiStyle('highlight', this.stylesheet.highlight)['backgroundColor']
    },  
    getFilters(){
      var events = this.gridItems.filter(x => moment(x.event.start).format("dddd, MMMM Do") == this.selectedDate);
      var types = events.map(x => x.event.type.toLowerCase());
      return [...new Set(types)];
    },  
    filteredItems() {
      var events = this.gridItems.filter(x => moment(x.event.start).format("dddd, MMMM Do") == this.selectedDate);
      if (this.selectedFilter) {
        events = events.filter(x => x.event.type.toLowerCase() == this.selectedFilter);
      }
      return events
    },
    customFont() {
      if (this.stylesheet && this.stylesheet.font) {
        return {
          'font-family': this.stylesheet.font + ' !important'
        };
      } else {
        return null
      }
    }
  },
  watch: {
    type() {
      if (this.type) {
        bus.$emit('filterType', this.type);
      } else {
        bus.$emit('filterType', null);
      }
    }
  },
  props: ["data", "stylesheet", "globalStyle", "filters", "custom", "items", "eventsdata"]
}
</script>

<style lang="scss" scoped>

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  transform: translateY(0px) translateZ(0px);
perspective: 1000px;
  .event_info {
    padding: 4rem 6rem;
    width: 70%;
    height: 80%;
    overflow: scroll;
    position: relative;
    background-color: white;
    transition: all .5s ease;
     transform: translateY(0px) translateZ(0px);
    color: black;
    .close {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 60px;
      height: 60px;
      display: block;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 33.8'%3E%3Cpath fill='%232EA48A' d='M16.3 13l10-10A1.8 1.8 0 1023.8.5l-10 10-10-10C3-.2 1.9-.2 1.3.5c-.7.7-.7 1.8 0 2.5l10 10-10 10a1.8 1.8 0 102.5 2.5l10-10 10 10a1.8 1.8 0 002.5-2.5l-10-10z' fill-rule='evenodd'/%3E%3C/svg%3E") center 60% #efefef;
      background-repeat: no-repeat;
      background-size: 20px;
      &:hover {
        cursor: pointer;
      }
    }
     h3, a.title {
      @apply inline-block font-bold text-3xl border-b pb-2 mb-3;
    }
    a.title:hover {
      cursor: pointer;
      color: #2EA48A;
    }
    .participants {
      width: 100%;
      column-count: 2;
      column-gap: 50px;
      padding: 0rem 0rem;
      margin-top: 1.5rem;

      .participant {
        display: inline-block;
        min-width: 300px;
        border-bottom: 1px solid rgba(0,0,0,0.07);
          padding: 0rem 0 1rem;
          margin-bottom: 1rem;
        a.name {
          text-decoration: underline;
          font-weight: bold;
        }
        .participant_name {
          @apply pb-0;
          display: flex;
          align-items: start;
          width: 100%;
          .social {
            display: block;
            margin-top: 0px;
            a {
              border-bottom: 1px dashed #ddd;
              padding: 0 0 2px;
              margin-top: 0;
              margin-right: 10px;
              font-weight: bold;
              color: rgba(0,0,0,0.8);
              font-size: 13px;
              &:hover {
                color: black;
                cursor: pointer;
              }
            }
           
          }
        }
        .participant_info {
          margin-top: 0rem;
          font-size: .9rem;
        }
  
        img {
          border-radius: 10px;
          height: 50px;
          margin-right: .75rem;
          border: .5px solid rgba(0,0,0,0.1);
        }
        h4 {
          @apply font-bold text-base;
        }
      }
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  .event_info {
    opacity: 0;
    transform: scale(0.2) translateY(5px) translateZ(-10px);
  }
}

.navigation {
  display: flex;
  flex-direction: column;
  margin: 0 0 30px 0px;
.dates {
  display: flex;
  padding-top: 10px;
  top: 20px;
    border-bottom: 1px solid #efefef;

}
  .date {
    color: #2EA48A;
    margin-right: 10px;
    text-decoration: underline;
    font-size: 1rem;
          padding: 12px 12px;
      margin-bottom: -1px;
      border: 1px solid rgba(0,0,0,0);

          font-weight: bold;
    &:hover {
      cursor: pointer;
    }
    &.active {
      color: rgba(0,0,0,0.9);
      text-decoration: none;
      border: 1px solid #efefef;
      border-bottom: 1px solid #fff;
      z-index: 999;
    }
  }
}
.filters_options {
  display: flex;
  padding-top: 13px;
  align-items: center;
  h3 {
    font-weight: bold;
    text-decoration: underline;
    font-size: 14px !important;
    margin-right: 10px;
  }
  &.active {
    .filter {
      opacity: 0.6;
    }
  }
}

@keyframes scale {
  0% {
    transform: scale(0)
  }
  100% {
    transform: scale(1)
  }
}
.filter {
      border-radius: 6px;

  padding: 7px 8px;
  background: white;
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: bold;
  transition: all .1s ease;
  &:hover {
    background: rgba(0,0,0,0.04) !important;
  }
  .circle {
    width: 14px;
    height: 14px;
    border-radius: 100px;
    float: left;
    margin-right: 7px;
  }
  &.active {
    background-color: rgba(0,0,0,.05) !important;
    opacity: 1 !important;
    .circle {
      opacity: 1;
      display: flex;
      position: relative;
      animation: scale .2s ease;
      svg {
        transform: scale(0.3);
        position: absolute;
        top: -2px;
        left: -2px;
      }
    }
  }
}

.time {
  width: 100%;
  height: 1px;
  margin-top: 1px;
  border-bottom: 1px dashed rgba(0,0,0,0.2);
  position: relative;
  z-index: -1;
  p {
    position: absolute;
    left: -50px;
    font-weight: bold;
    color: rgba(0,0,0,0.7);
    top: -10px;
    font-size: 13px;
  }
}
/*************************
 * GRID SCHEDULE LAYOUT
 *************************/
@media screen and (min-width:700px) {
    .schedule {
        display: grid;
        position: relative;
        grid-row-gap: .2rem;
        min-width: 70vw;
            /* Note 1:
            Use 24hr time for gridline names for simplicity

            Note 2: Use "auto" instead of "1fr" for a more compact schedule where height of a slot is not proportional to the session length. Implementing a "compact" shortcode attribute might make sense for this!
            Try 0.5fr for more compact equal rows. I don't quite understand how that works :)
            */
        
    }
}

.time-slot {
    grid-column: times;
}

.track-slot {
    display: none; /* hidden on small screens and browsers without grid support */
}

@supports( display:grid ) {
    @media screen and (min-width:700px) {
        .track-slot {
            display: block;
            padding: 10px 5px 5px;
            position: sticky;
            top: 0;
            z-index: 1000;
            background-color: rgba(255,255,255,.9);
        }
    }
}


/* Small-screen & fallback styles */
.session {
    margin-bottom:  1em;
    h4, p {
      font-weight: bold;
      font-size: 12px;
    }
    p {
      color: rgba(0,0,0,0.7)
    }
  
}

@supports( display:grid ) {
    @media screen and (min-width: 700px) {
        .session {
            margin: 0;
        }   
    }
}

/*************************
 * VISUAL STYLES
 * Design-y stuff ot particularly important to the demo
 *************************/



@keyframes fadein {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
      transform: translateY(0px);

    opacity: 1
  }
}

.session {
    padding: 1em;
    border-radius: 5px;
    font-size: 14px;
border: 1px solid rgba(0,0,0,0.2);
margin: .5rem .5rem 0 0;
z-index: 2;
background: white;
position: relative;
&:hover {
  cursor: pointer;
}
}

.session-title,
.session-time,
.session-track,
.session-presenter {
    display: block;
}

.session-title,
.time-slot {
    margin: 0;
    font-size: 1em;
}

.session-title a {
    color: #fff;
    text-decoration-style: dotted;
    
    &:hover {
        font-style: italic;
    }
    
    &:focus {
        outline: 2px dotted rgba(255,255,255,.8);
    }
}

.track-slot,
.time-slot {
    font-weight: bold;
    font-size:.75em;
}

.track-1 {
    background-color: #1259B2;
    color: #fff;
}

.track-2 {
    background-color: #687f00;
    color: #fff;
}

.track-3 {
    background-color: #544D69;
    color: #fff;
}

.track-4 {
    background-color: #c35500;
    color: #fff;
}

.track-all {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ccc;
    color: #000;
    box-shadow: none;
}

.text {
    max-width: 750px;
    font-size: 18px;
    margin: 0 auto 50px;
}

.meta {
    color: #555;
    font-style: italic;
}

.meta a {
    color: #555;
}

hr {
    margin: 40px 0;
}



.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>