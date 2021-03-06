// functions

// function that hide the left arrow when the user is all the way to the left, and hide the right arrow when the user is all the way to the right
function hideArrows(type) {
  if (type == "film") {
    var dataContainer = $(".films");
  } else if (type == "tv") {
    var dataContainer = $(".tv-shows");
  }
  // var scrollWidth = dataContainer[0].scrollWidth; // return 0
  // var clientWidth = dataContainer[0].clientWidth; // return 0
  // var max = (scrollWidth - clientWidth); // return 0

  dataContainer.scroll(function () {
    if (dataContainer.scrollLeft() <= 0) {
      dataContainer.siblings(".scroll-control").children("[class^=\"prev-\"]").addClass("d_none");
    } else {
      dataContainer.siblings(".scroll-control").children("[class^=\"prev-\"]").removeClass("d_none");
    }

    // console.log(dataContainer[0].scrollWidth); // return correct number
    // console.log(scrollWidth); // return 0
    // console.log(clientWidth); // return 0
    // console.log(max); // return 0

    if (dataContainer.scrollLeft() >= (dataContainer[0].scrollWidth - dataContainer[0].clientWidth)) {
      dataContainer.siblings(".scroll-control").children("[class^=\"next-\"]").addClass("d_none");
    } else {
      dataContainer.siblings(".scroll-control").children("[class^=\"next-\"]").removeClass("d_none");
    }
  });
}

// function that scroll element
function scrollElm(elm, qnt) {
  document.getElementsByClassName(elm)[0].scrollBy({
    left: qnt,
    behavior: 'smooth'
  });
}

// function that create the option for the select (genres)
function createGenresSelect(container, genres) {
  for (var i = 0; i < genres.length; i++) {
    var option = $(".template option").clone();
    option.val(genres[i]["id"]).text(genres[i]["name"])
    container.append(option);
  }
}

// function that get all the genres
function getGenres(type) {
  var uri = "https://api.themoviedb.org/3/genre/";

  if (type == "movie") {
    var httpBody = "movie/list";
    var select = $(".select-movie-genres");
  } else if (type == "tv") {
    var httpBody = "tv/list";
    var select = $(".select-tv-genres");
  }

  var url = uri + httpBody;

  $.ajax(
    {
      "url": url,
      "data": {
        "api_key": "bde17cab6f3147255ce4802924edb786",
        "language": "it-IT",
      },
      "method": "GET",
      "success": function(date, state) {
        createGenresSelect(select, date.genres)
      },
      "error": function() {
        alert("error");
      },
    }
  );

}

// function that read the value of the input and make all the request for display the results
function searchContent() {
  var searchValue = $("#search").val();
  $(".results").removeClass("d_none");
  $(".results__search").text(searchValue);
  $(".results__num").text("0");

  clear();
  if (searchType == "all") {
    requestData(searchValue, "movie");
    requestData(searchValue, "tv");
  } else if (searchType == "films") {
    requestData(searchValue, "movie");
    $(".tv-shows__container").addClass("d_none");
  } else if (searchType == "tv-shows") {
    requestData(searchValue, "tv");
    $(".film__container").addClass("d_none");
  }

  $("#search").val("");
}

// function that clear the film and tv <ul>
function clear() {
  $(".films").html("");
  $(".tv-shows").html("");
}

// function that convert a decimal (number) to a number in base 5
function toBaseFive(number) {
  if (!isNaN(number)) {
    return Math.ceil(number / 2);
  } else {
    return 0;
  }
}

