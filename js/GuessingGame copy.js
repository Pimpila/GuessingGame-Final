function generateWinningNumber() {
    return Math.floor((Math.random() * 100) + 1);
}

function shuffle (arr) {
    var m = arr.length; 
    var back;
    var front;

    while (m) {
        front = Math.floor(Math.random() * m--);
        back = arr[m];
        arr[m] = arr[front];
        arr[front] = back;
    }
    return arr;
}


function Game () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess)
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (!guess || guess <= 0 || guess > 100) {
        return "That's an invalid guess";
    }
    else {
        this.playersGuess = guess;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        return "You Win!";
    }
    else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return "You already guessed that number";
    }
    else {
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length === 5) {
            return "You Lose :(";
        }
        else if (this.difference() < 10) {
            return "You're burning up!";
        }
        else if (this.difference() < 25) {
            return "You're lukewarm"
        }
        else if (this.difference() < 50) {
            return "You're a bit chilly"
        }
        else {
            return "You're ice cold!"
        }
    }
}

function newGame () {
    return new Game();
}

Game.prototype.provideHint = function() {
    var hints = [this.winningNumber];
    for (var i = 1; i <= 2; i++) {
        hints.push(generateWinningNumber());
    }
    hints = shuffle(hints);
    return "The winning # is " + hints[0] + ", " + hints[1] + ", or " + hints[2];
}

function updateGuesses(game, input) {
    var idx = game.pastGuesses.length;
    $(".guess." + idx).text(input);
}

var turn = function (game) {
        var input = +$("#player-input").val(); // grab value of input and turn into a number
        var newText = game.playersGuessSubmission(input)
        $("#player-input").val(""); // clear input form b seting value to ""
        $("h1").text(newText); // change h1 to return value of playersGuessSubmission
        
        if (newText === "That's an invalid guess" || newText === "You already guessed that number") {
            $("h2").text("Guess Again!");
        }
        else if (newText === "You Lose :(" || newText === "You Win!") { 
            $("#submit, #hint").prop("disabled", true);
            $("h2").text("Press reset to play again");
            updateGuesses(game, input);
        }
        else if (game.isLower()) {    // change h2 accordingly
            $("h2").text("Go Higher");
            updateGuesses(game, input);
        }
        else {
            $("h2").text("Go Lower");
            updateGuesses(game, input);
        }
        
};

$(document).ready(function(){
    var game = newGame();

    $("#submit").on("click", function() {
       turn(game);
    });

    $("#player-input").keydown(function(event) {
        if (event.which === 13) {
            turn(game);
        }
    });

    $("#reset").on("click", function() {
        game = newGame();
        $("h1").text("Guess the Winning Number!");
        $("h2").text("Pick between 1 and 100");
        $(".guess").text("-");
        $("#submit, #hint").prop("disabled", false);
    });

    $("#hint").on("click", function() {
        $("h1").text(game.provideHint());
    });
});