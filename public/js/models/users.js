(function() {
  define(["backbone"], function(Backbone) {
    return Backbone.Model.extend({
      services: {
        login: "/login",
        signup: "/signup",
        logout: "/logout"
      },
      setService: function(service) {
        this.url = this.services[service];
        console.log(this);
      }
    });
  });

}).call(this);