// function that read the value of the #search input and make an ajax request for (type)
function requestData(query, type) {

  if (type == "movie") {
    var httpBody = "/search/movie";
    var container = $(".film__container");
  } else if (type == "tv") {
    var httpBody = "/search/tv";
    var container = $(".tv-shows__container");
  }

  var uri = "https://api.themoviedb.org/3";
  var url = uri + httpBody;

  if (query != "") {
    $.ajax(
      {
        "url": url,
        "data": {
          "api_key": "bde17cab6f3147255ce4802924edb786",
          "language": "it-IT",
          "include_adult": "false",
          "query": query,
        },
        "method": "GET",
        "success": function(date, state) {
          if (date["total_results"] == 0) {
            container.addClass("d_none");
          } else {
            container.removeClass("d_none");
            printData(type, date.results);
          }
        },
        "error": function() {
          alert("error");
        },
      }
    );
  }
}

// function that take the results of the ajax request and print the list of (type) with handlebars
function printData(type, arrObject) {

  if (type == "movie") {
    var htmlTemplate = $("#films-template");
    var dataContainer = $(".films");
    var genre = $(".select-movie-genres").val();
    genre = parseInt(genre);
    var item = ".film__container .films__film";
    var container = $(".film__container")
  } else if (type == "tv") {
    var htmlTemplate = $("#tv-shows-template");
    var dataContainer = $(".tv-shows");
    var genre = $(".select-tv-genres").val();
    var item = ".tv-shows__container .tv-shows__tv-show";
    var container = $(".tv-shows__container")
  }

  var source = htmlTemplate.html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrObject.length; i++) {

    if (arrObject[i]["original_language"] == "en") {
      arrObject[i]["original_language"] = "gb";
    }

    arrObject[i]["stars"] = toBaseFive(arrObject[i].vote_average);

    var html = template(arrObject[i]);
    if (genre == "0" || (arrObject[i]["genre_ids"].includes(genre))) {
      dataContainer.append(html);
    }
  }

  var qntItem = $(item).length;
  var qntSaved = parseInt($(".results__num").text());
  $(".results__num").text(qntItem + qntSaved);

  if ($(item).length == 0) {
    container.addClass("d_none");
  }

  if (dataContainer[0].scrollWidth > dataContainer[0].clientWidth) {
    dataContainer.siblings(".scroll-control").children("[class^=\"next-\"]").removeClass("d_none");
    dataContainer.scrollLeft(0);
  } else {
    dataContainer.siblings(".scroll-control").children("[class^=\"prev-\"]").addClass("d_none");
    dataContainer.siblings(".scroll-control").children("[class^=\"next-\"]").addClass("d_none");
  }

}

// script

var searchType = "all";

// document ready
$(document).ready(function() {

  // reset of input and select
  $("#search").val("");
  $(".select-movie-genres").val("0");
  $(".select-tv-genres").val("0");

  // click function on searchbar__button
  $(".searchbar__button").click(function() {
    searchContent();
  });

  // keyup function on search input
  $("#search").keyup(function(e) {
    if (e.which == 13 && $("#search").val() != "") {
      searchContent();
    }
  });

  // read filter for search only films, only tv-shows or both
  $(".select-type").children().click(function() {
    var attribute = $(this).attr("data-search");
    if (searchType != attribute) {
      $(".select-type").children().removeClass("active");
      $(this).addClass("active");
      searchType = attribute;
    }
    if (attribute == "all") {
      $(".movie-genres").removeClass("d_none");
      $(".tv-genres").removeClass("d_none");
    } else if (attribute == "films") {
      $(".movie-genres").removeClass("d_none");
      $(".tv-genres").addClass("d_none");
    } else if (attribute == "tv-shows") {
      $(".movie-genres").addClass("d_none");
      $(".tv-genres").removeClass("d_none");
    }
  });

  // get the genres and create the select for both film and tv-show
  getGenres("movie");
  getGenres("tv");

  // scoll-control
  $(".prev-movie").click(function() {
    scrollElm("films", -700)
  });
  $(".next-movie").click(function() {
    scrollElm("films", 700)
  });
  $(".prev-tv").click(function() {
    scrollElm("tv-shows", -700)
  });
  $(".next-tv").click(function() {
    scrollElm("tv-shows", 700)
  });

  // scroll event
  hideArrows("film");
  hideArrows("tv");

});
