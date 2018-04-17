/*

*** Sport Record Book ***

Il software deve generare casualmente le statistiche di gioco di 100 giocatori di basket per
una giornata di campionato.
In particolare vanno generate per ogni giocatore le seguenti informazioni, facendo
attenzione che il numero generato abbia senso:

- Codice Giocatore Univoco (formato da 3 lettere maiuscole casuali e 3 numeri)
- Numero di punti fatti
- Numero di rimbalzi
- Falli
- Percentuale di successo per tiri da 2 punti
- Percentuale di successo per da 3 punti

Una volta generato il “database”, il programma deve chiedere all’utente di inserire un Codice
Giocatore e il programma restituisce le statistiche.
BONUS: Dopo la generazione di dati casuali, il programma chiederà quale operazione vuole
fare l’utente che potrà scegliere tra le seguenti opzioni:

   ● L’utente inserisce 0: il programma termina
   ● L’utente inserisce 1: L’utente deve inserire il codice giocatore univoco per avere le
     informazioni su quel giocatore (“come prima”)
   ● L’utente inserisce 2: L’utente deve inserire il nome di una statistica (numero punti
     fatti, falli, etc) e il programma restituirà la media di quella statistica calcolata su tutti i
     giocatori.

*/

var db = new Array();

/* Players list HTML structure */
var playerDivOpen = "<div class='players'>",
    playerDivClose = "</div>";

$('document').ready(function(){

   resetInput($('#insertId'));

   //Inserisco il numero di giocatori richiesti nel form. Viene controllato che l'utente
   //abbia inserito un numero e solo in tal caso Il click sul bottone fa partire una
   //una richiesta AJAX la quale restituirà un array JSON contenente tanti giocatori
   //quanti ne sono stati richiesti
   $('form').submit(function(){

      var numeroGiocatori = parseInt( $('#insertId').val() );

      if ( !isNaN(numeroGiocatori)) {
         $.ajax({
            url : "https://www.boolean.careers/api/array/basket?n=" + numeroGiocatori,
            method : "GET",
            success : function(data, state){

               //Ciclo che mi permettere di inserire nell'elenco a sinistra tutti i
               //giocatori ricevuti dal Server
               console.log(data);
               for (var i = 0; i < data.response.length; i++) {
                  db.push(data.response[i]);
                  var list = $('#players-list');
                  list.append(
                     playerDivOpen + data.response[i].playerCode + playerDivClose
                  );
               }

            },
            error : function(errore){
               console.log(errore);
            }
         });

      } else {
         alert("Devi inserire un numero");
      }

      resetInput($('#insertId'));

      return false;
   });


   //Aggiorno le statistiche da visualizzare ogni volta che viene cliccato
   //un codice giocatore dalla lista

   $(document).on('click', '.players', function(){


      var itemClicked = $(this).index();

      $('#id').text(db[itemClicked].playerCode);

      $('.statistics').removeClass('hidden');

      $('#punti_fatti').text(db[itemClicked].points);
      $('#rimbalzi').text(db[itemClicked].rebounds);
      $('#falli_commessi').text(db[itemClicked].fouls);

      if ( !(db[itemClicked].points == 0) ) {
         var percent2P = ( (db[itemClicked].twoPoints / db[itemClicked].points) * 100 ).toFixed(1);
         var percent3P = ( (db[itemClicked].threePoints / db[itemClicked].points) * 100 ).toFixed(1);
      } else {
         percent2P = 0;
         percent3P = 0;
      }
      $('#tiri_2punti').text(percent2P);
      $('#tiri_3punti').text(percent3P);

   });

   //Funzione per resettare l'input
   function resetInput(inputField) {
      inputField.val('');
   }

});
