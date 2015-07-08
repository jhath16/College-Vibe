'use strict';

//Initialize Parse

Parse.initialize("iqRd6LODNgTmbMv1fMMsmSblC2qWK6LFJCkgeyF2", "NItnQMZsdy9LiQlla3OZFgiQQ1TYrBCncyhIrp52");

//Removes views from the global renderedViews array

function removeView (view) {
  var cid = view.cid;
  var index = _.findIndex(renderedViews, function (n) {return n.cid === cid});
  renderedViews.splice(index,1);
  if (view.subviews) {
    _.each(subviews, function (i) {
      i.remove();
    });
  }
};

// _.partialHelper(template,model)
// Used in *templates* to render html as a partial
// Accepts an optional model to render the model's data
//ISSUE: Does not handle events properly 

_.mixin({
  partialHelper: function (partialTemplate, model) {
    var tmp1 = $('#' + partialTemplate).text();
    return _.template(tmp1)(model);
  }
});

// Deprecated as of 7/5

function organizeByRoute() {
  organizedRenderedViews = _.groupBy(renderedViews, function (v) {return v.routeName});
};

function removeAllViews () {
  for (var i = renderedViews.length - 1; i >= 0; i--) {
    renderedViews[i].removeRenderedView();
  }
};

/* * * * * * * * * * *   Prototype Overrides   * * * * * * * * * * * * * * */

//view.removeRenderedView()
//takes the view out of the renderedViews array as well as removing it
Parse.View.prototype.removeRenderedView = _.wrap(
  Parse.View.prototype.remove,
  function (originalFunction) {
    originalFunction.apply(this);
    removeView(this);
  }
)

/* * * * * * *           VIEWS            * * * * * * * * * * * */

var IndexView = Parse.View.extend({
  initialize: function () {
    this.render();
  },

  routeName:'index',

  template: _.template($('#index-route').text()),

  render : function () {
    renderedViews.push(this);
    this.$el.html(this.template());
    $('#application').append(this.el);
    return this;
  }
});

// When instantiating a new search box,
//make sure to pass it a jquery-styled container

var SearchBoxView = Parse.View.extend({
  template: _.template($('#search-box-view').text()),

  initialize:function (container) {
    this.render(container);
    this.subViews = [];
  },

  render: function (container) {
    renderedViews.push(this);
    this.$el.html(this.template);
    $(container).append(this.el);
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

  routeName:'independent',

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

var LoginView = Parse.View.extend({
  tagName: 'div',

  routeName:'independent',

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

var ProfileView = Parse.View.extend({
  initialize:function () {
    console.log('profileView rendered');
    this.render();
  },

  routeName:'profile',

  template: _.template($('#profile-view').text()),

  render:function () {
    renderedViews.push(this);
    this.$el.html(this.template(this.model));
    $('#application').append(this.el);
    return this;
  }
});

var SchoolView = Parse.View.extend({
  initialize:function () {
    console.log('schoolView rendered');
    this.render();
  },

  routeName:'schools',

  template: _.template($('#school-view').text()),

  render:function () {
    renderedViews.push(this);
    this.$el.html(this.template(this.model));
    $('#application').append(this.el);
    return this;
  },

   pieChart: function() {
      // pie chart data
      var pieData = [
          {
              value: 20,
              color:"#878BB6"
          },
          {
              value : 40,
              color : "#4ACAB4"
          },
          {
              value : 10,
              color : "#FF8153"
          },
          {
              value : 30,
              color : "#FFEA88"
          }
      ];
      // pie chart options
      var pieOptions = {
           segmentShowStroke : false,
           animateScale : true
      }
      // get pie chart canvas
      var countries= document.getElementById("countries").getContext("2d");
      // draw pie chart
      new Chart(countries).Pie(pieData, pieOptions);
    }

});

var SchoolMapView = Parse.View.extend({
  tagName: 'li',

  template: _.template($('#map-school-view').text()),

  routeName:'independent',

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
    removeAllViews();
    var modelName = schoolname.replace(/-/g, ' ');
    console.log('schoolRoute fired with the model: ' + modelName);
    new SchoolView();
    //1.Match the schoolname in the collection
    //2.Pass the correlated model to the view and render();
    //new SchoolView({model:matchedModel});
  },

  indexRoute: function () {
    removeAllViews();
    console.log('index route function fired');
    new IndexView();
    new LoginView();
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

4.Find a way to keep Backbone.Model defaults in a Parse.Collection
Possibly query parse, then add that array as new 'College' models to the
collegeCollection to maintain the model defaults?

*/
