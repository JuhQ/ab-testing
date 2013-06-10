(function() {
  define(["backbone", "models/statistics"], function(Backbone, Model) {
    return Backbone.Collection.extend({
      url: "/api/statistics",
      model: Model
    });
  });

}).call(this);
