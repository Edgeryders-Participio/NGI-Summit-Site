<template>
  <li :class="klass">
    <textarea
      v-if="isTextarea"
      class="textarea"
      :ref="name"
      :placeholder="placeholder"
      v-model="response[name].value"
      v-on:keyup.meta.enter="next"
      v-on:keyup.ctrl.enter="next"
    />
    <div class="checkbox pl-1" v-if="isCheckbox">
      <input type="checkbox" id="check" :ref="name" :name="name" v-model="response[name].value"/>
      <label class="ml-1 font-bold" for="check">
        {{ placeholder }}
      </label>
    </div>
    <label class="label" v-else>
      <input
        :ref="name"
        :id="name"
        class="input"
        :placeholder="placeholder"
        :type="type"
        v-model="response[name].value"
        v-on:keyup.enter="next"
      />
    </label>
    <Error :error="error" />
  </li>
</template>

<script>
import Error from "./Error";

export default {
  props: {
    response: Object,
    type: String,
    name: String,
    placeholder: String,
    half: Boolean,
    autofocus: Boolean,
    next: Function
  },
  mounted() {
    this.handleFocus();
  },
  updated() {
    this.handleFocus();
  },
  computed: {
    error() {
      return this.response[this.name].error;
    },
    klass() {
      return `${this.half ? "half" : "full"} ${this.type}`;
    },
    isTextarea() {
      return this.type === "textarea";
    },
    isCheckbox() {
      return this.type === "checkbox";
    },
    textarea() {
      return this.$refs[this.name];
    },
    isFocused() {
      return document.activeElement == this.textarea;
    }
  },
  methods: {
    handleFocus() {
      if (this.autofocus && !this.isFocused) {
        this.textarea.focus();
      }
    }
  },
  components: { Error }
};
</script>

<style lang="scss" scoped>
.half {
  float: left;
  width: 47%;
   &:nth-child(2) {
    margin-left: 5%;
  }
}

.textarea {
  padding: 0.4rem;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  border-radius: 2px;
  min-height: 10rem;
}

.input {
  @apply border-2 font-bold;
  width: 100%;
  padding: .84rem .7rem;
  border-radius: 4px;
  font-size: 15px;
  margin: 0 0 10px 0;
}

input:focus, textarea:focus {
  border: 2px solid #FAD964;
}
.checkbox {

}
</style>
