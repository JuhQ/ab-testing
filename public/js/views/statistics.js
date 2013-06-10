(function() {
  define(["jquery", "underscore", "backbone", "jsapi", "text!templates/statistics.html", "collections/statistics", "models/statistics"], function($, _, Backbone, Google, StatisticsTemplate, StatisticsCollection, StatisticsModel) {
    return Backbone.View.extend({
      el: ".container",
      initialize: function() {
        _.bindAll(this, "drawChart");
        this.$el.html("Loading...");
        if (!this.id) {
          return this.printList();
        }
        return google.load("visualization", "1", {
          callback: this.drawChart,
          packages: ["corechart"]
        });
      },
      printList: function() {
        var collection, that;
        collection = new StatisticsCollection();
        that = this;
        return collection.fetch({
          success: function() {
            var ul;
            ul = that.$el.html("<ul/>");
            return collection.each(function(model) {
              return ul.append('<li><a href="#/statistics/' + model.get("_id") + '">' + model.get("name") + '</a></li>');
            });
          }
        });
      },
      drawChart: function() {
        var model, that, variations;
        that = this;
        variations = {};
        model = new StatisticsModel({
          id: this.id
        });
        return model.fetch({
          success: function() {
            var averageData, buildSorted, chart, formatData, formatRows, goalData, pageviewData, sorted;
            that.$el.html(_.template(StatisticsTemplate, {
              name: model.get("test").name
            }));
            pageviewData = new google.visualization.DataTable();
            pageviewData.addColumn("date", "Variation");
            $.each(model.get("pageviews"), function(i, item) {
              if (!variations[item.testversion]) {
                variations[item.testversion] = true;
                return pageviewData.addColumn("number", item.testversion);
              }
            });
            goalData = pageviewData.clone();
            averageData = pageviewData.clone();
            sorted = {};
            sorted.pageviews = {};
            sorted.goals = {};
            sorted.average = {};
            buildSorted = function(content, name) {
              $.each(content, function(i, item) {
                var date;
                if (!sorted[name][item.d]) {
                  date = new Date(item.d);
                  sorted[name][item.d] = {};
                }
                return $.each(variations, function(variation) {
                  sorted[name][item.d][variation] = 0;
                });
              });
              return $.each(content, function(i, item) {
                sorted[name][item.d][item.testversion] = item.rows;
              });
            };
            buildSorted(model.get("pageviews"), "pageviews");
            buildSorted(model.get("goals"), "goals");
            formatRows = function(items) {
              var tomorrow;
              if (_.size(items) === 1) {
                tomorrow = new Date((new Date()).getTime() + 86400000);
                items[tomorrow] = {};
                $.each(variations, function(variation) {
                  if (!(variation in items[tomorrow])) {
                    items[tomorrow][variation] = 0;
                  }
                });
                return formatRows(items);
              }
              return items;
            };
            formatData = function(items, data, suffix) {
              var i;
              i = 0;
              items = formatRows(items);
              data.addRows(_.size(items));
              return $.each(items, function(date, item) {
                var u;
                u = 1;
                data.setCell(i, 0, new Date(date));
                $.each(item, function(name, rows) {
                  if (suffix) {
                    data.setCell(i, u, rows, rows + "" + suffix);
                  } else {
                    data.setCell(i, u, rows);
                  }
                  return u++;
                });
                return i++;
              });
            };
            formatData(sorted.pageviews, pageviewData);
            chart = new google.visualization.AreaChart(document.getElementById("pageviews"));
            chart.draw(pageviewData, {
              title: "Pageviews for test: " + model.get("test").name,
              hAxis: {
                title: "Dates",
                titleTextStyle: {
                  color: "red"
                }
              }
            });
            formatData(sorted.goals, goalData);
            chart = new google.visualization.AreaChart(document.getElementById("goals"));
            chart.draw(goalData, {
              title: "Goals for test: " + model.get("test").name,
              hAxis: {
                title: "Dates",
                titleTextStyle: {
                  color: "red"
                }
              }
            });
            $.each(sorted.goals, function(i, item) {
              return $.each(item, function(u, row) {
                if (!sorted.average[i]) {
                  sorted.average[i] = {};
                }
                if (sorted.goals[i][u] === 0) {
                  sorted.average[i][u] = 0;
                } else {
                  sorted.average[i][u] = Number(((sorted.goals[i][u] / sorted.pageviews[i][u]) * 100).toFixed(2)) || 0;
                }
              });
            });
            formatData(sorted.average, averageData, "%");
            chart = new google.visualization.AreaChart(document.getElementById("average"));
            return chart.draw(averageData, {
              title: "Conversion rate for test: " + model.get("test").name,
              hAxis: {
                title: "Dates",
                titleTextStyle: {
                  color: "red"
                }
              }
            });
          }
        });
      }
    });
  });

}).call(this);
