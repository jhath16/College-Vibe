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
  defaults : {
    name:'',
    address:'',
    monkeys:'none',
    //more to come
  }
});

var IndexView = Backbone.View.extend({
  initialize: function () {
    this.render();
  },

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
		$('.college-search').empty();

    //excludes the shift key and empty string queries
		if (e.keyCode != 16 && queryString != '') {
			//Define the filter callback
			function filterFunction (i) {
				return i.get('schoolname').slice(0,qLength).toLowerCase() == queryString ? true : false;
			};
			//filter through the data provided
			var matchedQuery = collegeCollection.filter(filterFunction);
			//matchedQuery now has the array of matching objects


		//append the new search options
			matchedQuery.forEach(
				function (i) {
          new SchoolDropdownView({model:i}).render();
			});
		}
  }
});

var SchoolDropdownView = Parse.View.extend({
  tagName:'div',

  template: _.template($('#school-dropdown-view').text()),

  render: function () {
    this.$el.html(this.template(this.model));
    this.el.style.padding = '5px 0'; //temporary
    this.el.style.color = 'white'; //temporary
    $('.college-search').append(this.el);
    return this;
  }
})

//This View will be used to render each of the school names next to the
//interactive map and will link them all to their respective routes

var SchoolMapView = Parse.View.extend({
  tagName: 'li',

  template: _.template($('#map-school-view').text()),

  initialize:function () {
    this.render();
  },

  render: function () {
    this.$el.html(this.template(this.model));
    $('.map-school-list ul').append(this.el);
    return this;
  }
});

var CollegeCollection = Parse.Collection.extend({
  model:College,
  query:new Parse.Query("testCollege").limit(1000),

  initialize: function () {
    console.log('collegeCollection has been created');
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '' : 'home',
    'schools/:id' : 'schoolRoute',
    'schools/*': 'schoolRoute'
  },

  schoolRoute: function (id) {
    console.log('schoolRoute fired');
    //1.Match the id in the collection
    //2.Pass the correlated model to the view and render();
    //new SchoolView({model:matchedModel}).render();
    console.log(id);
  },

  home: function () {
    console.log('index route function fired');
  },
});

//Glue Code

$(document).ready(function () {
  var router = new Router(); //instantiate the router
  Backbone.history.start(); //start watching hash changes
  window.collegeCollection = new CollegeCollection(); //Make the collection global
  collegeCollection.fetch().then(function (c) {
    c.each(function (m) {
      new SchoolMapView({model:m});
    })
  })
  var indexView = new IndexView();
});
/*

********  To Do / Questions  **************

1. Writing out a render function that will take a template from the dom and
render it to a specified container (exactly like we did in TIY I guess).

Done but not sure if it's necessary/useful. Could be altered to .remove()
views from the dom and create new ones which would call render in their
initialize methods. Would work better that way.

2.Map Out the Router and organize the rendering of views accordingly ISH

3.Leave the Header and Footer and create an Application div to render
all dynamic templates to.
*Question for Taylor : Will the header and footer be present on all Routes?

4. External templates for ease in development?
-Probably not at least for the moment but still an option.
-How would you go about working with external templates?...

5. Should we make it so that each view renders itself on instantiation?
-Router should control the rendering of routes... Just instantiate/.remove() items?
-^ This sounds like the best method of doing so.

6.Find a way to keep Backbone.Model defaults in a Parse.Collection
Possibly query parse, then add that array as new 'College' models to the
collegeCollection to maintain the model defaults?

*/
