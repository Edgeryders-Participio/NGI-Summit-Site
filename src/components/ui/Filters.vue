<template>
  <div class="filters md:filters-md mt-4"> 
      <h4 class="font-bold pb-2 text-lg w-full mb-3 border-b pl-1 mt-0 hidden md:block">Filter by event type</h4>
      <div class="filter" v-for="(item, index) in filters" :key="index" @click="select(item.type)" :class="{active: type == item.type}">
        <span class="circle" :style="{background: item.color}"></span>
        {{item.type}}
      </div>
  </div>

</template>

<script>
import { bus } from '@/main'

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
  props: ["filters"],
  methods: {
    select(value){
      if (this.type == value) {
        this.type = null
      } else {
        this.type = value;
      }
    }
  },
  mounted() {
    bus.$on('filterType', (data) => {
      this.type = data;
    })
  },
  watch: {
    type() {
      if (this.type) {
        bus.$emit('filterType', this.type);
      } else {
        bus.$emit('filterType', null);
      }
    }
  }
};
</script>

<style lang="scss">


.filter {
  padding: .8rem .3rem;
  border: 1px solid rgba(0,0,0,0);
  border-top: 1px solid #e2e8f0;
  @apply border-t text-sm;

  transition: background .4s ease;
  &:first-of-type {
    border-top: 1px solid rgba(0,0,0,0);
}
  &.active{
    @apply font-bold ;
    border: 1px solid #e2e8f0 !important;
    padding: .8rem .3rem !important;
    background: rgba(0,0,0,0.03);
    border-radius: 10px;
  }
  &:hover {
    cursor: pointer
  }
}



.filter.active + .filter {
 border-top: 1px solid rgba(0,0,0,0);
}

.circle {
  width: 12px;
  height: 12px;
  display: inline-block;
  border-radius: 100%;
  position: relative;
  top: 2px;
  margin: 0 6px 0 10px;
}
</style>
