<template>
  <div class="flex flex-col w-full">

    <Nav style="margin-bottom: 60px" :data="navItems" :open="openMenu" ref="childComponent" @toggle="toggleMenu" />
    <MobileMenu :open="openMenu" :data="navItems" @toggle="toggleMenu" />
  
    <Hero :baseUrl="data.baseUrl" :custom="getSectionData('hero')"/>

    <div v-for="section in data.sections" :key="section.title" :id="section.id">
      <Custom v-if="section.type == 'custom'" :stylesheet="data.style" :data="section" html=true />
      <Topics v-if="section.type == 'topics'" :baseUrl="data.baseUrl" :stylesheet="data.style" :data="section" />
      <Events v-if="section.type == 'events'" :baseUrl="data.baseUrl" :stylesheet="data.style" :data="section" />
      <Users v-if="section.type == 'users'" :baseUrl="data.baseUrl" :custom="section" />
      <People v-if="section.type == 'people'" :baseUrl="data.baseUrl" :stylesheet="data.style" :data="section" />
      <Partners v-if="section.type == 'partners'" :stylesheet="data.style" :data="section"
      />
      <Edgeryders v-if="section.type == 'edgeryders'" :custom="section"
      />
      <Form v-if="section.type == 'form'" :baseUrl="data.baseUrl" :stylesheet="data.style" :data="section" />
    </div>

    <Terms :stylesheet="data.style" :data="getSectionData('terms')" />
</div>
</template>

<script>
import data from "@/data/config.json";

import Nav from "@/components/Navigation.vue";
import MobileMenu from "@/components/views/MobileMenu.vue";
import Hero from "@/components/Hero.vue";
import Custom from "@/components/Custom.vue";
import Events from "@/components/Events.vue";
import Topics from "@/components/Topics.vue";
import People from "@/components/People.vue";
import Users from "@/components/Users.vue";
import Partners from "@/components/Partners.vue";
import Edgeryders from "@/components/Edgeryders.vue";
import Form from "@/components/Form.vue";
import Terms from "@/components/Terms.vue";

import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      data,
      category: { users: [] },
      categories: [],
      sections: null,
      openMenu: false,
      menus: {
        slide: { buttonText: 'Slide' },
        push: { buttonText: 'Push' },
        pushRotate: { buttonText: 'Push Rotate' },
        reveal: { buttonText: 'Reveal' },
        scaleDown: { buttonText: 'Scale Down' },
        scaleRotate: { buttonText: 'Scale Rotate' },
        // elastic: { buttonText: 'Elastic - (WIP)' },
        // stack: { buttonText: 'Stack - (WIP)' },
        bubble: { buttonText: 'Bubble' },
        fallDown: { buttonText: 'Fall Down' }
      },
      side: 'left',
      currentMenu: 'reveal'
    };
  },
  components: {
    People,
    Users,
    Topics,
    Events,
    Hero,
    Nav,
    MobileMenu,
    Custom,
    Partners,
    Edgeryders,
    Form,
    Terms
  },
  created() {
    if (this.data.configId) {
      axios.get(
        `https://edgeryders.eu/webkit_components/topics.json?serializer=event&tags=webcontent`
      ).then(({ data }) => {
        var post = data.find(post => post.id === this.data.configId);
        var json = this.getJson(post.cooked);
        this.sections = json.sections;
      });
    } else {
      this.sections = this.data.sections;
    }
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
    navItems() {
      var navArray = this.sections.map(function(el) {
              if (el.id) {
                return {
                  title: el.title,
                  id: el.id,
                } 
              }
            });
      return navArray.filter(function (el) {
          return el != null;
      });
    }
  }
};
</script>


