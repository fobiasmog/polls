<template>
    <div id="poll">
        <template v-for="q in questions">
            <div class='questions' v-bind:class='{ show : q.id == page }'>

                <p>{{ q.question }}</p>

                <template v-if="q.type === 'input'">
                    <div class='question'>
                        <input type="" v-bind:value="q.answer" v-model="q.answer">
                    </div>
                </template>

                <template v-else-if="q.type === 'checkbox'">
                    <div class='question' v-for="v in q.variants">
                        <label>
                            {{ v.name }}
                            <input type="checkbox" v-model="q.answer" v-bind:value="v.value">
                        </label>
                    </div>
                </template>

                <template v-else-if="q.type === 'select'">
                    <div class='question'>
                        <select v-bind:name="q.name" v-model="q.answer">
                            <option disabled selected value="">{{ q.default.name }}</option>
                            <option v-for="option in q.variants" v-bind:value="option.value">{{ option.name }}</option>
                        </select>
                    </div>
                </template>

                <template v-else-if="q.type === 'radio'">
                    <div class='question' v-for="v in q.variants">
                        <label>
                            {{ v.label }}
                            <input type="radio" v-bind:name="q.name" v-model="q.answer" v-bind:value="v.value">
                        </label>
                    </div>
                </template>

                <template v-if="q.custom">
                    <div class='question'>
                        <input type="" v-model="q.custom.answer" placeholder="Custom question">
                    </div>
                </template>

                <template v-if="debug">
                    <p>CHECKED: {{ q.answer }}</p>
                    <p v-if="q.custom">CHECKED: {{ q.custom.answer }}</p>
                </template>

                <div class='navigation'>
                    <div v-if="q.id < questions.length - 1">
                        <button v-on:click="prev_page" v-if="q.id > 0">Back</button>
                        <button v-on:click="next_page">Next</button>
                    </div>
                    <div v-if="q.id == (questions.length-1)">
                        <button v-on:click="prev_page">Back</button>
                        <button v-show="questions" v-on:click="send_answers">Send</button>
                    </div>
                </div>

            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'poll',
        data () {
            return {
                debug: false,
                questions: '',
                page: 0
            }
        },
        mounted: function() {
            var that = this;
            var obj = {};
            var params = window.location.search.replace(/(^\?)/, '').split('&').map(function(e) { e = e.split('='); obj[e[0]] = e[1]; return obj });
            console.log(obj);
            $.getJSON('http://127.0.0.1/polls/dev/data.json', obj, function(data) {
                that.questions = data.questions;
            })
        },
        methods: {
            send_answers: function() {
                var answers = this.questions.map(function(e) {
                    var el = {
                        id: e.id,
                        answer: e.answer,
                    };
                    e.custom ? el.custom = e.custom.answer : false;

                    return el;
                });
                console.log(answers);
                console.log(JSON.stringify(answers));
            },
            next_page: function() {
                this.page = this.page + 1;
            },
            prev_page: function() {
                this.page = this.page - 1;
            }
        }
    }
</script>

<style>
    body {
        /*height: 100vh;*/
    }
    .questions {
        display: none;
        position: relative;
        left: -50%;
        top: -50%;
    }
    .show {
        display: inline-block;
        text-align: center;
    }
    #poll {
        position: fixed;
        left: 50%;
        top: 30%;
    }
    .navigation {
        margin-top: 20px;
    }

</style>
