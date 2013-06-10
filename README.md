Yay for A/B -testing


To run, make sure mongodb is running.
```
npm install
forever start -w app.js
```

Add this tag to your html
```
<script src="ab.js"></script>
```

The code also supports amd loading
```
define(["ab"], function(ab) {
  var id = "51ae6d8f7686107ab9000002";
  var elementId = "test";
  new window.ab(id, elementId).test();
});

```


Testing is quite easy, just create a test, copy the id and add the code where you want it.
```
var id = "51ae6d8f7686107ab9000002";
var elementId = "test";
new window.ab(id, elementId).test();
```

Getting a goal is also simple, just change the test() method to goal()
```
var id = "51ae6d8f7686107ab9000002";
var elementId = "test";
new window.ab(id, elementId).goal();
```

Goals also support calbacks
```
var id = "51ae6d8f7686107ab9000002";
var elementId = "test";
new window.ab(id, elementId).goal(function() {
  window.location.href = "http://www.google.com/"
});
```

