(function() {
  requirejs.config({
    baseUrl: "js",
    enforceDefine: true,
    paths: {
      jquery: ["http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min", "libs/jquery"],
      jsapi: "http://www.google.com/jsapi?callback=define",
      backbone: "libs/backbone",
      underscore: "libs/underscore",
      text: "libs/text",
      bootstrap: "libs/bootstrap"
    }
  });

  define(["jquery", "underscore", "backbone", "jsapi", "ab"], function($, _, Backbone, ab) {
    return require(["router/router", "bootstrap"], function(Router, bootstrap) {
      new Router();
      return Backbone.history.start();
    });
  });

}).call(this);
