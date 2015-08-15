// 'use strict';

//Initialize Parse

Parse.initialize("iqRd6LODNgTmbMv1fMMsmSblC2qWK6LFJCkgeyF2", "NItnQMZsdy9LiQlla3OZFgiQQ1TYrBCncyhIrp52");

//Establish the namespacing
(function () {
  window.CollegeVibe = {};
  CollegeVibe.Models = {};
  CollegeVibe.Views = {};
  CollegeVibe.Collections = {};
  CollegeVibe.Partials = {};
  CollegeVibe.Router = {}; //global functions
})();

function d3Stuff() {

  var wrapper = $(".wrapper"),
        opening = $("#opening"),
        brand_logo = $(".brand"),
        down_arrow_map = $("#down_arrow_map"),
        map_contain = $("#map-contain"),
        map_search = $(".map-search"),
        map_zoom = "",
        map_wrapper = $("#map-wrapper"),
        description = $("#info-bar"),
        searchPosition = $("#search").offset(),
        mapWrapperPosition = map_wrapper.offset(),
          descPosition = description.offset(),
          pageWidth = window.innerWidth;

  var width = 960,
      height = 640.4,
      positions = [],
      centered;

  var c = "";
  var bodyNode = d3.select('#Map').node();
  var bubble = $("#bubble");
  var list = $('.school-list').each(function(i){});
  var svg = d3.select("#Map");
  var contain = d3.select("#map-contain");
  var states = d3.selectAll("polygon")
           .on("click", stateZoom);
  var paths = d3.selectAll("path")
          .on("click", stateZoom);
  var circles = svg.append("svg:g")
            .attr("id", "circles");

  var g = d3.selectAll("g");

  var query = new Parse.Query('Colleges').limit(1000);
  query.select(["schoolname", "slug","mapLat", "mapLon"]);
  query.find().then(function (schools) {
      //append the circles! \(O.O)/
      circles.selectAll("circles")
        .data(schools)
        .enter().append("svg:a")
        .attr("xlink:href", function(d) { return '#schools/' + d.attributes.slug; })
        .append("svg:circle")
        .attr("school", function(d, i) { return d.attributes.schoolname; })
        .attr("cx", function(d,i) { return d.attributes.mapLon; })
        .attr("cy", function(d,i) { return d.attributes.mapLat; })
        .attr("r", 4)
        .attr("class", "icon")
        .on("mouseover", function(d){
            // console.log(d);  ****This is all the data - ie: Name, lat, long, index, state, etc..
            // return mapSearch(d.id);
        }).on("mouseout", function(){
            // return hide_bubble();
        })
        console.log(circles);
        _.each(circles[0][0], function (circle) {
          console.log(circle.cx);
        })

  var	mapSearch = function(id) {
      var school_data = '';
        c = d3.selectAll("circle")
              .filter(function(d) {
              if (d.id == id) {
                school_data = d;
                return school_data;
               }
              });
      if (school_data) {
        var pNode = c.node().parentNode;
        pNode.setAttribute("class", "hover");
        // get location on page of school on map
        var bcr = c.node().getBoundingClientRect();

        var bubbleTop = "",
          bubbleLeft = "";

          if (!zoomed) {
            bubbleTop = bcr.top - 70 + 'px',
            bubbleLeft = bcr.left - 69 + 'px';
          } else {
            bubbleTop = bcr.top - 70 + 'px',
            bubbleLeft = bcr.left - 52 + 'px';
          }

            bubble.css({
                        "left": bubbleLeft,
                        "top": bubbleTop
                    });

        bubble.html("<h1>" + school_data.name + "</h1>" + "<p>" + school_data.city + ", " + school_data.state + "</p>")
            .attr("class", function(d) { return school_data.letter; });
        bubble.addClass("active");
      }
    }

    var	hide_bubble = function() {
        c = d3.selectAll("circle");
        c.each(function(e) {
          $(this).parent().attr("class", "");
        })
        bubble.removeClass("active");
      }
  })

    // SVG Functions outside of CSV
    var zoomed = false;
    var positionX = 0;
    var positionY = 0;

    function stateZoom(d) {
      var absoluteMousePos = d3.mouse(bodyNode);

      if (zoomed) {
        // Zoom out of state
        zoomed = false;

        // revert cursor style to +
        states.attr("style", "");
        paths.attr("style", "");

        if (map_zoom == "laptop"){
          g.transition()
            .duration(750)
            .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + 0.9 + ")translate(" + 0 + "," + 0 +")");
        } else {
          g.transition()
               .duration(750)
               .attr("transform", "translate(" + 0 + "," + 0 + ")scale(" + 1 + ")translate(0,0)");
        }
      } else {
        // Zoom in to the state
        zoomed = true;

        // change cursor style to -
        states.attr("style", "cursor: -webkit-zoom-out; cursor: -moz-zoom-out");
        paths.attr("style", "cursor: -webkit-zoom-out; cursor: -moz-zoom-out");

        var newWidth = width / 5;
        var newHeight = height / 5;
        positionX = newWidth - absoluteMousePos[0] - 120;
        positionY = newHeight - absoluteMousePos[1] - 85;

        if (map_zoom != "ipad") {
          g.transition()
                 .duration(750)
                 .attr("transform", "translate(" + newWidth + "," + newHeight + ")scale(" + 4 + ")translate(" + positionX + "," + positionY +")");
        }
      }
    }

    function mapZoom() {
      var g = d3.selectAll("g");

      if (map_zoom == "laptop") {

        var newWidth = width / 5;
        var newHeight = height / 5;

        g.transition()
               .duration(0)
               .attr("transform", "translate(" + newWidth + "," + newHeight + ")scale(" + 0.9 + ")translate(" + -192 + "," + -128 +")");

      } else if (map_zoom == "ipad") {
        var newWidth = width / 5;
        var newHeight = height / 5;

        g.transition()
               .duration(0)
               .attr("transform", "translate(" + newWidth + "," + newHeight + ")scale(" + 0.8 + ")translate(" + -250 + "," + -100 +")");
      } else if (map_zoom == "mobile") {

        var newWidth = width / 5;
        var newHeight = height / 5;

        g.transition()
               .duration(0)
               .attr("transform", "translate(" + newWidth + "," + newHeight + ")scale(" + 0.37 + ")translate(" + -520 + "," + -200 +")");
      }
    }
