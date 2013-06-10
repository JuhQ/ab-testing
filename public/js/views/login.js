(function() {
  define(["jquery", "underscore", "backbone", "models/users", "text!templates/login.html", "libs/backbone.syphon"], function($, _, Backbone, UserModel, Template, Syphon) {
    return Backbone.View.extend({
      el: ".container",
      events: {
        "submit form#login": "login"
      },
      initialize: function() {
        return this.$el.html(_.template(Template));
      },
      login: function(event) {
        var element, model;
        event.preventDefault();
        element = $(event.currentTarget);
        model = new UserModel(Backbone.Syphon.serialize(this));
        model.setService("login");
        return model.save();
      }
    });
  });

}).call(this);
