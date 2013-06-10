define [
  "jquery"
  "underscore"
  "backbone"
  "text!templates/create-test.html"
  "text!templates/create-test-form-testversion.html"
  ], (
  $
  _
  Backbone
  Template
  PartTemplate
  ) ->
  Backbone.View.extend
    el: ".container"
    events:
      "click .add-more-tests": "addMore"
    initialize: ->
      _.bindAll this, "addMore"
      @$el.html _.template Template

      @addMore()

    addMore: (event) ->
      event.preventDefault() if event
      @$(".test-case-container").append _.template PartTemplate