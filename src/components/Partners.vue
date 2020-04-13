<template>
  <div class="section md:section-md px-4 pt-6 md:pt-0 md:px-0 md:pt-8" id="partners">
    <h3 class="text-2xl font-bold text-center">
      Organised by
    </h3>
  	<div class="partners_wrapper md:partners_wrapper-md">
	   <a class="partner md:partner-md" v-for="item in custom.content" :key="item.title" :href="item.url">
	   		<img :src="getImg(item.logo)" />
		</a>
	</div>
  </div>
</template>

<script>

export default {
  methods: {
  	getImg(value) {
      return require('../assets/img/logos/' + value);
    }
  },
  props: ["custom", "display"]
};
</script>

