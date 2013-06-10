(function() {
  var MongoStore, ab, app, cluster, express, http, i, mongoconfig, mongoose, numCPUs, path, routes, sessionKey, user;

  express = require("express");

  routes = require("./routes");

  user = require("./routes/user");

  ab = require("./routes/ab");

  http = require("http");

  path = require("path");

  mongoose = require('mongoose');

  mongoconfig = require("./utils/mongoconfig")();

  MongoStore = require('connect-mongo')(express);

  app = express();

  sessionKey = 'abtesting rules ok';

  app.configure(function() {
    app.set("port", process.env.PORT || 3010);
    app.set("views", __dirname + "/views");
    app.set("view engine", "ejs");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(sessionKey));
    app.use(express.session({
      secret: sessionKey,
      cookie: {
        maxAge: 60000 * 60 * 24 * 30 * 12
      },
      store: new MongoStore({
        db: "abtesting"
      })
    }));
    app.use(app.router);
    return app.use(express["static"](path.join(__dirname, "public")));
  });

  app.configure("development", function() {
    return app.use(express.errorHandler());
  });

  app.get("/", routes.index);

  app.get("/test/:id", ab.test);

  app.get("/goal/:id/:version/:json", ab.goal);

  app.get("/pageview/:id/:version", ab.pageview);

  app.post("/signup", user.createAccount);

  app.post("/login", user.handleLogin);

  app.get("/login/:error", user.login);

  app.get("/logout", user.logout);

  app.get("/check-login", user.checkLogin);

  app.post("/create-test", ab.createTest);

  app.get("/api/statistics/:id", ab.statistics);

  app.get("/api/statistics", ab.statisticsList);

  app.get("/api/statistics/:id/json", ab.statisticsJSON);

  cluster = require("cluster");

  numCPUs = require("os").cpus().length;

  if (cluster.isMaster) {
    i = 0;
    while (i < numCPUs) {
      cluster.fork();
      i++;
    }
    cluster.on("exit", function(worker, code, signal) {
      console.log("worker " + worker.process.pid + " died");
      return cluster.fork();
    });
  } else {
    http.createServer(app).listen(app.get("port"), function() {
      return console.log("Express server listening on port " + app.get("port"));
    });
  }

}).call(this);
