(function() {
  define(["jquery", "underscore", "backbone", "ab", "models/users", "text!templates/signup.html", "libs/backbone.syphon"], function($, _, Backbone, ab, UserModel, Template, Syphon) {
    return Backbone.View.extend({
      el: ".container",
      events: {
        "submit form#signup": "signup",
        "keyup input": "validate"
      },
      initialize: function() {
        if (!this.done) {
          this.$el.hide().html(_.template(Template));
        }
        return this.$el.show();
      },
      signup: function(event) {
        var element, model;
        event.preventDefault();
        element = $(event.currentTarget);
        model = new UserModel(Backbone.Syphon.serialize(this));
        model.setService("signup");
        return model.save();
      },
      validate: function(event) {
        var element, parent, password;
        element = $(event.currentTarget);
        parent = element.parent(".control-group");
        password = element.val();
        parent.removeClass("success info error warning");
        if (password.length > 3 && password.length < 10) {
          return parent.addClass("info");
        } else {
          if (password.length >= 10) {
            return parent.addClass("success");
          }
        }
      }
    });
  });

}).call(this);
