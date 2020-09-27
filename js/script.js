// functions

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
            alert("nessun risultato per " + type);
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
  } else if (type == "tv") {
    var htmlTemplate = $("#tv-shows-template");
    var dataContainer = $(".tv-shows");
    var genre = $(".select-tv-genres").val();
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

  // get the genres and composing the select for both film and tv-show
  getGenres("movie");
  getGenres("tv");

});
