requirejs.config
  baseUrl: "js"
  enforceDefine: true
  paths:
    jquery: ["http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min", "libs/jquery"]
    jsapi: "http://www.google.com/jsapi?callback=define"
    backbone: "libs/backbone"
    underscore: "libs/underscore"
    text: "libs/text"
    bootstrap: "libs/bootstrap"

define [
  "jquery"
  "underscore"
  "backbone"
  "jsapi"
  "ab"
  ], (
  $
  _
  Backbone
  ab
  ) ->
  require [
    "router/router"
    "bootstrap"
    ], (
    Router
    bootstrap
    ) ->
    new Router()
    Backbone.history.start()

    #new window.ab(id, "test").goal() if Math.random() < 0.3
