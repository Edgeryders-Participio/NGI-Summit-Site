<template>
  <div class="section w-full mt-6 mb-6 md:section-md" :style="containerStyle(data.style)" id="form">
    <div class="md:flex mx-auto" :style="wrapperStyle(data.style)">
      <div class="w-full md:px-0 md:w-1/2 md:mr-8 md:pr-4 flex flex-col">
        <h3 :class="titleClassSize(data.style)" :style="textStyle('title', data.style)">{{ data.title }}</h3>
        <div class="section_text" :style="textStyle('paragraph', data.style)" v-html="data.content">
        </div>
      </div>
      <div class="md:mt-0 md:w-1/2 md:pt-10">
        <div class="even">
          <Title class="even md:pl-3" v-bind="slide" />
          <Body class="md:px-2" v-bind="slide" :response="response" :next="next" />
          <Fields class="md:px-2" v-bind="slide" :response="response" :next="next" />
          <Error v-for="error in errors" :key="error" :error="error" />
        </div>
        <Progress :index="slide.index" :maxIndex="maxIndex" mobile />
        <Navigation class="md:px-2" :stylesheet="data.style" :globalStyle="globalStyle" :back="back" :next="next" :maxIndex="maxIndex" v-bind="slide" />
      </div>
    </div>
  </div>
</template>

<script>
import Title from "./form/Title.vue";
import Body from "./form/Body.vue";
import Fields from "./form/Fields.vue";
import Error from "./form/Error.vue";
import Progress from "./form/Progress.vue";
import Navigation from "./form/Navigation.vue";
import submit from "@/helpers/discourse";

export default {
  props: ["data", "stylesheet", "baseUrl", "globalStyle"],
  data() {
    return { form: {}, currentIndex: 0, errors: [] };
  },
  created() {
    this.$set(this.form, 'settings', { createTopic: this.data.settings });
    this.slides
      .filter(s => s.index)
      .forEach(({ index, body, settings, fields }) => {
        this.$set(this.form, index, { body, settings });
        fields.forEach(({ name, settings = {} }) => {
          this.$set(this.form[index], name, { settings });
          this.$set(this.form[index][name], "value", "");
          this.$set(this.form[index][name], "error", "");
        });
      });

    document.addEventListener("keyup", ({ target: { tagName }, keyCode }) => {
      if (["INPUT", "TEXTAREA"].includes(tagName)) {
        return;
      }

      switch (keyCode) {
        case 37:
          return this.back ? this.back() : null;
        case 39:
          return this.next ? this.next() : null;
      }
    });
  },
  computed: {
    slides() {
      return this.data.slides.map(slide => Object.assign({}, this.data.slideDefaults, slide))
    },
    slide() {
      return this.slides[this.currentIndex];
    },
    response() {
      return this.form[this.slide.index] || {};
    },
    maxIndex() {
      return Math.max(...this.slides.map(slide => slide.index || 0));
    },
    back() {
      return this.currentIndex > 0 ? this.retreat : null;
    },
    next() {
      return () =>
        this.slide.submit
          ? this.validate() && submit(this.form).then(this.proceed, this.fail)
          : this.validate() && this.proceed();
    }
  },
  methods: {
    retreat() {
      this.currentIndex -= 1;
    },
    proceed() {
      this.currentIndex += 1;
    },
    fail(errors) {
      this.errors = errors;
    },
    validate() {
      this.errors = [];
      const { index, fields } = this.slide;
      if (!index || !fields) {
        return true;
      }

      fields.forEach(
        ({ name, required, error }) =>
          (this.response[name].error =
            required && !this.response[name].value ? error : null)
      );

      return Object.values(this.response).every(({ error }) => !error);
    }
  },
  components: {
    Title,
    Body,
    Fields,
    Error,
    Progress,
    Navigation
  }
};
</script>

<style scoped lang="scss">
.content {
  @apply flex flex-col pt-2;
  flex-basis: 50%;
}

.form {
  @apply bg-gray-100 p-6 mt-2;
  flex-basis: 45%;
  flex-grow: 0;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
}
</style>
