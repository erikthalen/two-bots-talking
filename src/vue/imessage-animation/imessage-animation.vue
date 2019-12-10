<template>
  <div class="imessage-animation">
    <transition-group
      name="conversation"
      tag="div"
      class="imessage-animation__messages"
      v-if="sentMessages.length"
    >
      <p
        v-for="(message, i) in sentMessages"
        :key="message.text + i"
        :class="`from-${message.from} conversation-item`"
        v-html="message.text"
      ></p>
      <other-is-typing :key="'typing'" v-if="isWritingReply" />
    </transition-group>

    <input-field @doneTyping="doneTyping" :message="currentInput" />
  </div>
</template>

<script>
import inputField from "./input-field.vue";
import otherIsTyping from "./other-is-typing.vue";

//import send from './../../../assets/imessage_send.mp3'

export default {
  name: "imessage-animation",
  components: {
    inputField,
    otherIsTyping
  },
	props: {
		conversation: { type: Array, default: [] }
	},
  data() {
    return {
      isRunning: false,
      currentInput: "",
      isWritingReply: false,

      sentMessages: [],

      currentMessageIndex: 0
    };
  },
  computed: {
    running() {
      return this.conversation.length;
    },
    getLengthOfLastMessage() {
      // calc how long the message is and take that times delay/char
			return this.conversation[this.currentMessageIndex - 1]
        ? this.conversation[this.currentMessageIndex - 1].text.length * 50
        : 1500;
    },
    getLengthOfThisMessage() {
      // calc how long the message is and take that times delay/char
      return this.conversation.length
        ? Math.max(
            this.conversation[this.currentMessageIndex].text.length * 10,
            300
          )
        : 1500;
    }
  },
  watch: {
    running: "startConversation"
  },
  methods: {
    startConversation() {
			if(!this.isRunning) {
      		this.nextStep();
					this.isRunning = true
			}
    },

    nextStep() {
      if (this.conversationDone()) {
        return;
      }

      const writer = this.conversation[this.currentMessageIndex].from;

      this.delay(this.getLengthOfLastMessage).then(() => {
        writer === "me" ? this.loadStringToInputField() : this.startTypeReply();
      });
    },

    // gets called from the input component, when it's done writing a message
    doneTyping() {
      this.postMessageAndTriggerNextStep();
      this.playMessageSound("send");
    },

    // shows the animated 'dots',
    // and posts the current reply after a short delay
    startTypeReply() {
      this.isWritingReply = true;

      this.delay(this.getLengthOfThisMessage).then(() => {
        this.isWritingReply = false;

        this.postMessageAndTriggerNextStep();
        this.playMessageSound("receive");
      });
    },

    // posts the next message to the ongoing conversation
    postMessageAndTriggerNextStep() {
      this.sentMessages.push(this.conversation[this.currentMessageIndex]);

      this.incrementConversationIndex();
      this.nextStep();
    },

    // the input field listens to the current input,
    // and starts to type whenever the prop is updated
    loadStringToInputField() {
      this.currentInput = this.conversation[this.currentMessageIndex].text;
    },

    // true when both arrays have 'run out'
    conversationDone() {
      return this.currentMessageIndex >= this.conversation.length;
    },

    // chain a .then() that runs after 'time'-ms
    delay(time) {
      return new Promise(res => setTimeout(res, time));
    },

    // updates where in the array of messages we currently are
    incrementConversationIndex() {
      this.currentMessageIndex += 1;
    },

    playMessageSound(type) {
      const sound = new Audio(`/assets/imessage_${type}.mp3`);
      sound.volume = 0.2;
      sound.play();
    }
  },
  mounted() {
    // this.running = true;
  }
};
</script>
