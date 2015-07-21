var _ = require('underscore');
var moment = require('moment');
var Image = require('parse-image');
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("searchFactual", function (request,response) {
  //hit the factual API and just return any data for now;
});
