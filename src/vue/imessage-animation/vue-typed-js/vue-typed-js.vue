


<template>
  <div class="typed-element" ref="typedElement">
    <slot></slot>
  </div>
</template>

<script>
/**
 *
 *
 *
 *  THIS WHOLE SHIT IS TAKEN FROM
 *  https://github.com/Orlandster/vue-typed-js#examples
 *
 *  I COULDN'T GET IT TO WORK WHEN IMPORTING FROM NODE_MODULES
 *  SO I JUST COPY-PASTED THE SOURCE CODE IN HERE
 *
 *  / ERIK (with a quite firm deadline..)
 *
 *
 *
 *
 *
 */
import Typed from "typed.js";
import { props, getEventHandlers } from "./typed-component.config";
export default {
  name: "vue-typed-js",
  props,
  data() {
    return {
      typedObj: null
    };
  },
  methods: {
    throwError: function(message) {
      throw new TypeError(message);
    },
    initTypedJS: function() {
      const $typed = this.$refs.typedElement.querySelector(".typing");
      if (this.$slots.default.length > 1) {
        this.throwError(
          `Just one child element allowed inside <${this.$options.name}> component.`
        );
      } else if (this.$slots.default.length === 1) {
        let typedConfig = this.$props;
        typedConfig = getEventHandlers(this, typedConfig);
        this.typedObj = new Typed($typed, typedConfig);
      }
    }
  },
  mounted() {
    this.initTypedJS();
  },
  destroyed() {
    this.typedObj.destroy();
  }
};
</script>
