define [
  "backbone"
  "models/statistics"
  ], (
  Backbone
  Model
  ) ->
  Backbone.Collection.extend
    url: "/api/statistics"
    model: Model