

const
HMFILE="img/hangman"
HMFILEEXT='png';

var hangman = {
    title:$("meta[name='hangman']").attr("title"),
    list:$("meta[name='hangman']").attr("content").split(','),
    curWord:null,
    nextWord: function() { return(hangman.curWord=hangman.list[rndNum(hangman.list.length)-1].toUpperCase())},
    setHangLvl: function(lvl) {
          $("#hangman-container").addClass("hangman_lvl"+lvl).removeClass("hangman_lvl"+lvl-1);
    }
}



function rndNum(max) {
  return Math.floor(Math.random()* max)+1
}

function setKeyColor(key,color){
 $(":button#"+key).css("background-color",color);
}

function setLetterInTray(letter,pos) {
  $("#letter-tray").children().eq(pos).text(letter);
}

function initLetterTray() {
  for (i=0;i<  $("#letter-tray").children().length;i++){
    setLetterInTray("",i);
  } /* for */
}