// --- End SVG ---


/* Map Hover */

var swapMap = function(image) {
  var path = temp + '/map/images/';
  $('#College-Vibe-Map').attr('src', path+image);
}
  // Map hover for scrolling list
  $('.school-list').each( function() {
    var schoolName = $(this).text().replace(/[ ]/g,'_');
    $(this).hover(
      function() {
        swapMap('map_'+schoolName+'.png');
      }, function() {
        swapMap('map.png');
      }
    );
  });

  var map = $("#map");
  $(map).find('area').each( function() {
    var altVal = $(this).attr('alt').replace(/[ ]/g,'_');
    var href = $(this).attr('href');
      $(this).hover(
      function() {
        swapMap('map_'+altVal+'.png');
      }, function() {
        swapMap('map.png');
         }
      );
      $(this).on( 'click', function() {
        if (href)
        {
          $(this).unbind('hover');
          window.location = href;
        }
        return false;
      });
  });
  console.log("I ran!");
}

//Removes a view from the global renderedViews array
//Also removes all subviews

function removeViewFromRenderedViews (view) {
  var cid = view.cid;
  var index = _.findIndex(renderedViews, function (n) {return n.cid === cid});
  renderedViews.splice(index,1); //remove from the array
  if (view.subviews) {
    _.each(view.subviews, function (i) { //remove the subviews
      i.remove();
    });
    view.subviews = [];
  }
  if (view.partial) {
    view.partial.removeRenderedView(); //remove the partial(s);
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
    this.currentTemplate = _.template($('#statistics-view').text()); //initial template
    this.render(); //needs to be before isRenderedToPage
    this.hotelInformation = null;
    this.currentView = null;

    $(function(){
      $("#slides").slidesjs({
        // width: 320,
        // height: 420,

            play: {
              active: true,
                // [boolean] Generate the play and stop buttons.
                // You cannot use your own buttons. Sorry.
              effect: "fade",
                // [string] Can be either "slide" or "fade".
              interval: 10000,
                // [number] Time spent on each slide in milliseconds.
              auto: true,
                // [boolean] Start playing the slideshow on load.
              swap: true,
                // [boolean] show/hide stop and play buttons
              pauseOnHover: true,
                // [boolean] pause a playing slideshow on hover
              restartDelay: 10000,
                // [number] restart delay on inactive slideshow

              crossfade: true,
          // [boolean] Cross-fade the transition.
            },

            navigation: {
              active: true,
                // [boolean] Generates next and previous buttons.
                // You can set to false and use your own buttons.
                // User defined buttons must have the following:
                // previous button: class="slidesjs-previous slidesjs-navigation"
                // next button: class="slidesjs-next slidesjs-navigation"
              effect: "slide"
                // [string] Can be either "slide" or "fade".
            },

            pagination: {
              active: true,
                // [boolean] Create pagination items.
                // You cannot use your own pagination. Sorry.
              effect: "slide"
                // [string] Can be either "slide" or "fade".
            },

            effect: {
              slide: {
                // Slide effect settings.
                speed: 1000
                  // [number] Speed in milliseconds of the slide animation.
              },
              fade: {
                speed: 1000,
                  // [number] Speed in milliseconds of the fade animation.
                crossfade: true
                  // [boolean] Cross-fade the transition.
              }
            }

      });
    });
  },

  events: {
    'click .school-options li': 'tabSwitch',
    'click .first-ten' : 'firstTen',
    'click .second-ten' : 'secondTen'
  },

  tabSwitch: function (e) {
    this.currentTemplate = _.template($('#' + e.currentTarget.id + '-view').text());
    this.update();
  },

  appendHotelInfo: function (min, max) {
    var displayString = "Displaying results " + min + "-" + max;
    console.log(displayString);
    var hotelList = $('.school-hotel ul')[0];
    var hotelTemplate = _.template($('#hotel-template').text());
    var self = this;

    $(hotelList).empty();
    $(hotelList).append('<div><h1 style="font-size:20px;">' + displayString + '</h1></div>');
    for (var i = min; i < max; i++) {
      var hotel = self.hotelInformation[i - 1];
      $(hotelList).append(hotelTemplate(hotel));
    }
  },

  firstTen: function () {
    this.appendHotelInfo(1,10);
    $('.second-ten').removeClass('active');
    $('.first-ten').addClass('active');
  },

  secondTen: function () {
    $('.first-ten').removeClass('active');
    $('.second-ten').addClass('active');
    this.appendHotelInfo(11,20);
  },

  render: function () {
    this.$el.html(this.currentTemplate(this.model)); //render the html with the new template to this.$el
    renderedViews.push(this); //put it in the renderedViews array
    $('#application').append(this.el); //and put it on the page
    this.partial = new CollegeVibe.Partials.SearchDropdown(); //instantiate the new partial
    return this;
  },

  update: function () {
    /*basically separate the functionality between render and update
      render will render it onto the page
      update will just be called on a tab switch */
    var self = this;
    this.$el.html(this.currentTemplate(this.model));

    //The statistics tab
    if(this.currentTemplate = _.template($('#statistics-view').text())) {
      $(function(){
        $("#slides").slidesjs({
          // width: 320,
          // height: 420,
          play: {
            active: true,
              // [boolean] Generate the play and stop buttons.
              // You cannot use your own buttons. Sorry.
            effect: "fade",
              // [string] Can be either "slide" or "fade".
            interval: 5000,
              // [number] Time spent on each slide in milliseconds.
            auto: true,
              // [boolean] Start playing the slideshow on load.
            swap: true,
              // [boolean] show/hide stop and play buttons
            pauseOnHover: true,
              // [boolean] pause a playing slideshow on hover
            restartDelay: 2500
              // [number] restart delay on inactive slideshow
          },
        });
      });
    }
    this.partial.remove();//re-instantiate the partial
    this.partial = new CollegeVibe.Partials.SearchDropdown();

    //The hotel tab
    if(this.currentTemplate = _.template($('#hotel-view').text())) {

      if(!this.hotelInformation) { //if we don't have the info yet

        Parse.Cloud.run('findNearHotels', {latitude:this.model.get('latitude'), longitude:this.model.get('longitude')})
        .then(function (e) {
          self.hotelInformation = e;
          console.log(e);
          self.firstTen();
        });
      } else { //if we already have the hotel info for the client
        self.firstTen();
      }
    }
  },

  remove: _.wrap(Parse.View.prototype.removeRenderedView,
    function (originalFunction) {
      originalFunction.apply(this);
      this.partial.remove();
      this.isRenderedToPage = false;
    })
});

