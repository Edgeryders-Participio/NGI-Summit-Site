<template>
  <div class="filters md:filters-md mt-4"> 
      <h4 class="font-bold pb-2 text-lg w-full mb-3 border-b pl-1 mt-0 hidden md:block">Filters</h4>
      <div v-for="option in types" :key="option" class="tag" @click="selectType(option)" :class="{active: type == option}" >
          <span class="event_color" v-if="eventColor(option)" :style="'background: ' + eventColor(option)"></span>
          {{option}}
      </div>
  </div>
</template>

<script>
import { bus } from '@/main'
import 'vue-select/dist/vue-select.css';

export default {
  name: 'Filters',
  data() {
    return {
      location: null,
      type: null,
      locations: [],
      types: [],
      tags: []
    };
  },
  props: ["data", "config", "items"],
  methods: {
    mapLocations(){
      var array = this.items.map(obj => 
        obj.location
      );
      array = this.filterDuplicates(array);
      this.locations = array;
    },
     eventColor(type){
      var color = this.config[type];
      if (color) {
        return color;
      } else {
        return null
      }
    },
    selectType(tag){
      if (this.type == tag) {
        this.type = null
      } else {
        this.type = tag;
      }

    },
    mapTypes(){
      var test = []
      this.items.map(obj => 
          obj.tags.map(obj => test.push(obj.name))
        );
      var newarray = this.filterDuplicates(test);

      this.types = newarray
    },
    filterDuplicates(array){
      let unique = [...new Set(array)];
      let new_array = unique.filter(word => word !== "call");
      return new_array;
    }
  },
  mounted() {
    this.mapTypes();
    this.mapLocations();
    bus.$on('filterType', (data) => {
      this.type = data;
    })
  },
  watch: {
    type() {
      if (this.type) {
       bus.$emit('clearDate', null);
      bus.$emit('filterType', this.type);
    } else {
      bus.$emit('filterType', null);
    }
    },
    location() {
      bus.$emit('filterLocation', this.location);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "vue-select/src/scss/vue-select.scss";

.select {
  display: flex;
  align-items: center;
}
input {
  @apply w-full p-2 mb-2 border;
}

.tag {
  @apply float-left mr-2 mb-2 py-2 px-3 font-light border;
  border-radius: 5px;
  background: white;
  font-size: 12.5px;
    transition: padding .4s ease;

  &:hover {
    cursor: pointer;
    @apply bg-gray-200;
  }
  &.active {
    opacity: 1;
    background: #2EA48A;
    border: 1px solid #2EA48A;
    padding-left: 25px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 40'%3E%3Cpath fill='white' d='M16 2a14 14 0 100 28 14 14 0 000-28zm6 18a1.5 1.5 0 11-2 2l-4-3.9-4 4a1.5 1.5 0 01-2 0c-.6-.6-.6-1.6 0-2.2l3.9-3.9-4-4a1.5 1.5 0 112.2-2l3.9 3.9 4-4a1.5 1.5 0 112 2.2L18.2 16l4 4z'/%3E%3C/svg%3E") no-repeat 3.3% 65% #2EA48A !important;
    background-size: 15px !important;
    color: white;
    &:hover {
      color: white;
      .event_color {
      opacity: 0
    }
    }
  }
}

.event_color {
  width: 12px;
  height: 12px;
  display: inline-block;
  border-radius: 100%;
  position: relative;
  top: 2px;
  margin: 0 2px 0 0;
}
</style>
