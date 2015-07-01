'use strict';

//Initialize Parse

Parse.initialize("iqRd6LODNgTmbMv1fMMsmSblC2qWK6LFJCkgeyF2", "NItnQMZsdy9LiQlla3OZFgiQQ1TYrBCncyhIrp52");



/* * * * * * *           VIEWS            * * * * * * * * * * * */

var IndexView = Parse.View.extend({
  initialize: function () {
    this.subViews = new Array();
    this.render();
  },

  template: _.template($('#index-route').text()),

  render : function () {
    renderedViews.push(this);
    this.$el.html(this.template());
    $('#application').append(this.el);
    return this;
  },

  events: {
    'keyup input' : 'searchDropdown',
    'click .login-slideout-btn' : 'toggleSlideout'
  },

  toggleSlideout: function () {
    $('.slideout-container').toggleClass('toggle-slideout');
    $('#nav-toggle').toggleClass('active');
  },

  searchDropdown: function (e) {
    var self = this,
				queryString = e.currentTarget.value.toLowerCase(),
        qLength = queryString.length;

    //This loops through the subViews and properly calls .remove() on each
    //  instead of calling $.empty() and potentially leaking memory

    _.each(this.subViews, function (i) {
      i.remove();
    });
    this.subViews = [];

    //this entire conditional only has the overall job of appending to the dropdown
		if (queryString != '') {
      var dataArray = collegeCollection;
			//Define the filter callback

			function filterFunction (i) {
        var schoolName = i.get('schoolname');
        var abbreviation = i.get('abbreviation');

        var concatString = schoolName.concat(abbreviation).toLowerCase();
        var searchIndex = concatString.search(queryString);

        //returns true if it matched anywhere so that can be passed
        // to the matchedQuery array through the .filter() method

        return searchIndex != -1 ? true : false;
			};

			//filter through the data provided

			var matchedQuery = collegeCollection.filter(filterFunction);

			//matchedQuery now has the array of matching objects

      //Only render the first 6 (subject to change)
      //  - right now, doesn't resort the array before looping through
      //  - this means that only the first six in array are appended now
      //maybe in the future, we could add a sorting rule before rendering views

      var index = 0;
      _.each(matchedQuery, function (i) {
        index++;
        if (index < 7) {
          var newView = new SchoolDropdownView({model:i});
          self.subViews.push(newView);
        }
      });
		}
  }
});

var SchoolDropdownView = Parse.View.extend({
  tagName:'div',

  initialize: function () {
    this.render();
  },

  template: _.template($('#school-dropdown-view').text()),

  render: function () {
    renderedViews.push(this);
    this.$el.html(this.template(this.model));
    $('.college-search').append(this.el);
    return this;
  }
});

var LoginView = Parse.View.extend({
  tagName: 'div',

  className: 'slideout-container',

  initialize: function () {
    this.render();
  },

  template: _.template($('#login-view').text()),

  render: function () {
    renderedViews.push(this);
    this.$el.html(this.template());
    $('#application').append(this.el);
    return this;
  },

  events: {
    'click .register-btn' : 'swapLogin',
    'click .login-btn' : 'swapRegister'//can be refactored(maybe)
  },

  swapLogin: function () {
    $('.login-container').toggleClass('close-login');
    setTimeout(function(){
        $('.register-container').toggleClass('open-register');
     }, 250);
  },

  swapRegister : function () {
    $('.register-container').toggleClass('open-register');

    setTimeout(function(){
        $('.login-container').toggleClass('close-login');
     }, 250);
  }
});

var ProfileView = Parse.View.extend({
  initialize:function () {
    console.log('profileView rendered');
    this.render();
  },

  template: _.template($('#profile-view').text()),

  render:function () {
    renderedViews.push(this);
    this.$el.html(this.template(this.model));
    $('body').html(this.el);
  }
});

var SchoolMapView = Parse.View.extend({
  tagName: 'li',

  template: _.template($('#map-school-view').text()),

  initialize:function () {
    this.render();
  },

  render: function () {
    renderedViews.push(this);
    this.$el.html(this.template(this.model));
    $('.map-school-list ul').append(this.el);
    return this;
  }
});

/* * * * * * * * *     MODELS       * * * * * * * * * * * * * */

var College = Parse.Object.extend({
  className: 'testCollege',
});

var User = Parse.Object.extend({
  className: 'User',
})

/* * * * * * * *         COLLECTIONS        * * * * * * * * */

var CollegeCollection = Parse.Collection.extend({
  model:College,
  query:new Parse.Query("testCollege").limit(1000),

  initialize: function () {
    console.log('collegeCollection has been created and fetched');
    this.fetch();
  }
});

/* * * * * * * * * *    ROUTER     * * * * * * * * * * * * */

var Router = Backbone.Router.extend({
  routes: {
    '' : 'indexRoute',
    'schools/:schoolName' : 'schoolRoute',
    'businesses/:id' : 'businessRoute',
    'profile'/* /:username */ : 'profileRoute',

  },

  schoolRoute: function (schoolname) {
    console.log('schoolRoute fired');
    var modelName = schoolname.replace(/-/g, ' ');
    console.log(modelName);
    //1.Match the schoolname in the collection
    //2.Pass the correlated model to the view and render();
    //new SchoolView({model:matchedModel});
  },

  indexRoute: function () {
    console.log('index route function fired');
    new IndexView();
    new LoginView();
  },

  businessRoute : function (id) {
    console.log('business route fired with id: ' + id);
    //we may have to do businesses by :id instead of name in url
    //not all business names may be unique(chains, hotels, etc...)
  },

  profileRoute: function (username) {
    console.log("Profile Route Fired");
    var profileView = new ProfileView();
  }
});

//Glue Code

$(document).ready(function () {
  window.renderedViews = [];
  var router = new Router(); //instantiate the router
  Backbone.history.start(); //start watching hash changes
  window.collegeCollection = new CollegeCollection(); //Make the collection global
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
