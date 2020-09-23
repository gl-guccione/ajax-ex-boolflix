// Milestone 1

// Creare un layout base con una searchbar (una input e un button)
// in cui possiamo scrivere completamente o parzialmente il nome di un film.
// Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.

// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

// functions

// function that convert a (number) in base 10 to a number in base 5
function toBaseFive(number) {
  if (!isNaN(number)) {
    return Math.ceil(number / 2);
  } else {
    return 0;
  }
}

// function that read the value of the #search input and make an ajax request for the tv-shows
function displayTvShows() {

  var searchValue = $("#search").val();

  if (searchValue != "") {
    $.ajax(
      {
        "url": "https://api.themoviedb.org/3/search/tv",
        "data": {
          "api_key": "bde17cab6f3147255ce4802924edb786",
          "language": "it-IT",
          "include_adult": "false",
          "query": searchValue,
        },
        "method": "GET",
        "success": function(date, state) {
          printTvShows(date.results);
        },
        "error": function() {
          alert("error");
        },
      }
    );
  }
}

// function that take the results of the ajax request and print the list of the tv-shows with handlebars
function printTvShows(arrObject) {

  var source = $("#tv-shows-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrObject.length; i++) {

    arrObject[i]["stars"] = toBaseFive(arrObject[i].vote_average);

    var html = template(arrObject[i]);
    $(".tv-shows").append(html);
  }

}

// function that read the value of the #search input and make an ajax request for the films
function displayFilm() {

  var searchValue = $("#search").val();

  if (searchValue != "") {
    $.ajax(
      {
        "url": "https://api.themoviedb.org/3/search/movie",
        "data": {
          "api_key": "bde17cab6f3147255ce4802924edb786",
          "language": "it-IT",
          "include_adult": "false",
          "query": searchValue,
        },
        "method": "GET",
        "success": function(date, state) {
          printFilms(date.results);
        },
        "error": function() {
          alert("error");
        },
      }
    );
  }
}

// function that take the results of the ajax request and print the list of the films with handlebars
function printFilms(arrObject) {

  var source = $("#films-template").html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < arrObject.length; i++) {

    if (arrObject[i]["original_language"] == "en") {
      arrObject[i]["original_language"] = "gb";
    }

    arrObject[i]["stars"] = toBaseFive(arrObject[i].vote_average);

    var html = template(arrObject[i]);
    $(".films").append(html);
  }

}

// script

// document ready
$(document).ready(function() {

  $("#search").val("");

  $(".searchbar__button").click(function() {
    $(".films").html("");
    displayFilm();
    displayTvShows()
    $("#search").val("");
  });

  $("#search").keyup(function(e) {
    if (e.which == 13 && $("#search").val() != "") {
      $(".films").html("");
      displayFilm();
      displayTvShows()
      $("#search").val("");
    }
  });

});
