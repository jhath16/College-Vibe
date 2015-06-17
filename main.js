'use strict';

//Initialize Parse

Parse.initialize("iqRd6LODNgTmbMv1fMMsmSblC2qWK6LFJCkgeyF2", "NItnQMZsdy9LiQlla3OZFgiQQ1TYrBCncyhIrp52");

//Takes a template from the DOM and compiles it to a given model's data.
//Then renders that compiled template to the given destination in the DOM.

function renderTemplate(template, destination, model) {
  var template = _.template(template.text());
  var compiled = template(model);
  destination.append(compiled);
};


//Takes a template and renders directly to the application container.
//Removes the previous template/HTML when changing to it.
// This will be userful for when we want to just change the route to look like
//    a different page in the application rather than internally loading some
//    dynamic content.

function renderToApplication(template, model) {
  $('#application').empty();
  renderTemplate(template, $('#application'), model);
};

//Defining the College Model and giving some defaults

var College = Backbone.Model.extend({
  initialize: function () {

  },

  defaults : {
    name:'',
    address:'',
    //more to come
  }
});


var Router = Backbone.Router.extend({
  routes: {
    '' : 'home',
    'something' : 'something'
  },

  home: function () {
    renderToApplication($('#index-route'));
    console.log('index route loaded');
  },

  something: function () {
    console.log('something route loaded');
  }
});

var router = new Router();

$(document).ready(function () {
  Backbone.history.start();
});


var CollegeCollection = Parse.Collection.extend({
  query: function () {
    return new Parse.Query('College').find();
  }
})

/*

********  To Do  **************

1. Writing out a render function that will take a template from the dom and
render it to a specified container (exactly like we did in TIY I guess). DONE

2.Map Out the Router and organize the rendering of templates accordingly ISH

3.Leave the Header and Footer and create an Application div to render
all dynamic templates to.
*Question for Taylor : Will the header and footer be present on all Routes?

4. External templates for ease in development?
-Probably not at least for the moment but still an option.



*/
