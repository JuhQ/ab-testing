define [
  "jquery"
  "underscore"
  "backbone"
  "models/users"
  "text!templates/login.html"
  "libs/backbone.syphon"
  ], (
  $
  _
  Backbone
  UserModel
  Template
  Syphon
  ) ->
  Backbone.View.extend
    el: ".container"
    events:
      "submit form#login": "login"

    initialize: ->
      @$el.html _.template(Template)

    login: (event) ->
      event.preventDefault()
      element = $(event.currentTarget)
      model = new UserModel(Backbone.Syphon.serialize(this))
      model.setService "login"
      model.save()