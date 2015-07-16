'use strict';

//Initialize Parse

Parse.initialize("iqRd6LODNgTmbMv1fMMsmSblC2qWK6LFJCkgeyF2", "NItnQMZsdy9LiQlla3OZFgiQQ1TYrBCncyhIrp52");

//Establish the namespacing
(function () {
  window.CollegeVibe = {};
  CollegeVibe.Models = {};
  CollegeVibe.Views = {};
  CollegeVibe.Collections = {};
  CollegeVibe.Partials = {};
  CollegeVibe.Helpers = {}; //global functions
})();

//Removes a view from the global renderedViews array
//Also removes all subviews

function removeViewFromRenderedViews (view) {
  var cid = view.cid;
  var index = _.findIndex(renderedViews, function (n) {return n.cid === cid});
  renderedViews.splice(index,1);
  if (view.subviews) {
    _.each(subviews, function (i) {
      i.remove();
    });
    view.subviews = [];
  }
};

// Goes through all of the views in renderedViews and
// *removes them in reverse order (to avoid collapsing array errors)

function removeAllViews () {
  for (var i = renderedViews.length - 1; i >= 0; i--) {
    renderedViews[i].removeRenderedView();
  }
};

//view.removeRenderedView()
//takes the view out of the renderedViews array as well as removing it

Parse.View.prototype.removeRenderedView = _.wrap(
  Parse.View.prototype.remove,
  function (originalFunction) {
    originalFunction.apply(this);
    removeViewFromRenderedViews(this);
  }
)

/* * * * * * *           VIEWS            * * * * * * * * * * * */

CollegeVibe.Views.Index = Parse.View.extend({
  initialize: function () {
    this.render();
  },

  template: _.template($('#index-route').text()),

  render : function () {
    renderedViews.push(this);
    this.$el.html(this.template());
    $('#application').append(this.el);
    return this;
  }
});

CollegeVibe.Views.SchoolDropdown = Parse.View.extend({
  tagName:'div',

  initialize: function () {
    this.render();
  },

  template: _.template($('#school-dropdown-view').text()),

  render: function () {
    this.$el.html(this.template(this.model));
    $('.college-search').append(this.el);
    return this;
  }
});

CollegeVibe.Views.Login = Parse.View.extend({
  tagName: 'div',

  className: 'slideout-container',

  initialize: function () {
    this.render();
    //conditional rendering of the view will go in the template. Easy
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
    'click .login-btn' : 'swapRegister', //can be refactored(maybe)
    'click .login-container button' : 'login', //will need to work on 'enter' too
    'click .register-container button' : 'register',
  },

  swapLogin: function () {
    $('.login-container').toggleClass('close-login');
    setTimeout(function(){
        $('.register-container').toggleClass('open-register');
     }, 250);
  },

  swapRegister: function () {
    $('.register-container').toggleClass('open-register');

    setTimeout(function(){
        $('.login-container').toggleClass('close-login');
     }, 250);
  },

  login: function () {
    var email = $('.login-container input')[0].value;
    var password = $('.login-container input')[1].value;
    Parse.User.logIn(email, password, {
      success: function (data) {
        //Successfully logged in! Go do things
      },
      error: function (user, error) {
        alert(error.message);
      }
    });
  },

  register: function () {
    var name = $('.register-container input')[0].value;
    var email = $('.register-container input')[1].value;
    var password = $('.register-container input')[2].value;
    var confirmPassword = $('.register-container input')[3].value;

    if (password === confirmPassword) {
      Parse.User.signUp(email, password, {email: email, name: name},
      {
        success: function (data) {
          //successfully registered new user, now go about the app.
        },
        error: function (user, error) {
          alert(error.message);
        }
      })
    } else {
      alert('The two passwords do not match');
    }
  }
});

CollegeVibe.Views.Profile = Parse.View.extend({
  initialize:function () {
    console.log('Profile View rendered');
    this.render();
  },

  template: _.template($('#profile-view').text()),

  render:function () {
    renderedViews.push(this);
    this.$el.html(this.template(this.model));
    $('#application').append(this.el);
    return this;
  }
});

