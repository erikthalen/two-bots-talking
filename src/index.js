import Vue from 'vue'
import './style.scss'

import conversation from './vue/imessage-animation/imessage-animation.vue'

window.app = new Vue({
    el: '#app',
    components: {
        conversation,
    },
    data() {
        return {
            readyToRun: false,
            messages: new Array(100).fill(0),
            replies: [
                'I love that one',
                `That's so good`,
                `So true`,
                `Right?!`,
                `Oh yeah`,
                `Or this one:`,
                `❤️`,
                `Amazing!`,
                `Wow`,
                `That makes sense`,
                `OMG, yeah`,
                `Also:`,
                `Will never forget that one`,
                `So inspirational`,
                `Yes, yes, yes!`,
            ]
        }
    },

    methods: {
        randomReply() {
            return this.replies[Math.floor(Math.random() * this.replies.length)]
        },
    },
    mounted() {
        const messagesP = this.messages.map((slot, i) => {
            return fetch('https://api.adviceslip.com/advice')
            .then(res => res.json())
            .then(json => {
                return Math.random() < 0.1
                ? {
                    from: Math.random() <= 0.5 ? 'me' : 'them',
                    text: this.randomReply()
                }
                : {
                    from: (i % 2 === 0) ? 'me' : 'them',
                    text: json.slip.advice
                }
            })
        })
        Promise.all(messagesP).then(vals => {
            this.readyToRun = true
            this.messages = vals
        })
    }
})
