# Hangman - GAWDI-12 Project 1 By Mike Rubin

Hangman is game in which one player tries to guess the letters of a word. Failed attempts are recorded by the computer drawing a gallows and someone hanging on it. Every wrong answer yields another body part attached to the gallows.  First the head, then the body, the left arm, the right arm, the left leg and finally the right leg. Once all the parts are attached the game is over as the user is HUNG! This version of the game pits the user against the computer, by choosing words imbedded as content meta tag information. Pressing the New-Game button gets things started.


### User Stories

* As a player, I want start the game by pressing the New Game button.
* As a player, I want to see a splash screen before I start the game.
* As a player, I want to be able to see how many letters are in the word to guess.
* As a player, I want to be able to tell which keys I guessed correct, and which I did not guess correct.
* As a player, I want to be able to use the mouse or the keyboard to select my letters.
* As a player, I want to know when the game is over.
* As a player, I want to know when I win the game.
* As a player, I want to know when I lose the game.
* As a player, I want a hint to help me guess the word.
* As an Author, I want to be able to add content to the game.
* As an Author, I want to add a category name of relating to the words.
* As an Author, I want to support multiple categories. (SILVER)
* As an Author, I want to add graphic backgrounds relating to the words. (GOLD)

### Technologies Used
Three main technologies were used to create the Hangman Game.  A web page was developed using HTML, Cascading Style Sheets, or CSS and JavaScript; each do different special jobs.

HTML was used only for structuring content.
CSS was used for applying all visual styles.
JavaScript was used for all interactive functionality,



### Installing

To install, clone a copy from github repository the username is merubin the repository is named hanmgan.git


```
git clone git@github.com:merubin/hangman.git

```

## Approach Taken

The game was written to act a a finite state machine. After the game is started, the game traverses through
various states of play from level zero, or game start, through level six, or Game Over, where the user has lost.  
At each level a check is made to see if a Win has happened.

Associated with each state level is a Hangman level class. The javascript keeps track of the level and changes the game board by removing and adding the old and new class name representative of that level.  This will then adjust the
game-board with the correct picture of the correct body part hanging from the gallows.

A hangman object was created to keep the state of the game, the keyboard and the current words of the game.

The words for the game are stored as content int he HTML file.  Meta tags were used to store words, categories and URL's to images that relate to the current game.  By adding a new meta tag, the game can be expanded.


## Future Features

The game in its current form is feature complete at the GOLD level.  The MVP Bronze for this game was to get one topic and one word list created and working.  The Silver version added multiple categories.  The gold version added the background images.

Future versions could be added to give the user a choice of which category to play from.  In addition, a timer could be used to score how long it took to win.  This could be saved or stored up on the cloud to compete with other users.  Further updates could consolidate the words up on the cloud, so that any list could be shard across all users.


## Authors

* **Mike Rubin** - *Initial work* - [Rubin IT Solutions](http://mike-rubin.com)


## License

This project is licensed under the MIT License.

## Acknowledgments

* Thank you to my teachers, Jesse Shawl, Nick Olds, and Adrain Maseda, who after only three weeks of classes have given me enough wisdom, through their teachings, to successfully create and complete this my Hangman project program.
* I want to thank those students of WDI-12 for their inspiration and good words to make this program a success.
* I want to thank Apple Computer company for making my mac!
