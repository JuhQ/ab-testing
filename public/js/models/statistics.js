(function() {
  define(["backbone"], function(Backbone) {
    return Backbone.Model.extend({
      url: "/api/statistics/%id/json",
      initialize: function(options) {
        this.url = this.url.replace("%id", options.id);
      }
    });
  });

}).call(this);
