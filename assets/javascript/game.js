// Game Components //
var player;
var opponent;
var damageBoost = 20;
var curScreen;
var state = {
    choosePlayer: false,
    chooseOpp: false,
    attack: false,
    gameOver: false };
// Fighters to choose from and their Stats //
var fighters = {
    johhnyCage: {
        "id"      : 0,
        "name"    : "Johnny Cage",
        "hp"      : 100,
        "damage"  : 12,
        "dmgInc"  : 12,
        "avatar"  : "./assets/images/johnnycage-mk1avatar.png",
        "fightar" : "./assets/images/johnnycage-mk9port.png",
        "soundAttackSrc" : "assets/sounds/johnnyCageAttack.mp3",
        "soundWinSrc"    : "assets/sounds/johnnyCageWins.mp3",
        "soundPickSrc"   : "assets/sounds/pickJohnnyCage.mp3"},
    scorpion: {
        "id"      : 1,
        "name"    : "Scorpion",
        "hp"      : 180,
        "damage"  : 18,
        "dmgInc"  : 5,
        "avatar"  : "./assets/images/scorpion-mk1avatar.png",
        "fightar" : "./assets/images/scorpion-mk9port.png",
        "soundAttackSrc" : "assets/sounds/scorpionAttack.mp3",
        "soundWinSrc"    : "assets/sounds/scorpionWins.mp3",
        "soundPickSrc"   : "assets/sounds/pickScorpion.mp3"},
    subZero: {
        "id"      : 2,
        "name"    : "Sub-Zero",
        "hp"      : 130,
        "damage"  : 11,
        "dmgInc"  : 8,
        "avatar"  : "./assets/images/subzero-mk1avatar.png",
        "fightar" : "./assets/images/subzero-mk9port.png",
        "soundAttackSrc" : "assets/sounds/subZeroAttack.mp3",
        "soundWinSrc"    : "assets/sounds/subZeroWins.mp3",
        "soundPickSrc"   : "assets/sounds/pickSubZero.mp3"},
    liuKang: {
        "id"      : 3,
        "name"    : "Liu Kang",
        "hp"      : 110,
        "damage"  : 10,
        "dmgInc"  : 8,
        "avatar"  : "./assets/images/liukang-mk1avatar.png",
        "fightar" : "./assets/images/liukang-mk9port.png",
        "soundAttackSrc" : "assets/sounds/liuKangAttack.mp3",
        "soundWinSrc"    : "assets/sounds/liuKangWins.mp3",
        "soundPickSrc"   : "assets/sounds/pickLiuKang.mp3"}
}
console.log(fighters);
console.log(Object.keys(fighters).length);
// Setup page for Game //
$(document).ready(function(){
    
    stateSwitcher("attack")
    transTo("selectionScreen");
    renderCards();
  
    // Fade in entire page contents
    $("#wrapper").fadeIn( "slow", function(){});
  
    $(".card").click(function(){
      chooseCharacter(this);
    });
  
    $("#attack").click(function(){
      attack();
    });
  
    $("#reset").click(function(){
      $("html, body").fadeOut( "slow", function() {
        location.reload();
      });
    });
  
  });

// FUNCTIONS //
// Play Sounds //
function playSound(src){
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = src;
    // audio.autoplay = true;
    audio.play();
    audio.onended = function(){
        audio.remove(); //Remove when played.
    };
    document.body.appendChild(audio);
}; //End Play Sound Function

// Selection Screen Feedback //
function feedBack(s) {$("#selectionFeedBack").text(s)};

 // Displays fighters as "cards" on screen //
 function renderCards(){
    for(var i=0; i < Object.keys(fighters).length; i++) {
      var fighter = Object.keys(fighters)[i];
      var card = $("<div>");
      var avatar = "<img src='" + fighters[fighter].avatar + "'>";
      var name = "<h3>" + fighters[fighter].name + "</h3>";
      var hp = "<h4 class='hp'>" + fighters[fighter].hp + " HP</h4>";
      card.addClass("card", "selectScreen");
      card.attr("id", i);
      card.html(name);
      card.append(avatar);
      card.append(hp);
      card.css({"margin-top":"67px"});
      if (i == 0){
        card.css({"position":"relative",
                  "right":"110px"});
      } if (i == 1){
        card.css({"position":"relative",
                  "right":"92px"});
      } if (i == 2){
        card.css({"position":"relative",
                  "left":"92px"});
      } if (i == 3){
        card.css({"position":"relative",
                  "left":"110", "left":"110px"});
      } 
      $("#fighters").append(card);
      console.log(card.css({"margin-top":"67px"}))
    }
  }
  // Handles the selection of fighters //
  function chooseCharacter(c){
    var id = $(c).attr("id");
    var fighter = Object.keys(fighters)[id];
    if (state === "choosePlayer") {
      player = "";
      player = fighters[fighter];
      // Don't allow any more clicking on that card...
      $(c).addClass("disable player");
      console.log("You chose " + player.name);
      playSound(player.soundPickSrc);
      // switch states...
      stateSwitcher("chooseOpp");
      feedBack("Choose Your Opponent");
    } else if (state === "chooseOpp") {
      opponent = fighters[fighter];
      // Don't allow any more clicking on that card...
      $(c).addClass("disable opponent");
      console.log("For your opponent, you chose " + opponent.name);
      playSound(opponent.soundPickSrc);
      // switch states...
      stateSwitcher("attack");
    }
}

