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

var IndexView = Backbone.View.extend({
  template: _.template($('#index-route').text()),

  render : function () {
    this.$el.html(this.template());
    $('#application').append(this.el);
    return this;
  },

  events: {
    'keyup input' : 'searchDropdown'
  },

  searchDropdown: function (e) {
    var self = this,
				queryString = e.currentTarget.value.toLowerCase(),
        qLength = queryString.length;

    console.log(queryString);
		if (e.keyCode != 16) { //excludes the shift key, might not be necessary
      var dataArray = this.model;
			//Define the filter callback
			function filterFunction (i) {
				return i.get('Name').slice(0,qLength).toLowerCase() == queryString ? true : false;
			};
			//filter through the data provided
			var matchedQuery = dataArray.filter(filterFunction);
			//matchedQuery now has the array of matching objects

			//clear the search options
			$('.college-search').empty();

			//only run this is the input isn't empty so we avoid matching all the data
			if (qLength != '') {

			//append the new search options
				matchedQuery.forEach(
					//will be changed to a simple class instead of applying style w/ jQuery
					function (i) {
						var newDiv = document.createElement('div');
						newDiv.style.color = 'white';
						newDiv.style.padding = '5px 0';
						newDiv.textContent = i.get('Name');
						$('.college-search').append(newDiv);
				});
			}
		}
  }
});

var CollegeCollection = Parse.Collection  //Does Parse have a collection?

var Router = Backbone.Router.extend({
  routes: {
    '' : 'home',
  },

  home: function () {
    console.log('index route function fired');
  },
});

var router = new Router();

$(document).ready(function () {
  Backbone.history.start();

  var query = new Parse.Query("College");
  query.find().then(function (e){
    var indexView = new IndexView({model:e});
    indexView.render();
  })
});
/*

********  To Do  **************

1. Writing out a render function that will take a template from the dom and
render it to a specified container (exactly like we did in TIY I guess).

2.Map Out the Router and organize the rendering of templates accordingly ISH

3.Leave the Header and Footer and create an Application div to render
all dynamic templates to.
*Question for Taylor : Will the header and footer be present on all Routes?

4. External templates for ease in development?
-Probably not at least for the moment but still an option.
-How would you go about working with external templates?...

5. Should we make it so that each view renders itself on instantiation?
-Router should control the rendering of routes... Just instantiate/.remove() items?
-^ This sounds like the best method of doing so.



*/
