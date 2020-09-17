<template>
  <div class="flex flex-col w-full">

    <Nav style="margin-bottom: 60px" :data="navItems" :globalStyle="globalStyleSheet" :stylesheet="this.config.style" :open="openMenu" ref="childComponent" @toggle="toggleMenu" />
    <MobileMenu :open="openMenu" :data="navItems" :globalStyle="globalStyleSheet" @toggle="toggleMenu" />
{{globalStyle}}
<div v-if="globalStyleSheet">
    <div v-for="(section, index) in sections" :key="index" :id="section.id">
      <component v-bind:is="section.type" :key="componentKey + index" :baseUrl="config.baseUrl" :globalStyle="globalStyleSheet" :data="section"></component>
    </div>
</div>
</div>
</template>

<script>

import Nav from "@/components/ui/Navigation.vue";
import MobileMenu from "@/components/ui/Mobile_Menu.vue";

import hero from "@/components/core/Hero.vue";
import custom from "@/components/core/Custom.vue";
import events from "@/components/edgeryders/Events.vue";
import topics from "@/components/core/Topics.vue";
import people from "@/components/core/People.vue";
import users from "@/components/core/Users.vue";
import partners from "@/components/edgeryders/Partners.vue";
import edgeryders from "@/components/edgeryders/About.vue";
import custom_form from "@/components/core/Form.vue";
import terms from "@/components/edgeryders/Terms.vue";

export default {
  name: "home",
  data() {
    return {
      category: { users: [] },
      categories: [],
      componentKey: 0,
      stylesheet: null,
      openMenu: false
    };
  },
  components: {
    people,
    users,
    topics,
    events,
    hero,
    Nav,
    MobileMenu,
    custom,
    partners,
    edgeryders,
    custom_form,
    terms
  },
  created() {
   this.getData();
    
    // this.sections.map(section => {
    //   return Vue.component(section.type, require(section.path + '.vue'))
    // });
  },
  mounted() {

  },
  methods: {
    getSectionData(type) {
      return this.sections.find(section => section.type === type) || {};
    },
    toggleMenu() {
      this.openMenu = !this.openMenu;
    }
  },
  computed: {
  }
};
</script>


