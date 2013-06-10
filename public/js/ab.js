(function() {
  window.ab = function(id, element) {
    var BrowserDetect, domready, localStorage, mobile, that;
    that = this;
    domready = function(f) {
      if (/in/.test(document.readyState)) {
        return setTimeout((function() {
          return domready(f);
        }), 1);
      } else {
        return f();
      }
    };
    BrowserDetect = {
      init: function() {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(window.navigator.userAgent) || this.searchVersion(window.navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
      },
      searchString: function(e) {
        var n, r, t;
        t = 0;
        while (t < e.length) {
          n = e[t].string;
          r = e[t].prop;
          this.versionSearchString = e[t].versionSearch || e[t].identity;
          if (n) {
            if (n.indexOf(e[t].subString) !== -1) {
              return e[t].identity;
            }
          } else {
            if (r) {
              return e[t].identity;
            }
          }
          t++;
        }
      },
      searchVersion: function(e) {
        var t;
        t = e.indexOf(this.versionSearchString);
        if (t === -1) {
          return;
        }
        return parseFloat(e.substring(t + this.versionSearchString.length + 1));
      },
      dataBrowser: [
        {
          string: window.navigator.userAgent,
          subString: "Chrome",
          identity: "Chrome"
        }, {
          string: window.navigator.userAgent,
          subString: "OmniWeb",
          versionSearch: "OmniWeb/",
          identity: "OmniWeb"
        }, {
          string: window.navigator.vendor,
          subString: "Apple",
          identity: "Safari",
          versionSearch: "Version"
        }, {
          prop: window.opera,
          identity: "Opera",
          versionSearch: "Version"
        }, {
          string: window.navigator.vendor,
          subString: "iCab",
          identity: "iCab"
        }, {
          string: window.navigator.vendor,
          subString: "KDE",
          identity: "Konqueror"
        }, {
          string: window.navigator.userAgent,
          subString: "Firefox",
          identity: "Firefox"
        }, {
          string: window.navigator.vendor,
          subString: "Camino",
          identity: "Camino"
        }, {
          string: window.navigator.userAgent,
          subString: "Netscape",
          identity: "Netscape"
        }, {
          string: window.navigator.userAgent,
          subString: "MSIE",
          identity: "Explorer",
          versionSearch: "MSIE"
        }, {
          string: window.navigator.userAgent,
          subString: "Gecko",
          identity: "Mozilla",
          versionSearch: "rv"
        }, {
          string: window.navigator.userAgent,
          subString: "Mozilla",
          identity: "Netscape",
          versionSearch: "Mozilla"
        }
      ],
      dataOS: [
        {
          string: window.navigator.platform,
          subString: "Win",
          identity: "Windows"
        }, {
          string: window.navigator.platform,
          subString: "Mac",
          identity: "Mac"
        }, {
          string: window.navigator.userAgent,
          subString: "iPhone",
          identity: "iPhone/iPod"
        }, {
          string: window.navigator.platform,
          subString: "Linux",
          identity: "Linux"
        }
      ]
    };
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(window.navigator.userAgent);
    localStorage = window.localStorage;
    BrowserDetect.init();
    this.id = id;
    this.element = element;
    window.ab.prototype.test = function(callback) {
      if (!that.id || !that.element) {
        return;
      }
      return domready(function() {
        var keyname, log, testData;
        keyname = "ab-test:" + that.id;
        element = document.getElementById(that.element);
        if (!element) {
          return;
        }
        log = function(id, version) {
          return $.getJSON("/pageview/" + id + "/" + version);
        };
        if (localStorage) {
          testData = localStorage.getItem(keyname);
          if (testData) {
            testData = JSON.parse(testData);
          }
        }
        if (!testData) {
          return $.getJSON("/test/" + that.id, function(data) {
            if (!data.content) {
              return;
            }
            element.innerHTML = data.content;
            log(that.id, data._id);
            localStorage.setItem(keyname, JSON.stringify(data));
            if (callback) {
              return callback.call();
            }
          });
        } else {
          return $(function() {
            if (!testData.content) {
              return;
            }
            element.innerHTML = testData.content;
            log(that.id, testData._id);
            if (callback) {
              return callback.call();
            }
          });
        }
      });
    };
    window.ab.prototype.goal = function(callback) {
      var browser, json, keyname, testData;
      if (!this.id) {
        return;
      }
      keyname = "ab-test:" + this.id;
      if (localStorage) {
        testData = localStorage.getItem(keyname);
        if (testData) {
          testData = JSON.parse(testData);
          browser = BrowserDetect;
          json = JSON.stringify({
            os: browser.OS,
            browser: browser.browser,
            version: browser.version,
            mobile: window.ab._mobile
          });
          $.getJSON("/goal/" + this.id + "/" + testData._id + "/" + json);
          if (callback) {
            return callback.call();
          }
        }
      }
    };
    return null;
  };

  if (typeof define === "function" && define.amd) {
    define("ab", [], function() {
      return window.ab;
    });
  }

}).call(this);
