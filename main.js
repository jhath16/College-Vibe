// 'use strict'; why use this?

//Initialize Parse

Parse.initialize("iqRd6LODNgTmbMv1fMMsmSblC2qWK6LFJCkgeyF2", "NItnQMZsdy9LiQlla3OZFgiQQ1TYrBCncyhIrp52");

function getNumbers (phoneNumber) {
  var numbers = [];
  for (var i = 0; i < 14; i++) {
    if (!isNaN(Number(phoneNumber.charAt(i)))) {
      numbers.push(phoneNumber.charAt(i));
    }
  }
  return numbers.join('').replace(' ', '');
}

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
}

//Removes a view from the global renderedViews array
//Also removes all subviews

function removeViewFromRenderedViews (view) {
  var cid = view.cid;
  var index = _.findIndex(renderedViews, function (n) {return n.cid === cid});
  renderedViews.splice(index,1); //remove from the array
  if (view.subViews) {
    _.each(view.subViews, function (i) { //remove the subViews
      i.remove();
    });
    view.subViews = [];
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
  tagName:'a',

  initialize: function () {
    this.render();
  },

  template: _.template("<span class=“fa fa-angle-right”></span><h1><%=attributes.schoolname%></h1>"),

  render: function () {
    this.$el.html(this.template(this.model));
    this.el.href = '#schools/' + this.model.get('slug');
    // $(this).attr('href', '#' + this.model.get('slug')); //why can't I use attributes: {'href', '#' + this.model.get('slug')}?
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
  template: _.template($('#school-view').text()),

  initialize: function () {
    this.render();
    this.hotelInformation = null;
    this.restaurantInformation = null;
    this.sportsInformation = null;
    this.instagramInformation = null;
    this.subView = null;
    this.statisticsTab();
  },

  render: function () {
    this.$el.html(this.template(this.model)); //render the html with the new template to this.$el
    renderedViews.push(this); //put it in the renderedViews array
    $('#application').append(this.el); //and put it on the page
    this.partial = new CollegeVibe.Partials.SearchDropdown(); //instantiate the new partial
    return this;
  },

  events: {
    'click .school-options1 li' : 'clearSubviews',
    'click #statistics' : 'statisticsTab',
    'click #food' : 'restaurantsTab',
    'click #hotel' : 'hotelsTab',
    'click #sports' : 'sportsTab',
    'click #gallery' : 'galleryTab'
  },

  clearSubviews: function (e) {
    this.subView.remove();
    var tabName = e.target.innerText;
    $('.header-breadcrumbs p')[1].innerText = tabName;
  },

  //Pass the (this.)options of this school view so the school view can act as a controller
  //for the subviews/modules being appended to it. It will store
  //all of the data collected so we don't send out unnecessary requests by checking
  //to see if we have information stored already.
  //this.options gives access to the this.hotelInformation, etc...

  statisticsTab: function () {
    this.subView = new CollegeVibe.Views.Statistics(this.options);
  },

  restaurantsTab: function () {
    this.subView = new CollegeVibe.Views.Restaurants(this.options);
  },

  hotelsTab: function () {
    this.subView = new CollegeVibe.Views.Hotels(this.options);
  },

  sportsTab: function () {
    this.subView = new CollegeVibe.Views.Sports(this.options);
  },

  galleryTab: function () {
    this.subView = new CollegeVibe.Views.Gallery(this.options);
  },

  remove: _.wrap(Parse.View.prototype.removeRenderedView,
    function (originalFunction) {
      originalFunction.apply(this);
      this.partial.remove();
    })
});

CollegeVibe.Views.Hotels = Parse.View.extend({
  initialize: function (schoolView) {
    var self = this;
    this.render();
    this.schoolView = schoolView; //grab a reference to the parent

    if(!this.schoolView.hotelInformation) { //if we don't have the info yet

      Parse.Cloud.run('findNearHotels', {latitude:this.schoolView.model.get('latitude'), longitude:this.schoolView.model.get('longitude')})
      .then(function (e) {
        self.schoolView.hotelInformation = e; //give the info back to the parent
        console.log(e);
        self.addPageNumbers();
        self.appendPage(1);
      });
    } else { //if we already have the hotel info for the client
      self.addPageNumbers();
      self.appendPage(1);
    }
  },

  template: _.template($("#hotel-view").text()),

  render: function () {
    this.$el.html(this.template(this.model));
    $('.school-body').append(this.el);
  },

  events: {
    'click .page-number' : 'pageSwitch',
  },

  pageSwitch:function (e) {
    var target = e.target;
    var pageNumber = target.innerText;
    $('.page-number').removeClass('active');
    $(target).addClass('active');
    var hotelList = $('.school-hotel ul')[0];
    $(hotelList).empty();
    this.appendPage(pageNumber);
  },

  appendPage: function (page) {
    var data = this.schoolView.hotelInformation;
    var defaultMax = page * 10;
    var min = defaultMax - 9;
    var realMax = defaultMax - data.length <= 0 ? defaultMax : data.length;
    var hotelList = $('.school-hotel ul')[0];
    var hotelTemplate = _.template($('#hotel-template').text());


    var displayString = "Displaying results " + min + "-" + realMax;
    $(hotelList).append('<div><h1>' + displayString + '</h1></div>');
    var restaurantTemplate = _.template($('#food-template').text());

    for (var i = min-1; i < realMax; i++) {
      var hotel = data[i];
      $(hotelList).append(hotelTemplate(hotel));
    }
  },

  addPageNumbers: function () {
    var results = this.schoolView.hotelInformation;
    var amountOfPages = Math.ceil(results.length/10);
    var pageNumberContainer = $(".view-all");
    $(pageNumberContainer).empty();
    for (var i = 1; i <= amountOfPages; i++) {
      $(pageNumberContainer).append("<a class='page-number'>" + (i) +"</a>")
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
});

CollegeVibe.Views.Restaurants = Parse.View.extend({
  initialize: function (schoolView) {
    var self = this;
    this.render();
    this.schoolView = schoolView; //grab a reference to the parent
    this.categoryResults = null;
    this.categorySearchIsActive = false;
    this.categoryKeyword = null;

    if(!this.schoolView.restaurantInformation) { //if we don't have the info yet

      Parse.Cloud.run('findNearRestaurants', {latitude:this.schoolView.model.get('latitude'), longitude:this.schoolView.model.get('longitude')})
      .then(function (e) {
        self.schoolView.restaurantInformation = e; //give the info back to the parent
        console.log(e);
        self.addPageNumbers();
        self.appendPage(1);
      });
    } else { //if we already have the hotel info for the client
      self.addPageNumbers();
      self.appendPage(1);
    }
  },

  template: _.template($("#food-view").text()),

  render: function () {
    this.$el.html(this.template(this.model));
    $('.school-body').append(this.el);
  },

  events: {
    'click .page-number' : 'pageSwitch',
    'keypress input' : 'keypressCategorySearch',
    'click .clear-filter' : 'clearFilter',
    'click button' : 'categorySearch'
  },

  clearFilter: function (e) {
    this.categorySearchIsActive = false;
    $(e.currentTarget).addClass('hidden');
    $('#category-searchbox').val('');
    var foodList = $('.school-food ul')[0];
    $(foodList).empty();
    var moduleHeader = $('.module-header p')[0];
    $(moduleHeader).html("Restaurants near " + this.schoolView.model.get('schoolname'));
    this.appendPage(1);
    this.addPageNumbers();
  },

  addPageNumbers: function () {
    var results;
    if (this.categorySearchIsActive == false) {
      results = this.schoolView.restaurantInformation;
    } else {
      results = this.categoryResults;
    }
    var amountOfPages = Math.ceil(results.length/10);
    var pageNumberContainer = $(".view-all");
    $(pageNumberContainer).empty();
    for (var i = 1; i <= amountOfPages; i++) {
      $(pageNumberContainer).append("<a class='page-number'>" + (i) +"</a>")
    }
  },

  keypressCategorySearch: function (e) {
    if (e.which == 13 && e.target.value) {
      this.categorySearch();
    }
  },

  categorySearch: function (e) {
    var self = this;
    this.categorySearchIsActive = true;
    var foodList = $('.school-food ul')[0];
    $(foodList).empty();
    $('.clear-filter').removeClass('hidden'); //show the x in the search box
    var pageNumberContainer = $(".view-all");
    $(pageNumberContainer).empty();
    $(foodList).append("<i style='font-size:20px;' class=fa fa-spin fa-spinner></i>");
    // ^^ This gets appended properly but never appears on page (CSS?) ^^

    var moduleHeader = $('.module-header p')[0];
    var schoolName = this.schoolView.model.get('schoolname');

    var category = $('#category-searchbox').val().toLowerCase(); //unsure if lowerCasing is necessary
    var categoryString = "<strong style='font-size:14px; text-transform:Capitalize'>" + category + "</strong> near " + schoolName;
    $(moduleHeader).html(categoryString);

    var latitude = this.schoolView.model.get('latitude'); //should make this accessible throughout the whole view (this.latitude = this.schoolView.model.get('latitude'))
    var longitude = this.schoolView.model.get('longitude'); //should make this accessible throughout the whole view (this.latitude = this.schoolView.model.get('longitude'))
    Parse.Cloud.run('restaurantCategorySearch', {latitude:latitude, longitude:longitude,category:category})
    .then(function (e) {
      $(foodList).empty();
      console.log(e);
      self.categoryResults = e; //store the information in this view
      var results = e; //for easier reference here

      if (results.length == 0) { //if the search doesn't bring anything back
        $(foodList).append("<div class='no-results'>No results found</div>");
        self.categorySearchIsActive = false;
      } else {
        self.addPageNumbers(); //Put the numbers at the bottom
        self.appendPage(1); // Put the first page of information in there.
      }
    });
  },

  pageSwitch: function (e) {
    var target = e.target;
    var pageNumber = target.innerText;
    $('.page-number').removeClass('active');
    $(target).addClass('active');
    var foodList = $('.school-food ul')[0];
    $(foodList).empty();
    this.appendPage(pageNumber);
  },

  appendPage: function (page) {
    var data;
    var categoryKeyword = this.categoryKeyword;
    if (this.categorySearchIsActive == false) {
      data = this.schoolView.restaurantInformation;
    } else {
      data = this.categoryResults;
    }
    var defaultMax = page * 10;
    var min = defaultMax - 9;
    var realMax = defaultMax - data.length <= 0 ? defaultMax : data.length;
    var foodList = $('.school-food ul')[0];


    var displayString = "Displaying results " + min + "-" + realMax;
    $(foodList).append('<div><h1>' + displayString + '</h1></div>');
    var restaurantTemplate = _.template($('#food-template').text());

    for (var i = min-1; i < realMax; i++) {
      var restaurant = data[i];
      $(foodList).append(restaurantTemplate(restaurant));
    }
  }
});

CollegeVibe.Views.Statistics = Parse.View.extend({
  template: _.template($('#statistics-view').text()),

  initialize: function () {
    this.render();

    //slidesJS
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

  render: function() {
    this.$el.html(this.template(this.model));
    $('.school-body').append(this.el);
  },
});

CollegeVibe.Views.Sports = Parse.View.extend({
  template: _.template($('#sports-view').text()),

  initialize: function () {
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model));
    $('.school-body').append(this.el);
  },
});

CollegeVibe.Views.Gallery = Parse.View.extend({
  template: _.template($('#gallery-view').text()),

  initialize: function (schoolView) {
    this.render();
    this.schoolView = schoolView;
    var t1 = this.schoolView.model.get('instaHash1');
    var t2 = this.schoolView.model.get('instaHash2');
    var t3 = this.schoolView.model.get('instaHash3');
    var tags = [t1,t2,t3];
    var tags = tags.filter(function (e) {
      return e ? true : false; //remove the falsy values(undefined in this case);
    });

    var self = this;

    function postInstaImages () {
      _.each(self.schoolView.instagramInformation, function (i){
        var imageElement = document.createElement('img');
        $(imageElement).attr('src',i.images.low_resolution.url);
        $('.instagram-gallery ul').append(imageElement);
      });
    };

    if(!this.schoolView.instagramInformation) {
      console.log(tags);
      if(tags.length > 0) {
        Parse.Cloud.run('instagramTags', {tags:tags})
        .then(function (e) {
          console.log(e);
          self.schoolView.instagramInformation = e;
          postInstaImages();
        });
      }
    } else {
      postInstaImages();
    }

  },

  render: function() {
    this.$el.html(this.template(this.model));
    $('.school-body').append(this.el);
  },
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
        .select('slug')
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
  window.renderedViews = []; //Put into namespacing...
  window.collegeCollection = new CollegeVibe.Collections.Colleges(); //Put into namespacing...
  CollegeVibe.Router = new Router(); //instantiate the router
  Backbone.history.start(); //start watching hash changes
  // var div = document.createElement('div');
  // div.id = 'map';
  // $('#application').append(div);
  // div.style.height = '500px';
  // div.style.width = '100%';
  // (function () {
  //   map = new google.maps.Map(document.getElementById('map'), {
  //     center:{lat:-34.397, lng:150.644},
  //     zoom:5
  //   })
  // }())
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
