(function() {
  define(["views/index", "views/signup", "views/login", "views/createtest", "views/statistics"], function(Index, Signup, Login, CreateTest, Statistics) {
    return Backbone.Router.extend({
      routes: {
        "": "index",
        "index": "index",
        "login": "login",
        "logout": "logout",
        "signup": "signup",
        "create-test": "createTest",
        "statistics": "statistics",
        "statistics/:id": "statistics"
      },
      view: null,
      navi: $(".nav"),
      index: function() {
        return this.setPage(Index);
      },
      login: function() {
        return this.setPage(Login);
      },
      logout: function() {
        var that;
        that = this;
        return $.getJSON("/logout", function() {
          return that.navigate("/", {
            trigger: true
          });
        });
      },
      signup: function() {
        return this.setPage(Signup);
      },
      createTest: function() {
        return this.setPage(CreateTest);
      },
      statistics: function(id) {
        return this.setPage(Statistics, {
          id: id
        });
      },
      setPage: function(Page, options) {
        var that;
        if (this.view) {
          this.view.undelegateEvents();
        }
        that = this;
        $.getJSON("/check-login", function(json) {
          if (json.login) {
            that.navi.find(".no-login-needed").remove();
            return that.navi.find(".hide").show();
          }
        });
        this.navi.find("li").removeClass("active");
        this.navi.find("a[href='#/" + Backbone.history.fragment.toLowerCase() + "']").parent("li").addClass("active");
        this.view = new Page(options);
      }
    });
  });

}).call(this);
