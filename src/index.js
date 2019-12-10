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
            slipIds: [],
            messages: [],
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
        getOneAdvice() {
            return fetch('https://api.adviceslip.com/advice')
                .then(res => res.json())
                .then(json => {
                    if (this.slipIds.includes(json.slip.slip_id)) {
                        return this.getOneAdvice()
                    }
                    this.slipIds.push(json.slip.slip_id)
                    return json
                })
        },
        getSomeAdvice() {
            return new Array(10).fill(0).map((el, i) => this.getOneAdvice()
                .then(json => {
                    return this.structureAdvice(json, i)
                })
            )
        },
        structureAdvice(json, i) {
            return Math.random() < 0.2 ? {
                from: Math.random() <= 0.5 ? 'me' : 'them',
                text: this.randomReply()
            } : {
                from: (i % 2 === 0) ? 'me' : 'them',
                text: json.slip.advice
            }
        },
        fillUpMessages() {
            const messagesP = this.getSomeAdvice()
            Promise.all(messagesP).then(vals => {
                this.messages.push(...vals)
                this.readyToRun = true

								//console.log(this.messages)

                if (this.messages.length < 500) {
                    this.fillUpMessages()
                }
            })
        },
    },
    mounted() {
        this.fillUpMessages()
    }
})
