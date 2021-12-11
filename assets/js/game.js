var fightOrSkip = function() {
    //ask player if they'd like to fight or skip using fightOrSkip function
    var promptFight = window.prompt('Would you like to FIGHT or SKIP this battle? Enter "FIGHT" or "SKIP" to choose.');

    promptFight = promptFight.toLowerCase();

    // if we click cancel here instead of writing a Response, js can't .toLowerCase() a null value and the script stops running. I checked
    // with the debugger and this is in fact the issue

    //conditional recursive function call
    if (promptFight==="" || promptFight===null) {
        window.alert("Please provide a valid answer! Please try again.");
        fightOrSkip();
    }

    //if yes (true), leave fight
    if (promptFight ==='skip') {
        //confirm player wants to skip
        var confirmSkip=window.confirm("Are you sure you'd like to quit?");

        //if yes (true), leave fight
        if (confirmSkip) {
            window.alert(playerInfo.name + " has decided to skip this fight, Goodbye!");
            //subtract money from playerMoney for skipping
            playerInfo.money=playerInfo.money - 10;

            //reurn true if player wants to leave
            return true;
            //shop function call used to be here, but the module doesn't have it here anymore...
        }
        else {
            return false;
        }
    }
}
//it still lets me skip even if i don't have the money...
var fight = function(enemy) {
    //keep track of who goes first
    var isPlayerTurn = true;
    

    if (Math.random() > .5) {
        isPlayerTurn = false;
    }

    // repeat and execute as long as the enemy robot is alive 
    while(enemy.health > 0 && playerInfo.health > 0) {

        //if player attacks first
        if (isPlayerTurn) {
            
            //ask player if they'd like to fight or skip using fightOrSkip function
            if (fightOrSkip()) {
                break;
            }
            // generate random damage value based on player's attack power
            var damage=randomNumber(playerInfo.attack - 3, playerInfo.attack);
            enemy.health = Math.max(0, enemy.health - damage);
            console.log(
                playerInfo.name + ' attacked ' + enemy.name + ". " + enemy.name + " now has " + enemy.health + " health remaining."
            );

            // check enemy's health 
            if (enemy.health <=0) {
                window.alert(enemy.name + " has died!");
                // award player money for winning 
                playerInfo.money = playerInfo.money + 10;
                // leave while loop since enemy is dead 
                break;
            } else {
                window.alert(enemy.name + " still has " + enemy.health + " health left.");
            }
        }

        //if enemy attacks first
        else {
            // generate random damage value between 10-14. 
            var enemyDamage = randomNumber(enemy.attack - 4, enemy.attack);
            playerInfo.health = Math.max(0, playerInfo.health - enemyDamage);
            console.log (
                enemy.name + ' attacked ' + playerInfo.name + ". " + playerInfo.name + " now has " + playerInfo.health + " health remaining."
            );

            // check player's health 
            if (playerInfo.health <=0) {
                window.alert(playerInfo.name + " has died!");
                break;
            } else {
                window.alert(playerInfo.name + " still has " + playerInfo.health + " health left.");
            }
        }
        //switch turn order for next round
        isPlayerTurn = !isPlayerTurn;
    }
};

// funcion to start a new game 
var startGame = function() {
    // reset player stats 
    playerInfo.reset();
    // fight each enemy robot by looping over them and fighting them one at a time
    for(var i=0; i<enemyInfo.length; i++) {
        if (playerInfo.health > 0) {
            window.alert("Welcome to Robot Gladiators! Round " + (i + 1));
            var pickedEnemyObj = enemyInfo[i];
            pickedEnemyObj.health = randomNumber(40,60);
            fight(pickedEnemyObj);
            //if player is still alive and we're not at the last enemy in the array
            if (playerInfo.health>0 && i<enemyInfo.length-1) {
                //ask if player wants to use the store before next roung
                var storeConfirm=window.confirm("The fight is over, visit the store before the next round?")
                // if yes, take them to the store() function
                if (storeConfirm) {
                    shop();
                }
            }
        }
        else {
            window.alert("You have lost your robot in battle! Game Over!");
            break;
        }
    }
     // after the loop ends, player is either out of health or enemies to fight, so run the endgame function
     endGame();
};

var endGame = function() {
    window.alert("The game has now ended. Let's see how you did!");

    // if player is still alive, player wins! 
    if (playerInfo.health>0) {
        window.alert("Great job, you've survived the game! You now have a score of " + playerInfo.money + ".");
        
        //retrieve high score from local storage and store as a variable
        var highScore=localStorage.getItem("highscore");

        //compare player score against high score
        if (playerInfo.money > highScore || highScore === null) {
            localStorage.setItem("highscore", playerInfo.money);
            localStorage.setItem("record-holder", playerInfo.name);
            window.alert("Congratulations, you beat the high score and now hold the record!")
        }
        else {
            window.alert("You did not beat the high score, please play again and good luck!")
        }

    } else {
        window.alert("You've lost your robot in battle.");
    }
    
    //ask player if they want to play again
    var playAgainConfirm = window.confirm("Would you like to play again?");

    if (playAgainConfirm) {
        //restart the game
        startGame();
    } else {
        window.alert("Thank you for playing Robot Gladiators! Come back soon!");
    }
};

var shop = function() {
    //ask player what they'd like to do
    var shopOptionPrompt = window.prompt(
        "Would you like to REFILL your health, UPGRADE your attack, or LEAVE the store? Please enter one 1 for REFILL, 2 for UPGRADE, or 3 for LEAVE."
    );

    shopOptionPrompt = parseInt(shopOptionPrompt);

    //use switch to carry out action
    switch (shopOptionPrompt) {
        case 1:
            playerInfo.refillHealth();
            break;

        case 2:
            playerInfo.upgradeAttack()
            break;

        case 3:
            window.alert("Leaving the store.");
            break;

        default:
            window.alert("You did not pick a valid option. Try again.");
            shop();
            break;
    }
};

var randomNumber = function(min, max) {
    var value = Math.floor(Math.random() * (max-min+1) + min);
    return value;
};

var getPlayerName = function() {
    var name = "";
    while (name === "" || name === null) {
        name=prompt("Please enter a name for your robot");
    };
    console.log("Your robot's name is " + name);
    return name;
}

var playerInfo = {
    name: getPlayerName(),
    health: 100,
    attack: 10,
    money: 10,
    reset: function() {
        this.health = 100;
        this.money = 10;
        this.attack = 10;
    },
    refillHealth: function () {
        if (this.money >= 7) {
            window.alert("Refilling player's health by 20 for 7 dollars.");
            this.health += 20;
            this.money -= 7;
        }
        else {
            window.alert("You don't have enough money!")
        }   
    },
    upgradeAttack: function() {
        if (this.money >= 7) {
            window.alert("Upgrading player's attacke by 6 for 7 dollars.")
            this.attack += 6;
            this.money -= 7;
        }
        else {
            window.alert("You don't have enough money!")
        }
        
    }
};

var enemyInfo = [
    {
        name: "Roborto",
        attack: randomNumber(10,14)
    },
    {
        name: "Amy Android",
        attack: randomNumber(10,14)
    },
    {
        name: "Robo Trumble",
        attack: randomNumber(10,14)
    }
];

// start the game when the page loads 
startGame();

