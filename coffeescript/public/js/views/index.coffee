define [
  "jquery"
  "underscore"
  "backbone"
  "text!templates/index.html"
  ], (
  $
  _
  Backbone
  Template
  ) ->
  Backbone.View.extend
    el: ".container"
    events:
      "click #test": "goal"
    initialize: ->
      @$el.html _.template(Template)
      id = "51ae6d8f7686107ab9000002"
      new window.ab(id, "test").test()
    goal: (event) ->
      event.preventDefault()
      id = "51ae6d8f7686107ab9000002"
      new window.ab(id, "test").goal(->
        window.location.href = $(event.target).attr("href")
        return
      )