// Switches game modes and handles transitions s = state, w (optional) = win //
 function stateSwitcher(s, w) {
    if(s==="attack") {
        for (var key in state){
            state[key] = false};
        state.attack = true;  
        setArena();
        transTo("arenaScreen");
    } else if (s==="chooseOpp") {
        for (var key in state){
            state[key] = false};
        state.chooseOpp = true;  
        transTo("selectionScreen");
    } else if (s==="gameOver") {
        renderGameOver(w);
        for (var key in state){
            state[key] = false};
        state.gameOver = true;  
        transTo("endGameScreen");
    }
    console.log("Current state: " + getGameState());
}

// Get Current Game State // 
function getGameState() {
    for(var key in state) {
        var value = state[key];
        if (value) {return key};  
    }
}
  
 // Populates arena with fighters //
 function setArena() {
    $("#arena #battleFeedBack").empty(); // Clear battles FeedBack
    
    // If player card doesn't already exist...
    if ($("#battleStage .player").length === 0) {
      var fightar = $("<div>")
      fightar.addClass("playerFightar").append("<img src='"+fighters[player.id].fightar+"' height='450'>").appendTo("#battleStage");
      fightar.css({"height":"100px", "width":"auto",
                   "position":"relative", "right":"500px", "top":"-355px"});
      $("#fighters #"+player.id).clone().addClass('fighting').appendTo("#battleStage");
    }    
    // If opponent card doesn't already exist...
    if ($("#battleStage .opponent").length === 0) {
      $("#fighters #"+opponent.id).clone().addClass('fighting').appendTo("#battleStage");
      var fightarO = $("<div>")
      fightarO.addClass("opponentFightar").append("<img src='"+fighters[opponent.id].fightar+"' height='450'>").appendTo("#battleStage");
      fightarO.css({"height":"100px", "width":"auto",
                    "position":"relative", "left":"500px", "top":"-720px",
                    "transform":"scaleX(-1)"});
    } else {
      var fightarO = $("<div>")
      $("#battleStage .opponent").replaceWith($("#fighters #"+opponent.id).clone().addClass('fighting'));
      fightarO.addClass("opponentFightar").append("<img src='"+fighters[opponent.id].fightar+"' height='450'>").appendTo("#battleStage");
      fightarO.css({"height":"100px", "width":"auto",
                    "position":"relative", "left":"500px", "top":"-720px",
                    "transform":"scaleX(-1)"});
    }
    // Place fighter cards
    $(".fighting.player").css({"left":"-100px", "top":"-100px", "margin-top":"0"});
    $(".fighting.opponent").css({"top":"-100px", "margin-top":"0"});
    setTimeout(function () {
      playSound("assets/sounds/finalRoundFight.mp3");
      $("#attack").show("slow"); // Enable attack button
  }, 1000);
    console.log("Arena rendered");
    $("#attack").removeClass("disabled"); // Disable attack button
  }
 
// Renders the game over screen //
function renderGameOver(w) {
    if ($("#showcase .card").length===0) {
        $("#battleStage #"+player.id).clone().addClass('endGame').appendTo("#showcase");}
    if(w) {
        $("#showcase h4.hp").text("WINNER!");$( "div" ).show( "slow" );
        $("#gameOver #endGameFeedBack").html("You defeated everyone. You win!").append('<img hidden id="fatality" src="./assets/images/fatality.gif">');
        $("#fatality").show(3000);
    } else {
        $("#gameOver #endGameFeedBack").html("You were defeated by " + opponent.name + ". Try again.").append('<img hidden id="fatality" src="./assets/images/fatality.gif">');
        $("#fatality").show(3000);}
    $(".fighting.player.endGame").css({"left":"85px", "top":"10px"});
    $("#reset").show('slow');
    console.log("Game Over rendered");
}
function gameLose() {
    playSound(opponent.soundWinSrc);
    console.log("You died. Game over.");
    stateSwitcher("gameOver", false);
  }
  /**
  * Game over sequence - Winning outcome
  */
  function gameWin() {
    playSound(player.soundWinSrc);
    console.log("You win!");
    stateSwitcher("gameOver", true);
  }