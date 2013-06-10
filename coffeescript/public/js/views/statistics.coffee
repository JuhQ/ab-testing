define [
  "jquery"
  "underscore"
  "backbone"
  "jsapi"
  "text!templates/statistics.html"
  "collections/statistics"
  "models/statistics"
  ], (
  $
  _
  Backbone
  Google
  StatisticsTemplate
  StatisticsCollection
  StatisticsModel
  ) ->
  Backbone.View.extend
    el: ".container"
    initialize: ->
      _.bindAll @, "drawChart"
      @$el.html "Loading..."

      return @printList() unless @id

      google.load "visualization", "1",
        callback: @drawChart
        packages: ["corechart"]

    printList: ->
      collection = new StatisticsCollection()
      that = @
      collection.fetch success: ->
        ul = that.$el.html("<ul/>")
        collection.each (model) ->
          ul.append '<li><a href="#/statistics/' + model.get("_id") + '">' + model.get("name") + '</a></li>'

    drawChart: ->
      that = @
      variations = {}
      
      # change this to model
      model = new StatisticsModel id: @id
      model.fetch success: ->
        that.$el.html _.template(StatisticsTemplate,
          name: model.get("test").name
        )
        pageviewData = new google.visualization.DataTable()
        pageviewData.addColumn "date", "Variation"
        $.each model.get("pageviews"), (i, item) ->
          unless variations[item.testversion]
            variations[item.testversion] = true
            pageviewData.addColumn "number", item.testversion

        goalData = pageviewData.clone()
        averageData = pageviewData.clone()
        sorted = {}
        sorted.pageviews = {}
        sorted.goals = {}
        sorted.average = {}
        buildSorted = (content, name) ->
          $.each content, (i, item) ->
            unless sorted[name][item.d]
              date = new Date(item.d)
              sorted[name][item.d] = {}
            $.each variations, (variation) ->
              sorted[name][item.d][variation] = 0
              return

          $.each content, (i, item) ->
            sorted[name][item.d][item.testversion] = item.rows
            return


        buildSorted model.get("pageviews"), "pageviews"
        buildSorted model.get("goals"), "goals"
        formatRows = (items) ->
          if _.size(items) is 1
            tomorrow = new Date((new Date()).getTime() + 86400000)
            items[tomorrow] = {}
            $.each variations, (variation) ->
              items[tomorrow][variation] = 0 unless variation of items[tomorrow]
              return

            return formatRows(items)
          items

        formatData = (items, data, suffix) ->
          i = 0
          items = formatRows(items)
          data.addRows _.size(items)
          $.each items, (date, item) ->
            u = 1
            data.setCell i, 0, new Date(date)
            $.each item, (name, rows) ->
              if suffix
                data.setCell i, u, rows, rows + "" + suffix
              else
                data.setCell i, u, rows
              u++
            i++

        
        formatData sorted.pageviews, pageviewData
        chart = new google.visualization.AreaChart(document.getElementById("pageviews"))
        chart.draw pageviewData,
          title: "Pageviews for test: " + model.get("test").name
          hAxis:
            title: "Dates"
            titleTextStyle:
              color: "red"

        formatData sorted.goals, goalData
        chart = new google.visualization.AreaChart(document.getElementById("goals"))
        chart.draw goalData,
          title: "Goals for test: " + model.get("test").name
          hAxis:
            title: "Dates"
            titleTextStyle:
              color: "red"


        # conversion rate
        $.each sorted.goals, (i, item) ->
          $.each item, (u, row) ->
            sorted.average[i] = {} unless sorted.average[i]
            if sorted.goals[i][u] is 0
              sorted.average[i][u] = 0
            else
              sorted.average[i][u] = Number(((sorted.goals[i][u] / sorted.pageviews[i][u]) * 100).toFixed(2)) or 0
            return
        
        formatData sorted.average, averageData, "%"
        chart = new google.visualization.AreaChart(document.getElementById("average"))
        chart.draw averageData,
          title: "Conversion rate for test: " + model.get("test").name
          hAxis:
            title: "Dates"
            titleTextStyle:
              color: "red"
        
      