CollegeVibe.Views.Hotels = Parse.View.extend({
  initialize: function () {
    this.render();
  },

  template: _.template($("#hotel-view").text()),

  render: function () {
    this.$el.html(this.template(this.model));
    $('#application').append(this.el);
  }
})
/* * * * * * * *      PARTIALS      * * * * * * * * * * * * * * */

CollegeVibe.Partials.SearchDropdown = Parse.View.extend({
  el: '.search-box-partial',

  template: _.template($('#search-box-view').text()),

  initialize:function () {
    this.render();
    this.subViews = [];
  },

  render: function () {
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

  query: new Parse.Query("Colleges")
        .select('schoolname')
        .select('abbreviation')
        .limit(1000), //only bring the list of schoolnames back

  initialize: function () {
    console.log('Colleges Collection has been created and fetched');
    this.fetch(this.query);
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
    d3Stuff();
  },

  schoolRoute: function (schoolname) {
    removeAllViews();
    console.log('schoolRoute fired with the model: ' + schoolname);
    /* This will take the modelName and query parse for the first object
       that matches its slug name. Doesn't depend on the global collection of
       collegeCollection to be fetched beforehand */
    var query = new Parse.Query("Colleges").equalTo("slug",schoolname);
    query.first().then(function (e) {
      new CollegeVibe.Views.School({model:e});
    });
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
  window.collegeCollection = new CollegeVibe.Collections.Colleges(); //Make the collection global
  CollegeVibe.Router = new Router(); //instantiate the router
  Backbone.history.start(); //start watching hash changes
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
*/

//This is the code taken directly from the script.js on the main page
//Should hold all the functionality for the map

// --- Start SVG ---
