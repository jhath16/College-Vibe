// 'use strict'; why use this?

//Initialize Firebase
var FirebaseRef = new Firebase("https://college-vibe.firebaseio.com/");
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

  var mouseX,mouseY;
  document.addEventListener('mousemove', function (i) {
    mouseX = i.x + document.body.scrollLeft;
    mouseY = i.y + document.body.scrollTop;
  });

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
        .on("mouseover", function(d,e,f){
            // console.log(d);  ****This is all the data - ie: Name, lat, long, index, state, etc..
            return mapSearch(d.id);
        }).on("mouseout", function(){
            return hide_bubble();
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

        var offset = $(c.node()).offset();
        var bubbleLeft,
            bubbleTop

          if (!zoomed) {
            bubbleTop = offset.top - 70 + 'px';
            bubbleLeft = offset.left - 69 + 'px';
          } else {
            bubbleTop = offset.top - 70 + 'px',
            bubbleLeft = offset.left - 54 + 'px';
          }


            bubble.css({
                        "left": bubbleLeft,
                        "top": bubbleTop
                    });

        bubble.html("<h1>" + school_data.get('schoolname') + "</h1>" + "<p>" + school_data.get('city') + ", " + school_data.get('state') + "</p>");
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


}

//Removes a view from the global renderedViews array
//Also removes all subviews and partials

function removeViewFromRenderedViews (view) {
  var cid = view.cid;
  var index = _.findIndex(renderedViews, function (n) {return n.cid == cid});
  if(index < 0) {
    throw new Error("ATTEMPTING TO REMOVE VIEW THAT DOESN'T EXIST!");
  }
  renderedViews.splice(index,1); //remove from the array
  if (view.subViews) {
    _.each(view.subViews, function (i) { //remove the subViews
      i.remove();
    });
    view.subViews = [];
  }
  if (view.partial) {
    view.partial.remove(); //remove the partial(s);
  }
  view.partial = null;
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

    function toggleHandler(toggle) {
        toggle.addEventListener( "click", function(e) {
          e.preventDefault();
          (this.classList.contains("is-active") === true) ? this.classList.remove("is-active") : this.classList.add("is-active");
        });
      }
  }
});

