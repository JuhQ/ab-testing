define [
  "jquery"
  "underscore"
  "backbone"
  "ab"
  "models/users"
  "text!templates/signup.html"
  "libs/backbone.syphon"
  ], (
  $
  _
  Backbone
  ab
  UserModel
  Template
  Syphon
  ) ->
  Backbone.View.extend
    el: ".container"
    events:
      "submit form#signup": "signup"
      "keyup input": "validate"

    initialize: ->
      unless @done
        @$el.hide().html _.template(Template)
        #new window.ab(2, "signup-header").test()
      @$el.show()

    signup: (event) ->
      event.preventDefault()
      element = $(event.currentTarget)
      model = new UserModel(Backbone.Syphon.serialize(this))
      model.setService "signup"
      model.save()

    validate: (event) ->
      element = $(event.currentTarget)
      parent = element.parent(".control-group")
      password = element.val()
      parent.removeClass "success info error warning"
      if password.length > 3 and password.length < 10
        
        # warning yellow
        # error red
        # info blue
        # success green
        parent.addClass "info"
      else parent.addClass "success"  if password.length >= 10

