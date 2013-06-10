define [
  "backbone"
  ], (
  Backbone
  ) ->
  Backbone.Model.extend
    url: "/api/statistics/%id/json"
    initialize: (options) ->
      @url = @url.replace("%id", options.id)
      return
