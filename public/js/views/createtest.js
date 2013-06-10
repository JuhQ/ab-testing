(function() {
  define(["jquery", "underscore", "backbone", "text!templates/create-test.html", "text!templates/create-test-form-testversion.html"], function($, _, Backbone, Template, PartTemplate) {
    return Backbone.View.extend({
      el: ".container",
      events: {
        "click .add-more-tests": "addMore"
      },
      initialize: function() {
        _.bindAll(this, "addMore");
        this.$el.html(_.template(Template));
        return this.addMore();
      },
      addMore: function(event) {
        if (event) {
          event.preventDefault();
        }
        return this.$(".test-case-container").append(_.template(PartTemplate));
      }
    });
  });

}).call(this);
