define [
  "backbone"
  ], (
  Backbone
  ) ->
  Backbone.Model.extend
    services:
      login: "/login"
      signup: "/signup"
      logout: "/logout"

    setService: (service) ->
      @url = @services[service]
      console.log this
      return

