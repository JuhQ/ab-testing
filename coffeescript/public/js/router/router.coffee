define [
  "views/index"
  "views/signup"
  "views/login"
  "views/createtest"
  "views/statistics"
  ], (
  Index
  Signup
  Login
  CreateTest
  Statistics
  ) ->
  Backbone.Router.extend
    routes:
      "": "index"
      "index": "index"
      "login": "login"
      "logout": "logout"
      "signup": "signup"
      "create-test": "createTest"
      "statistics": "statistics"
      "statistics/:id": "statistics"

    view: null
    navi: $(".nav")
    index: ->
      @setPage Index

    login: ->
      @setPage Login
    logout: ->
      that = @
      $.getJSON "/logout", () ->
        that.navigate "/", trigger: true

    signup: ->
      @setPage Signup

    createTest: ->
      @setPage CreateTest

    statistics: (id) ->
      @setPage Statistics,
        id: id

    setPage: (Page, options) ->
      @view.undelegateEvents() if @view
      that = @
      $.getJSON "/check-login", (json) ->
        if json.login
          that.navi.find(".no-login-needed").remove()
          that.navi.find(".hide").show()
      @navi.find("li").removeClass "active"
      @navi.find("a[href='#/" + Backbone.history.fragment.toLowerCase() + "']").parent("li").addClass "active"

      @view = new Page(options)
      return