CollegeVibe.Views.SchoolDropdown = Parse.View.extend({
  tagName:'a',

  initialize: function () {
    this.render();
  },

  template: _.template($('#search-results-view').text()),
  render: function () {
    this.$el.html(this.template(this.model));
    this.el.href = '#schools/' + this.model.get('slug');
    //why can't I use      attributes: {'href', '#' + this.model.get('slug')}?
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
    FirebaseRef.authWithPassword({email:email, password:password}, function (error, authData) {
      if (error) {
        alert('Error logging in.');
      }
    });
  },

  register: function () {
    var name = $('.register-container input')[0].value;
    var email = $('.register-container input')[1].value;
    var password = $('.register-container input')[2].value;
    var confirmPassword = $('.register-container input')[3].value;

    if (password === confirmPassword) {
      FirebaseRef.createUser({email:email, password:password}, function (error, authData) {
        if(error) {
          console.log(error);
          alert("Error signing up");
        } else {
          FirebaseRef.authWithPassword({email:email, password:password}, function (error, authData) {
            if (error) {
              alert("Error signing in");
              console.log(error);
            }
          });
        }
      });
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

CollegeVibe.Views.School = Parse.View.extend({
  template: _.template($('#school-view').text()),

  initialize: function () {
    this.render();
    this.instaLogoUrl = null;
    this.hotelInformation = null;
    this.foodInformation = null;
    this.sportsInformation = null;
    this.instagramInformation = null;
    this.subView = null;
    this.statisticsTab();
  },

  render: function () {
    this.$el.html(this.template(this.model)); //render the html with the new template to this.$el
    $('#application').append(this.el); //and put it on the page
    renderedViews.push(this); //put it in the renderedViews array
    this.partial = new CollegeVibe.Partials.SearchDropdown(); //instantiate the new partial
    return this;

    $('#nav-toggle').click(function(){
      $('.school-right-col').toggleClass('school-right-col-shift');
    });


  },

  events: {
    'click .school-options1 li' : 'clearSubviews',
    'click #statistics' : 'statisticsTab',
    'click #food' : 'restaurantsTab',
    'click #hotel' : 'hotelsTab',
    'click #sports' : 'sportsTab',
    'click #gallery' : 'galleryTab',
    'click #map' : 'mapHandler'
  },

  clearSubviews: function (e) {
    this.subView.remove();
  },

  //Pass the (this.)options of this school view so the school view can act as a controller
  //for the subviews/modules being appended to it. It will store
  //all of the data collected so we don't send out unnecessary requests by checking
  //to see if we have information stored already.
  //this.options gives access to the this.hotelInformation, etc...

  statisticsTab: function () {
    var self = this;
    this.subView = new CollegeVibe.Views.Statistics(this.options);
    // if (this.instaLogoUrl === null) {
    //   Parse.Cloud.run('instaLogos', {id: this.model.get('instaId')})
    //   .then(function (e) {
    //     self.instaLogoUrl = e;
    //     $('.school-info img').attr('src', e);
    //   });
    // } else {
    //   $('.school-info img').attr('src', this.instaLogoUrl);
    // }
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

  //necessary because we are calling the mapTab method directly from the restaurant route
  //From the restaurant tab, we were invoking it with the model as the parameter   (correct)
  //From the schoolTab(clicking on the tab), we were invoking it with the jQuery event   (errors)
  mapHandler: function () {
    this.mapTab();
  },

  mapTab: function (e) {
    this.subView = new CollegeVibe.Views.Map(this.options,e);
  },

  remove: function () {
      this.prototype.remove.apply(this);
      this.partial.remove();
    }
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
  }
});

CollegeVibe.Views.Restaurants = Parse.View.extend({
  initialize: function (schoolView) {
    var self = this;
    this.render();
    $('#filter-accordion [data-accordion]').accordion();
    this.schoolView = schoolView; //grab a reference to the parent
    this.categoryResults = null;
    this.categorySearchIsActive = false;
    this.categoryKeyword = null;
    this.subViews = []; //hold the restaurant views

    if(!this.schoolView.foodInformation) { //if we don't have the info yet

      Parse.Cloud.run('findNearRestaurants', {latitude:this.schoolView.model.get('latitude'), longitude:this.schoolView.model.get('longitude')})
      .then(function (e) {
        self.schoolView.foodInformation = e; //give the info back to the parent
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
    'click .submit-food-filter' : 'categorySearch',
    'change input[name="popularSearch"]' : 'radioCategorySearch',
    'change input[name="foodFilter"]' : 'reorderData',
  },

  reorderData: function () {
    this.emptyFoodList();
    this.appendPage(1);
  },

  clearFilter: function () {
    this.categorySearchIsActive = false;
    $('.clear-filter').addClass('hidden');
    $("input[type='radio']").attr('checked', false);
    $('input[name="distance-from"]').attr('checked', true);
    $('.category-searchbox').val('');
    $('.school-food ul').empty();
    var moduleHeader = $('.module-header p')[0];
    $(moduleHeader).html("Restaurants near " + this.schoolView.model.get('schoolname'));
    this.appendPage(1);
    this.addPageNumbers();
  },

  addPageNumbers: function () {
    var results;
    if (this.categorySearchIsActive == false) {
      results = this.schoolView.foodInformation;
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

  radioCategorySearch: function (e) {
    var self = this;
    var category = e.target.value;
    var latitude = this.model.get('latitude');
    var longitude = this.model.get('longitude');

    this.categorySearchIsActive = true;
    $('.clear-filter').removeClass('hidden'); //show the clear filters button

    this.emptyFoodList();
    this.emptyPageNumbers();
    this.updateHeader(category, this.schoolView.model.get('schoolname'));

    Parse.Cloud.run('restaurantCategorySearch', {latitude:latitude, longitude:longitude,category:category})
    .then(function (e) {
      console.log(e);
      self.categoryResults = e; //store the information in this view
      var results = e; //for easier reference here

      if (results.length == 0) { //if the search doesn't bring anything back
        appendToFoodList("<div class='no-results'>No results found</div>");
        self.categorySearchIsActive = false;
      } else {
        self.addPageNumbers(); //Put the numbers at the bottom
        self.appendPage(1); // Put the first page of information in there.
      }
    });
  },

  keypressCategorySearch: function (e) {
    if (e.which === 13 && e.target.value) {
      this.categorySearch();
    }
  },

  appendToFoodList: function (text) {
    $('.school-food ul').append(text);
  },

  updateHeader: function (category, schoolName) {
    var moduleHeader = $('.module-header p');
    var categoryString = "<strong style='font-size:14px; text-transform:Capitalize'>" + category + "</strong> near " + schoolName;
    $(moduleHeader).html(categoryString);
  },

  emptyFoodList: function () {
    $('.school-food ul').empty();
    _.each(this.subViews, function (i) {
      i.remove();
    });

    this.subViews = [];
  },

  emptyPageNumbers: function () {
    $(".view-all").empty();
  },

  categorySearch: function (e) {
    var self = this;
    this.categorySearchIsActive = true;
    this.emptyFoodList();
    $('.clear-filter').removeClass('hidden'); //show the clear filters button

    // $(foodList).append("<i style='font-size:20px;' class=fa fa-spin fa-spinner></i>");
    // ^^ This gets appended properly but never appears on page (CSS?) ^^
    this.emptyPageNumbers();
    var schoolName = this.schoolView.model.get('schoolname');
    var inputs = $('.category-searchbox').toArray();

    var currentInput = inputs.filter(function (i) {
      if ($(i).val() !== '') {
        return true;
      }
    });

    var category = $(currentInput).val().toLowerCase(); //unsure if lowerCasing is necessary

    this.updateHeader(category, schoolName);


    var latitude = this.schoolView.model.get('latitude'); //should make this accessible throughout the whole view (this.latitude = this.schoolView.model.get('latitude'))
    var longitude = this.schoolView.model.get('longitude'); //should make this accessible throughout the whole view (this.latitude = this.schoolView.model.get('longitude'))
    Parse.Cloud.run('restaurantCategorySearch', {latitude:latitude, longitude:longitude,category:category})
    .then(function (e) {
      console.log(e);
      self.categoryResults = e; //store the information in this view
      var results = e; //for easier reference here

      if (results.length == 0) { //if the search doesn't bring anything back
        self.appendToFoodList("<div class='no-results'>No results found</div>");
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
    this.emptyFoodList();
    this.appendPage(pageNumber);
  },

  appendPage: function (page) {
    var data;
    var categoryKeyword = this.categoryKeyword;
    if (this.categorySearchIsActive == false) {
      data = this.schoolView.foodInformation;
    } else {
      data = this.categoryResults;
    }
    //check to see if there is a foodFilter radio button pressed

    var checkedInput = _.findWhere($('input[name="foodFilter"]').toArray(), {checked:true});

    if (checkedInput) {
      //re-order the data
      var orderType = checkedInput.value;

      if(orderType == "rating") {
        data = _.sortBy(data, function (restaurant) {if(restaurant.rating)return restaurant.rating * -1});
        console.log(data);
      }
    }

    var defaultMax = page * 10;
    var min = defaultMax - 9;
    var realMax = defaultMax - data.length <= 0 ? defaultMax : data.length;
    var foodList = $('.school-food ul');


    var displayString = "Displaying results " + min + "-" + realMax;
    foodList.append('<div><h1>' + displayString + '</h1></div>');

    for (var i = min-1; i < realMax; i++) {
      var restaurant = data[i];
      new CollegeVibe.Views.Restaurant({model:restaurant, parent:this});
    }
  }
});

CollegeVibe.Views.Restaurant = Parse.View.extend({
  initialize: function () {
    this.parent = this.options.parent;
    this.parentSubViews = this.options.parent.subViews;
    this.render();
  },

  template: _.template($('#food-template').text()),

  render: function () {
    this.$el.html(this.template(this.model));
    $(".school-food ul").append(this.el);
    this.parentSubViews.push(this);
  },

  events: {
    'click .display-on-map' : 'displayOnMap'
  },

  displayOnMap: function () {
    CollegeVibe.SchoolView.clearSubviews();
    CollegeVibe.SchoolView.mapTab(new Parse.Object(this.model));
  }
})

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

    $('#nav-toggle').click(function(){
      $('.school-right-col').toggleClass('school-right-col-shift');
      // $('.school-body').toggleClass('school-body-shift');

    });
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

    var self = this;

    var imageTemplate = _.template($('#gallery-image-view').text());

    function postInstaImages () {
      _.each(self.schoolView.instagramInformation, function (i){
        $('.instagram-gallery ul').append(imageTemplate(i));
      });
    };

    if(!this.schoolView.instagramInformation) {
      FirebaseRef.child('Instagram/' + schoolView.model.get('schoolname')).once('value', function (snapshot) {
        self.schoolView.instagramInformation = snapshot.val().data;
        postInstaImages();
      });
      // Parse.Cloud.run('instagramTags', {tags:tags})
      // .then(function (e) {
      //   self.schoolView.instagramInformation = e;
      //   postInstaImages();
      // });
    } else {
      postInstaImages();
    }

  },

  render: function() {
    this.$el.html(this.template(this.model));
    $('.school-body').append(this.el);
  },
});

CollegeVibe.Views.Map = Parse.View.extend({
  template: _.template($('#map-view').text()),

  initialize:function (schoolView, e) {
    console.log(schoolView, e);
    var self = this;
    this.schoolView = schoolView;

    //render method will load the map with the center on the position of the object passed to it. Also has a marker
    //loaded of the object and a pop up listener loaded with it.

    if (e) {
      this.render(e, 17);
    } else {
      this.render(schoolView.model, 14);
    }

    this.foodMarkers = [];
    this.hotelMarkers = [];


    this.infoWindow = new google.maps.InfoWindow({
      content:null
    });
  },

  events: {
    'change input[type="checkbox"]' : 'checkboxHandler'
  },

  render: function (e, zoom) {
    console.log(e);
    var self = this;
    this.$el.html(this.template(this.model));
    $('.school-body').append(this.el);
    var map = document.getElementById('map-canvas');
    map.style.height = '500px';
    map.style.width = '100%';
    this.map = new google.maps.Map(map, {
      center: {lat: e.get('latitude'), lng: e.get('longitude')},
      zoom: zoom
    });
    var marker = new google.maps.Marker({
      position: {lat: e.get('latitude'), lng: e.get('longitude')},
      map: self.map,
      title:e.get('schoolname') || e.get('name')
    });

    marker.addListener('click', function () {
      self.infoWindow.setPosition({lat:e.get('latitude'), lng:e.get('longitude')});
      var name = e.get('name') || e.get('schoolname');
      e.set('name',name);
      self.infoWindow.setContent(_.template($('#map-popup-view').text())(e.attributes)); //get the name of whatever it is we are passed
      self.infoWindow.open(self.map);
    });
  },

  checkboxHandler: function (e) {
    var self = this;
    var targetName = e.target.name;
    var markerArray = this[targetName + "Markers"];
    var parseFunction;

    if (e.target.name === 'hotel') {
      parseFunction = "findNearHotels";
    } else {
      parseFunction = "findNearRestaurants";
    }

    if (markerArray.length === 0) {
      Parse.Cloud.run(parseFunction, {latitude:self.schoolView.model.get('latitude'), longitude: self.schoolView.model.get('longitude')})
      .then(function (e) {
        console.log(e);
        self.schoolView[targetName + "Information"] = e;

        _.each(self.schoolView[targetName + "Information"], function (i) {
          var marker = new google.maps.Marker({
            position: {lat:i.latitude, lng:i.longitude},
            title:i.name,
          });

          marker.addListener('click', function () {
            self.infoWindow.setPosition({lat:i.latitude, lng:i.longitude});
            self.infoWindow.setContent(_.template($('#map-popup-view').text())(i));
            self.infoWindow.open(self.map);
          });

          markerArray.push(marker);
        });
        self[targetName+"MarkerClusterer"] = new MarkerClusterer(self.map, markerArray, {maxZoom:17});
      });


    } else {
      if(e.target.checked) {
        this.addMarkers(markerArray, targetName);
      } else {
        this.removeMarkers(markerArray, targetName);
      }
    }
  },

  addMarkers: function (markerArray, targetName) {
    this[targetName+"MarkerClusterer"] = new MarkerClusterer(this.map, markerArray, {maxZoom:17});
  },

  removeMarkers: function (markerArray, targetName) {
    this[targetName+"MarkerClusterer"].clearMarkers();
  },

  getRoute: function () {
    var map = this.map;
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    var request = {
      origin:"greenville, sc",
      destination:"columbus, ohio",
      travelMode: google.maps.TravelMode.DRIVING //default
    }

    directionsService.route(request, function (result, status) {
      directionsDisplay.setDirections(result);
    });
  }
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



      var toggles = document.querySelectorAll(".c-hamburger");

      for (var i = toggles.length - 1; i >= 0; i--) {
        var toggle = toggles[i];
        toggleHandler(toggle);
      };

      function toggleHandler(toggle) {
        toggle.addEventListener( "click", function(e) {
          e.preventDefault();
          (this.classList.contains("is-active") === true) ? this.classList.remove("is-active") : this.classList.add("is-active");
        });
      }


  },

  events: {
    'keyup input' : 'searchDropdown',
    'click #nav-toggle' : 'toggleSlideout'
  },

  toggleSlideout: function () {
    $('.slideout-container').toggleClass('toggle-slideout');
    $('#nav-toggle').toggleClass('is-active');
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

			var matchedQuery = CollegeVibe.collegeCollection.filter(filterFunction);

			//matchedQuery now has the array of matching objects

      //Only render the first 6 (subject to change)
      //  - right now, doesn't resort the array before looping through
      //  - this means that only the first six in array are appended now
      //maybe in the future, we could add a sorting rule before rendering views

      var max = matchedQuery.length < 5 ? matchedQuery.length : 5;
      for (var i = 0; i < max; i++) {
        var newView = new CollegeVibe.Views.SchoolDropdown({model:matchedQuery[i]});
        self.subViews.push(newView);
      }

		}
  }
});


/* * * * * * * * *     MODELS       * * * * * * * * * * * * * */

CollegeVibe.Models.College = Backbone.Model;

/* * * * * * * *         COLLECTIONS        * * * * * * * * */

CollegeVibe.Collections.Colleges = Backbone.Firebase.Collection.extend({
  model:CollegeVibe.Models.College,

  url:'https://college-vibe.firebaseio.com/Colleges',

  initialize: function () {
    console.log('Colleges Collection has been created and fetched');
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

  schoolRoute: function (slug) {
    removeAllViews();
    console.log('schoolRoute fired with the slug: ' + slug);

    function initializeRoute() {
      var matchedSchool = CollegeVibe.collegeCollection.filter(function (school) {
        return school.get('slug') === slug;
      })[0];
      CollegeVibe.SchoolView = new CollegeVibe.Views.School({model:matchedSchool});
    }

    /* Debouncing this function lets us listen to the add event and fire this
    initialization function 1ms after the last one is loaded */

    var debouncedInitializeRoute = _.debounce(initializeRoute, 1);

    if (CollegeVibe.collegeCollection.length === 0) { // if we don't have the data yet
      this.listenTo(CollegeVibe.collegeCollection, 'add', function (e) {
        debouncedInitializeRoute();
      });
    } else {
      initializeRoute();
    }
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

//Initialize Code

$(document).ready(function () {
  window.renderedViews = []; //Put into namespacing...
  CollegeVibe.collegeCollection = new CollegeVibe.Collections.Colleges();
  CollegeVibe.currentUser = FirebaseRef.getAuth();
  FirebaseRef.onAuth(function (authData) {
    console.log("Auth has changed");
    if(authData) {
      console.log('User is now logged in');
      CollegeVibe.currentUser = authData;
    } else {
      console.log('User is no longer logged in');
      CollegeVibe.currentUser = null;
    }
  });
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
