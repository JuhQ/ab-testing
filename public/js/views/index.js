(function() {
  define(["jquery", "underscore", "backbone", "text!templates/index.html"], function($, _, Backbone, Template) {
    return Backbone.View.extend({
      el: ".container",
      events: {
        "click #test": "goal"
      },
      initialize: function() {
        var id;
        this.$el.html(_.template(Template));
        id = "51ae6d8f7686107ab9000002";
        return new window.ab(id, "test").test();
      },
      goal: function(event) {
        var id;
        event.preventDefault();
        id = "51ae6d8f7686107ab9000002";
        return new window.ab(id, "test").goal(function() {
          window.location.href = $(event.target).attr("href");
        });
      }
    });
  });

}).call(this);
