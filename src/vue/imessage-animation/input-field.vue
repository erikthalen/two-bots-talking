<template>
  <div class="input-field" ref="input">
    <vue-typed-js
      v-if="inputText"
      :key="inputText"
      @onComplete="onDone"
      :strings="[inputText]"
      :contentType="'html'"
    >
      <p ref="inputText" class="typing"></p>
    </vue-typed-js>

    <div :class="{'active': buttonActive}" class="input-field__button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        viewBox="0 0 492 492"
        style="enable-background:new 0 0 492 492;"
        xml:space="preserve"
        fill="white"
      >
        <g>
          <g>
            <path
              d="M442.627,185.388L265.083,7.844C260.019,2.78,253.263,0,245.915,0c-7.204,0-13.956,2.78-19.02,7.844L49.347,185.388    c-10.488,10.492-10.488,27.568,0,38.052l16.12,16.128c5.064,5.06,11.82,7.844,19.028,7.844c7.204,0,14.192-2.784,19.252-7.844    l103.808-103.584v329.084c0,14.832,11.616,26.932,26.448,26.932h22.8c14.832,0,27.624-12.1,27.624-26.932V134.816l104.396,104.752    c5.06,5.06,11.636,7.844,18.844,7.844s13.864-2.784,18.932-7.844l16.072-16.128C453.163,212.952,453.123,195.88,442.627,185.388z"
            />
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
import VueTypedJs from "./vue-typed-js/vue-typed-js.vue";

export default {
  name: "input-field",
  components: {
    VueTypedJs
  },
  props: {
    message: { type: String, default: "" }
  },
  data() {
    return {
      // settings
      timeToClearInputField: 300,
      timeToSentSessage: 200,

      buttonActive: false,
      defaultHeight: 0,
      sound: new Audio(`/assets/typing-long.mp3`)
    };
  },
  computed: {
    inputText() {
      return this.message.length ? this.message : null;
    }
  },
  watch: {
    inputText: "playSound"
  },
  methods: {
    onDone() {
      // the button gets clicked
      this.simulateButtonClick();
      this.pauseSound();

      // after a short delay the input is cleared
      this.delay(this.timeToClearInputField).then(() => {
        this.setExplicitHeight();
        this.clearInputField();
        this.delay(50).then(this.setDefaultHeight);

        // after another short delay the message in posted to the conversation
        this.delay(this.timeToSentSessage).then(() => {
          this.$emit("doneTyping", this.message);
        });
      });
    },
    clearInputField() {
      this.$refs.inputText.innerHTML = "";
    },
    simulateButtonClick() {
      this.buttonActive = true;
      this.delay(500).then(() => (this.buttonActive = false));
    },
    delay(time) {
      return new Promise(res => setTimeout(res, time));
    },
    setExplicitHeight() {
      this.$refs.input.style.height =
        this.$refs.input.getBoundingClientRect().height + "px";
    },
    setDefaultHeight() {
      this.$refs.input.style.height = this.defaultHeight + "px";
      this.delay(200).then(() =>
        this.$refs.input.style.removeProperty("height")
      );
    },
    playSound() {
      this.sound.loop = true;
      this.sound.volume = 0.5;
      this.sound.play();
    },
    pauseSound() {
      this.sound.pause();
    }
  },
  mounted() {
    this.defaultHeight = this.$refs.input.getBoundingClientRect().height;
  }
};
</script>
