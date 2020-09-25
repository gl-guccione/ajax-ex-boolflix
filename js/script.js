// functions

function searchContent() {
  var searchValue = $("#search").val();
  clear();
  requestData(searchValue, "movie");
  requestData(searchValue, "tv");

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
function requestData(search, type) {

  if (type == "movie") {
    var httpBody = "/search/movie";
  } else if (type == "tv") {
    var httpBody = "/search/tv";
  }

  var uri = "https://api.themoviedb.org/3";
  var url = uri + httpBody;

  if (search != "") {
    $.ajax(
      {
        "url": url,
        "data": {
          "api_key": "bde17cab6f3147255ce4802924edb786",
          "language": "it-IT",
          "include_adult": "false",
          "query": search,
        },
        "method": "GET",
        "success": function(date, state) {
          printData(type, date.results);
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
  } else if (type == "tv") {
    var htmlTemplate = $("#tv-shows-template");
    var dataContainer = $(".tv-shows");
  }

  var source = htmlTemplate.html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrObject.length; i++) {

    if (arrObject[i]["original_language"] == "en") {
      arrObject[i]["original_language"] = "gb";
    }

    arrObject[i]["stars"] = toBaseFive(arrObject[i].vote_average);

    var html = template(arrObject[i]);
    dataContainer.append(html);
  }

}

// script

// document ready
$(document).ready(function() {

  $("#search").val("");

  $(".searchbar__button").click(function() {
    searchContent();
  });

  $("#search").keyup(function(e) {
    if (e.which == 13 && $("#search").val() != "") {
      searchContent();
    }
  });

});
