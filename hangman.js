const  BADKEY="red";
const  GOODKEY="green";
const  RESETKEY="#444"

var hangman = {
    title:$("meta[name='hangman']").attr("title"),
    list:$("meta[name='hangman']").attr("content").split(','),
    curWord:"HANGMAN",
    nextWord: function() { return(hangman.curWord=hangman.list[rndNum(hangman.list.length)-1].toUpperCase())},
    setHangLvl: function(lvl) {
      switch (lvl) {
        case 0:
          /* new game */
          /* reset game */
          hangman.nextWord();
          resetKeys();
          initLetterTray();
          newClassName="hangman-lvl0";
          $("#hangman-container").removeClass(hangman.lastLvlClass);
          $("#hangman-container").addClass(newClassName);
          hangman.hangLvl=0;
          hangman.lastLvlClass=newClassName;
          $("#hint").text("HINT: "+hangman.title);
          break;

        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        newClassName="hangman-lvl"+lvl;
        $("#hangman-container").addClass(newClassName).removeClass(hangman.lastLvlClass);
        hangman.hangLvl++;
        hangman.lastLvlClass=newClassName;
        if (lvl== 6) {
          /* game over */

          $("#hint").text("GAME OVER");
          giveAnswer();          /*  put rest of letters up in RED */
          $('#new-game').attr("disabled",false); /* re-enable new game button */
          disableKeyboard (); /* don't allow any more choices from keyboard */
        }
        break;

        default:

      } /* switch */


    },
    key:{},
    hangLvl:0,
    lastLvlClass:"hangman-lvl0",
    initKeys: function() {
        for (var i="A".charCodeAt(); i<= "Z".charCodeAt(); i++)
        {
          hangman.key[String.fromCharCode(i)]={selected:false};
          /* register event handler */
          var button = "#"+String.fromCharCode(i);
          $(button).on("click",handleKeyEvent);
        } /* for */
      }/* initKeys */
  }/* var hangman object*/

function putCorrectLetterOnBoard(key) {
   var curWord=hangman.curWord;
  for (var i=0;i<  curWord.length;i++){
    if (curWord[i]== key) {
     setLetterInTray(key,i);
   } /* if */
  } /* for */
} /* function putCorrectLetterOnBoard */


function  giveAnswer(){
  for (var i=0;i<hangman.curWord.length;i++){
    if (hangman.curWord[i] != $("#letter-tray").children().eq(i).text()){
      $("#letter-tray").children().eq(i).text(hangman.curWord[i]);
      $("#letter-tray").children().eq(i).addClass("wrong-letter");
    } /* if */
  } /* for i */
}/* giveAnswer */


function checkForWin() {
  for (var i=0;i<hangman.curWord.length;i++){
    if (hangman.curWord[i] != $("#letter-tray").children().eq(i).text()){
      return false;
    } /* if */
  } /* for */
  return true;
} /* functdion */

function markKeyCorrect(key) {
  setKeyColor(key,GOODKEY);
  hangman.key[key].selected=true;
  putCorrectLetterOnBoard(key);
  if (checkForWin()) {
    /* We have a winner */
      $("#hint").text("CONGRATULATION YOU WON!");
      $('#new-game').attr("disabled",false);
      disableKeyboard ();
  };
}/* function markKeyCorrect */

function procWrongLtr(key) {
  setKeyColor(key,BADKEY);
  hangman.key[key].selected=true;
  hangman.setHangLvl(hangman.hangLvl+1);
}

function processKey( key ){
  /*
  check if key is in current word
 yes->
	mark key correct (markKeyCorrect())
	update letter in list (updateLtrList())
	exit
no ->
	process wrong letter ( procWrongLtr ())
	exit
  */
  if (hangman.curWord.indexOf(key)!=-1) {
    markKeyCorrect(key);
  } else {
    procWrongLtr(key);
  }

}/* precessKey */

/*  keyboard event handler */
function handleKeyEvent(){
  key=$(this).attr("id");
  /* check to see if we have already selected this key */
  if (hangman.key[key].selected){ return; }
   else {
     processKey(key);
   } /* else */

}/* handleKeyEvent */

function rndNum(max) {
  return Math.floor(Math.random()* max)+1
}

function setKeyColor(key,color){
 $(":button#"+key).css("background-color",color);
 switch (color) {
   case GOODKEY:
   case BADKEY:
      $('#'+key).attr("disabled",true);
      break;
   case RESETKEY:
      $('#'+key).attr("disabled",false);
      break;
   default:
      break;

 }
}

function setLetterInTray(letter,pos) {
  $("#letter-tray").children().eq(pos).text(letter);
}

function initLetterTray() {
  for (i=0;i<  $("#letter-tray").children().length;i++){
    setLetterInTray("",i);
    $("#letter-tray").children().eq(i).removeClass("wrong-letter");
  } /* for */
}

function resetKeys() {
  for (var i="A".charCodeAt(); i<= "Z".charCodeAt(); i++)
  {
    setKeyColor(String.fromCharCode(i),RESETKEY);
    hangman.key[String.fromCharCode(i)].selected=false;
  } /* for */
}

function disableKeyboard (){
  for (var i="A".charCodeAt(); i<= "Z".charCodeAt(); i++)
      {
         var key=String.fromCharCode(i);
        $('#'+key).attr("disabled",true);
      } /* for */
} /* disableKeyboard */

function newGame() {
  hangman.setHangLvl(0);
  $('#new-game').attr("disabled",true);
}

hangman.initKeys();
$("#new-game").on("click",newGame);
disableKeyboard (); /* don't allow any more choices from keyboard */
