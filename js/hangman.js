/*****************************************************************
*    constant declariations
******************************************************************/

const  BADKEY="red";       /* key color for wrong guess keys */
const  GOODKEY="green";    /* key color for correct keys */
const  RESETKEY="#444"     /* key Color for Reset Keys */

/*****************************************************************
*     global Variables and Objects
******************************************************************/
/********* hangman Object *********************************************
*   Description:
*     hangman object is the main object for the Hangman Game:
*     Variables:
*         title : holds title for a given game
*         list:   Holds array of words for a given topic
*         curWord: The current word for the game
*         newClassName: Class representing hangman image for this level
*         key:  keyboard Object used to keep track of what keys have been used
*         keyboardEnabled:  flag to enable/disable keyboard presses
*         hangLvl: integer representing current level of play
*         lastLvlClass: string represeting the last class from the previous level of the game
*
*      Methods:
*        NextWord:   method returns the next word in the game
*        setHangLvl: method that controls the sequence level or state of the game.
*                    Game begins at level 0 and ends at level 6.
*        initKeys:  method to initialize keyboard object structure and valuels
************************************************************************/
var hangman = {
    title:"",
    list:[],
    curWord:"HANGMAN",
    nextWord: function() { return(hangman.curWord=hangman.list[rndNum(hangman.list.length)-1].toUpperCase())},
    setHangLvl: function(lvl) {
      switch (lvl) {
        case 0:
          /* new game   perform a reset */
          hangman.game=rndNum($("meta[name='hangman']").length)-1 /* choose which game to play */
          hangman.title=$("meta[name='hangman']").eq(hangman.game).attr("title"); /* set title for game */
          hangman.list=$("meta[name='hangman']").eq(hangman.game).attr("content").split(','); /* get list of words */
          hangman.background=$("meta[name='hangman']").eq(hangman.game).attr("property");
          $("body").css("background-image",'url('+hangman.background+')'); /* put up the topic background */
          hangman.nextWord();  /* get the next word to play in this topic */
          resetKeys();         /* initialize keyboard */
          initLetterTray();    /* setup the letter tray */
          newClassName="hangman-lvl0";      /* set initial class for hanman image */
          $("#hangman-container").removeClass(hangman.lastLvlClass);  /* swap out any previous images */
          $("#hangman-container").addClass(newClassName);
          hangman.hangLvl=0;         /* initialize our game state */
          hangman.lastLvlClass=newClassName;
          $("#hint").text("HINT: "+hangman.title);  /* display the hint for this game */
          break;

        case 1:  /* head */
        case 2:  /* body */
        case 3:  /* left arm */
        case 4:  /* right arm */
        case 5:  /* left leg */
        case 6:  /* right leg GAME OVER */
         processGameStateLvl(lvl);
        if (lvl== 6) {  /* handle game over case */
          processGameOver ();   /* game over */


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
    keyboardEnabled:false,
    hangLvl:0,
    lastLvlClass:"hangman-lvl0",
    initKeys: function() {
        for (var i="A".charCodeAt(); i<= "Z".charCodeAt(); i++)
        {
          hangman.key[String.fromCharCode(i)]={selected:false};
          /* register event handler */
          var button = "#"+String.fromCharCode(i);
          $(button).on("click",handleKeyEvent);
          $(document).on("keypress", handleKeyboardEntry);
        } /* for */
      }/* initKeys */
  }/* var hangman object*/

/*  Functions */



/*** Function processGameOver ***************************
*    Parameters:
*        Input Parameters: none
*        Return Parameters: none
*    Description:
*        Game is over let user know what he missed.
*
******************************************************************/
function processGameOver () {

  $("#hint").text("GAME OVER");
  giveAnswer();          /*  put rest of letters up in RED */
  $('#new-game').attr("disabled",false); /* re-enable new game button */
  disableKeyboard (); /* don't allow any more choices from keyboard */
  return;
}  /* game over */



/*** Function processGameStateLvl  ***************************
*    Parameters:
*        Input Parameters: lvl  = Integer representing current game level.
*        Return Parameters: none
*    Description:
*        setup class for current game level to adjust game hanman images
*
******************************************************************/
function  processGameStateLvl(lvl){
  var newClassName="hangman-lvl"+lvl;  /* chenge class name to this level */
  /* remove old class level and add new one */
  $("#hangman-container").addClass(newClassName).removeClass(hangman.lastLvlClass);
  hangman.hangLvl++; /* move to next state level of game */
  hangman.lastLvlClass=newClassName;  /* save this class for next removal if necessary */
  return;
}

/*** Function putCorrectLetterOnBoard   ***************************
*    Parameters:
*        Input Parameters: key = Character
*        Return Parameters: none
*    Description:
*        compare letter passed in to current puzzle word.
*        if letter is in word display this on the game board.
******************************************************************/
function putCorrectLetterOnBoard(key) {
   var curWord=hangman.curWord;
  for (var i=0;i<  curWord.length;i++){
    if (curWord[i]== key) {
     setLetterInTray(key,i);
   } /* if */
  } /* for */
} /* function putCorrectLetterOnBoard */

/*** Function giveAnswer  ****************************************
*    Parameters:
*        Input Parameters: none
*        Return Parameters: none
*    Description:
*        Complete the game board with the missing letters in RED
*
******************************************************************/
function  giveAnswer(){
  for (var i=0;i<hangman.curWord.length;i++){
    if (hangman.curWord[i] != $("#letter-tray").children().eq(i).text()){
      $("#letter-tray").children().eq(i).text(hangman.curWord[i]);
      $("#letter-tray").children().eq(i).addClass("wrong-letter");
    } /* if */
  } /* for i */
}/* giveAnswer */


/*** Function checkForWin  ****************************************
*    Parameters:
*        Input Parameters: none
*        Return Parameters: boolean True = Win
*    Description:
*        Complete the game board with the missing letters in RED
*
******************************************************************/
function checkForWin() {
  for (var i=0;i<hangman.curWord.length;i++){
    if (hangman.curWord[i] != $("#letter-tray").children().eq(i).text()){
      return false;
    } /* if */
  } /* for */
  return true;
} /* function */


/*** Function markKeyCorrect  *************************************
*    Parameters:
*        Input Parameters: key  Char letter in play
*        Return Parameters: none
*    Description:
*        A correct key has been found. Now update that we have used this key
*        and place correct letter up on game board.  If all the letters have
*        have been found let the user know he has won.
*
******************************************************************/
function markKeyCorrect(key) {
  setKeyColor(key,GOODKEY);        /* turn the keyboard character The Good Color */
  hangman.key[key].selected=true;  /* this leter is now used */
  putCorrectLetterOnBoard(key);
  if (checkForWin()) {
    /* We have a winner */
      $("#hint").text("CONGRATULATION YOU WON!");
      $('#new-game').attr("disabled",false);
      disableKeyboard ();    /* we have finished the game don't accept any more keys presses */
  }; /* if checkForWin */
}/* function markKeyCorrect */


/*** Function procWrongLtr  *************************************
*    Parameters:
*        Input Parameters: key  Char letter in play
*        Return Parameters: none
*    Description:
*        Preocess the wrong letter logic: W will mark the key the bad color
*        Mark that this letter has been used. move to the next level of the
*        game.
*
******************************************************************/
function procWrongLtr(key) {
  setKeyColor(key,BADKEY);  /* indicate a Bad Choice on keyboard */
  hangman.key[key].selected=true;  /* this key has now been used */
  hangman.setHangLvl(hangman.hangLvl+1);  /* move to next level */
}


/*** Function processKey  *************************************
*    Parameters:
*        Input Parameters: key  Char letter in play
*        Return Parameters: none
*    Description:
*        Process the key that was retrieved.  If it is in the current word
*        handle it for correct or incorrect.
*        game.
*
******************************************************************/
function processKey( key ){
  if (hangman.curWord.indexOf(key)!=-1) {   /* is key in word?*/
    markKeyCorrect(key);    /* yes mark it correct */
  } else {
    procWrongLtr(key);      /* No mark it wrong */
  } /* else if */
}/* function precessKey */


/*** Function handleAKey  *************************************
*    Parameters:
*        Input Parameters: key  Char letter in play
*        Return Parameters: none
*    Description:
*        Check if this letter has previously been used. (possibly from a keyboard press)
*        if it has not been used process the letter the key represents.
*
******************************************************************/
function handleAKey(key){
  /* check to see if we have already selected this key */
  if (hangman.key[key].selected){ return; }
   else {
     processKey(key);  /* process this key */
     return;
   } /* else */
}

/*** Function validateKey  *************************************
*    Parameters:
*        Input Parameters: key  Char letter in play
*        Return Parameters: boolean True key is valid
*    Description:
*        Check if this keyboard character is a letter A-Z
*
******************************************************************/
function validateKey(key) {
  /* key needs to be A-Z */
  return key in hangman.key ;
}

/*** Function handleKeyboardEntry *************************************
*    Parameters:
*        Input Parameters: e   event
*        Return Parameters: none
*    Description:
*       Callback Function for keyboard character press
*
******************************************************************/
function  handleKeyboardEntry(e) {
  var key=String.fromCharCode(e.which).toUpperCase();
   if ( hangman.keyboardEnabled && validateKey(key)) handleAKey(key); /* process this character */
  return;
}

/*** Function rndNum **********************************************
*    Parameters:
*        Input Parameters: max number to  generate
*        Return Parameters: random number between 1 and max
*    Description:
*      General Random Number Generator
*
******************************************************************/
function rndNum(max) {
  return Math.floor(Math.random()* max)+1
}

/*** Function setKeyColor  **********************************************
*    Parameters:
*        Input Parameters: key Caracter, Color Value
*        Return Parameters: random number between 1 and max
*    Description:
*      set keyboard key character.  If color is not reset disable the key
*************************************************************************/
function setKeyColor(key,color){
 $(":button#"+key).css("background-color",color);  /* set the color */
/* disable the keys once they have been selected  */

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

 } /* switch */
}/* function setKeyColor */

/*** Function setLetterInTray ********************************************************
*    Parameters:
*        Input Parameters: key Caracter, Position Integer
*        Return Parameters: none
*    Description:
*      Put the current letter passed in, in the letter tray at the position indicated
**************************************************************************************/
function setLetterInTray(letter,pos) {
  $("#letter-tray").children().eq(pos).text(letter);
}


/*** Function sinitLetterTray ********************************************************
*    Parameters:
*        Input Parameters: none
*        Return Parameters: none
*    Description:
*      initialize the letter tray removing the wrong letter class
**************************************************************************************/
function initLetterTray() {
  for (i=0;i<  $("#letter-tray").children().length;i++){
    setLetterInTray("",i); /* remove old letter */
    $("#letter-tray").children().eq(i).removeClass("wrong-letter"); /* reset class */
  } /* for */
} /* function initLetterTray */

/*** Function resetKeys ********************************************************
*    Parameters:
*        Input Parameters: none
*        Return Parameters: none
*    Description:
*      reset the key color and the selected flag for the keyboard
**************************************************************************************/
function resetKeys() {
  for (var i="A".charCodeAt(); i<= "Z".charCodeAt(); i++)
  {
    setKeyColor(String.fromCharCode(i),RESETKEY);
    hangman.key[String.fromCharCode(i)].selected=false;
  } /* for */
} /* function resetKeys */

/*** Function disableKeyboard  ********************************************************
*    Parameters:
*        Input Parameters: none
*        Return Parameters: none
*    Description:
*      disable each key in the keyboard for letters A-Z
**************************************************************************************/
function disableKeyboard (){
  for (var i="A".charCodeAt(); i<= "Z".charCodeAt(); i++) /* A= ASCII 65 - Z=90 */
      {
        var key=String.fromCharCode(i);  /* convert to string from ASCII */
        $('#'+key).attr("disabled",true); /* disable the key */
      } /* for */
  hangman.keyboardEnabled=false; /* stop accepting keyboard characters */
} /*  function disableKeyboard */

/*** Function createLetterTray ********************************************************
*    Parameters:
*        Input Parameters: none
*        Return Parameters: none
*    Description:
*      disable each key in the keyboard for letters A-Z
**************************************************************************************/
function createLetterTray(letters) {
   $("#letter-tray").empty(); /* remove old children */
   for (var i= 0;i<letters;i++) {
     $("#letter-tray").append("<div class='correct-letters'></div>")
    } /* for */
} /* function createLetterTray */

/*****************************************************************
*     EVENT HANDLER FUNCTIONS
******************************************************************/

/*** Function handleKeyEvent *************************************
*    Parameters:
*        Input Parameters: event
*        Return Parameters: none
*    Description:
*       Mouse event handler callback fuction -process the click event
*       from the mouse
*
******************************************************************/
function handleKeyEvent(){
  var key=$(this).attr("id");
  handleAKey(key); /* process this character */
}/* handleKeyEvent */

/*** Function newGame ********************************************************
*    Parameters:
*        Input Parameters: event
*        Return Parameters: none
*    Description:
*      play a new game when New Game button is pressed
*      New Game will reset board and choose another random catagory and word from
*      that catagory.  Once the game starts the New Game Button is disabled.
**************************************************************************************/
function newGame() {
  hangman.keyboardEnabled=true;  /* enable the keyboard */
  hangman.setHangLvl(0);         /* initialize the game level */
  createLetterTray(hangman.curWord.length);  /* create a letter tray for letters to guess */
  $('#new-game').attr("disabled",true);    /* disable the New Game Button */
} /* function newGame */


/*******************************************************************
*   MAINLINE BEGINS HERE
******************************************************************/
hangman.initKeys();                /* initialize the keyboard Objects */
$("#new-game").on("click",newGame);    /* register the newGame Button */
disableKeyboard ();     /* don't allow any more choices from keyboard */
