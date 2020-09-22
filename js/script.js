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

// function that read the value of the #search input and make an ajax request
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
function printFilms(object) {

  var source = $("#films-template").html();
  var template = Handlebars.compile(source);

  $(".films").html("");

  for (var i = 0; i < object.length; i++) {
    var html = template(object[i]);
    $(".films").append(html);
  }

}

// script

// document ready
$(document).ready(function() {

  $("#search").val("");

  $(".searchbar__button").click(displayFilm);

  $("#search").keyup(function(e) {
    if (e.which == 13 && $("#search").val() != "") {
      console.log("funziono");
      displayFilm();
    }
  });

});
