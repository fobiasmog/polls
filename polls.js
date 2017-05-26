var polls = (function() {

	return {
		init: function(id) {

			new Vue({
                el: id,
                data: {
                    debug: false,
                    questions: '',
                    page: 0,
                },
                mounted: function() {
                    var that = this;
                    var obj = {};
                    var params = window.location.search.replace(/(^\?)/, '').split('&').map(function(e) { e = e.split('='); obj[e[0]] = e[1]; return obj });
                    console.log(obj);
                    $.getJSON('http://127.0.0.1/polls/data.json', obj, function(data) {
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
            });

		}
	}

}());
