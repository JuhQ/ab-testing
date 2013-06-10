
window.ab = (id, element) ->
  that = @
  domready = (f) ->
    if /in/.test(document.readyState)
      setTimeout (->
        domready f
      ), 1
    else
      f()

  BrowserDetect =
    init: ->
      @browser = @searchString(@dataBrowser) or "An unknown browser"
      @version = @searchVersion(window.navigator.userAgent) or @searchVersion(window.navigator.appVersion) or "an unknown version"
      @OS = @searchString(@dataOS) or "an unknown OS"
      return

    searchString: (e) ->
      t = 0

      while t < e.length
        n = e[t].string
        r = e[t].prop
        @versionSearchString = e[t].versionSearch or e[t].identity
        if n
          return e[t].identity if n.indexOf(e[t].subString) isnt -1
        else return e[t].identity if r
        t++

    searchVersion: (e) ->
      t = e.indexOf(@versionSearchString)
      return if t is -1
      parseFloat e.substring(t + @versionSearchString.length + 1)

    dataBrowser: [
      string: window.navigator.userAgent
      subString: "Chrome"
      identity: "Chrome"
    ,
      string: window.navigator.userAgent
      subString: "OmniWeb"
      versionSearch: "OmniWeb/"
      identity: "OmniWeb"
    ,
      string: window.navigator.vendor
      subString: "Apple"
      identity: "Safari"
      versionSearch: "Version"
    ,
      prop: window.opera
      identity: "Opera"
      versionSearch: "Version"
    ,
      string: window.navigator.vendor
      subString: "iCab"
      identity: "iCab"
    ,
      string: window.navigator.vendor
      subString: "KDE"
      identity: "Konqueror"
    ,
      string: window.navigator.userAgent
      subString: "Firefox"
      identity: "Firefox"
    ,
      string: window.navigator.vendor
      subString: "Camino"
      identity: "Camino"
    ,
      string: window.navigator.userAgent
      subString: "Netscape"
      identity: "Netscape"
    ,
      string: window.navigator.userAgent
      subString: "MSIE"
      identity: "Explorer"
      versionSearch: "MSIE"
    ,
      string: window.navigator.userAgent
      subString: "Gecko"
      identity: "Mozilla"
      versionSearch: "rv"
    ,
      string: window.navigator.userAgent
      subString: "Mozilla"
      identity: "Netscape"
      versionSearch: "Mozilla"
    ]
    dataOS: [
      string: window.navigator.platform
      subString: "Win"
      identity: "Windows"
    ,
      string: window.navigator.platform
      subString: "Mac"
      identity: "Mac"
    ,
      string: window.navigator.userAgent
      subString: "iPhone"
      identity: "iPhone/iPod"
    ,
      string: window.navigator.platform
      subString: "Linux"
      identity: "Linux"
    ]

  mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(window.navigator.userAgent)
  localStorage = window.localStorage
  BrowserDetect.init()
  @id = id
  @element = element
  window.ab::test = (callback) ->
    return if not that.id or not that.element
    domready ->
      keyname = "ab-test:" + that.id
      element = document.getElementById(that.element)
      return unless element
      
      # save pageview to server
      log = (id, version) ->
        $.getJSON "/pageview/" + id + "/" + version

      
      # TODO if no localstorage, save to cookie
      if localStorage
        testData = localStorage.getItem(keyname)
        testData = JSON.parse(testData) if testData
      unless testData
        $.getJSON "/test/" + that.id, (data) ->
          return unless data.content
          element.innerHTML = data.content
          log that.id, data._id
          localStorage.setItem keyname, JSON.stringify(data)
          callback.call() if callback

      else
        $ ->
          return unless testData.content
          element.innerHTML = testData.content
          log that.id, testData._id
          callback.call() if callback

  window.ab::goal = (callback) ->
    return unless @id
    keyname = "ab-test:" + @id
    
    # TODO if no localstorage, use cookie
    if localStorage
      testData = localStorage.getItem(keyname)
      if testData
        testData = JSON.parse(testData)
        
        # TODO: save country/language
        browser = BrowserDetect
        json = JSON.stringify(
          os: browser.OS
          browser: browser.browser
          version: browser.version
          mobile: window.ab._mobile
        )
        $.getJSON "/goal/" + @id + "/" + testData._id + "/" + json
        callback.call() if callback
  null

if typeof define is "function" and define.amd
  define "ab", [], ->
    window.ab