CollegeVibe.Views.SchoolMap = Parse.View.extend({
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

CollegeVibe.Views.School = Parse.View.extend({
  initialize: function () {
    this.currentTemplate = _.template($('#food-view').text()); //initial template
    this.render(); //needs to be before isActive               v
    this.isRenderedToPage = true; //needs to be after render() ^
  },

  events: {
    'click .school-options li': 'tabSwitch'
  },

  tabSwitch: function (e) {
    this.currentTemplate = _.template($('#' + e.currentTarget.id + '-view').text());
    this.render();
  },

  render: function () {
    if (this.partial) {
      this.partial.removeRenderedView(); //if there's a partial, remove it
    }
    this.$el.html(this.currentTemplate()); //render the html with the new template
    if (!this.isRenderedToPage) {
      renderedViews.push(this);
      $('#application').append(this.el);
    }
    console.log(renderedViews);
    this.partial = new CollegeVibe.Partials.SearchDropdown(); //instantiate the new partial
    return this;
  },

  remove: _.wrap(Parse.View.prototype.removeRenderedView,
    function (originalFunction) {
      originalFunction.apply(this);
      this.isRenderedToPage = false;
    })
});
/* * * * * * * *      PARTIALS      * * * * * * * * * * * * * * */

CollegeVibe.Partials.SearchDropdown = Parse.View.extend({
  el: '.search-box-partial',

  template: _.template($('#search-box-view').text()),

  initialize:function () {
    this.render();
    this.subViews = [];
  },

  render: function () {
    renderedViews.push(this);
    this.$el.html(this.template);
    return this;
  },

  events: {
    'keyup input' : 'searchDropdown',
    'click #nav-toggle' : 'toggleSlideout'
  },

  toggleSlideout: function () {
    $('.slideout-container').toggleClass('toggle-slideout');
    $('#nav-toggle').toggleClass('active');
  },

  clearDropdown: function () {
    _.each(this.subViews, function (i) {
      i.remove();
    });
    this.subViews = [];
  },

  searchDropdown: function (e) {
    var self = this,
				queryString = e.currentTarget.value.toLowerCase(),
        qLength = queryString.length;

    this.clearDropdown();

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
        if (index < 5) {
          var newView = new CollegeVibe.Views.SchoolDropdown({model:i});
          self.subViews.push(newView);
        }
      });
		}
  }
});


/* * * * * * * * *     MODELS       * * * * * * * * * * * * * */

CollegeVibe.Models.College = Parse.Object.extend({
  className: 'testCollege',
});

CollegeVibe.Models.User = Parse.Object.extend({
  className: 'User',
})

/* * * * * * * *         COLLECTIONS        * * * * * * * * */

CollegeVibe.Collections.Colleges = Parse.Collection.extend({
  model:CollegeVibe.Models.College,

  query:new Parse.Query("testCollege").limit(1000),

  initialize: function () {
    console.log('Colleges Collection has been created and fetched');
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

  indexRoute: function () {
    removeAllViews();
    console.log('index route function fired');
    new CollegeVibe.Views.Index();
    new CollegeVibe.Partials.SearchDropdown();
    new CollegeVibe.Views.Login();
  },

  schoolRoute: function (schoolname) {
    removeAllViews();
    var modelName = schoolname.replace(/-/g, ' ');
    console.log('schoolRoute fired with the model: ' + modelName);
    // new CollegeVibe.Views.School();
    new CollegeVibe.Views.School();
    //1.Match the schoolname in the collection
    //2.Pass the correlated model to the view and render();
    //new CollegeVibe.Views.School({model:matchedModel});
  },

  businessRoute : function (id) {
    removeAllViews();
    var model = id.replace(/-/g, ' ')
    console.log('business route fired with id: ' + model);
    //we may have to do businesses by :id instead of name in url
    //not all business names may be unique(chains, hotels, etc...)
  },

  profileRoute: function (username) {
    removeAllViews();
    console.log("Profile Route Fired");
    new CollegeVibe.Views.Profile();
  }
});

//Glue Code

$(document).ready(function () {
  window.renderedViews = [];
  var router = new Router(); //instantiate the router
  Backbone.history.start(); //start watching hash changes
  window.collegeCollection = new CollegeVibe.Collections.Colleges(); //Make the collection global
});
/*

********  To Do / Questions  **************

1.Map Out the Router and organize the rendering of views accordingly

  -the new renderedViews array will hold and organize the rendered views.
  -the router will handle removing and determining what views get rendered/removed
    -(subviews are still handled by the parent views)

2.Leave the Header and Footer and create an Application div to render
all dynamic templates to.

- Done but will the header/footer be available on all routes?

3. External templates for ease in development?
-Probably not at least for the moment but still an option.
-How would you go about working with external templates?...

4.Find a way to keep Backbone.Model defaults in a Parse.Collection for missing data
Possibly query parse, then add that array as new 'College' models to the
collegeCollection to maintain the model defaults?

5. NAMESPACING
- Don't leave anything in the global scope
*/
