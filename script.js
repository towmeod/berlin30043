$(document).ready(function () {
    var gameMap = [
        [0, 6, 0, 6, 0, 6, 0, 6],
        [6, 0, 6, 0, 6, 0, 6, 0],
        [0, 6, 0, 6, 0, 6, 0, 6],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
    ]; // 0 - empty white, 1 - empty black, 2 - player 1 red piece, 3 - king red piece, 6 - player 2 white piece, 7 - king white piece
    var field = [];
    var boardCode = "";
    var chosenField = "none";
    var player = 1;
    var isNextJump = false;
    var turnCounter = 0;

    function Field(row, col) {
        this.row = row;
        this.col = col;
        this.value = gameMap[row][col];
        this.draw = function () {
            this.value = gameMap[row][col];
            if (isNextJump == false) {
                if (this.row == 0 && this.value == 2) {
                    this.value = 3;
                    gameMap[row][col] = 3;
                }
                if (this.row == 7 && this.value == 6) {
                    this.value = 7;
                    gameMap[row][col] = 7;
                }
            }
            if (this.value == 1) {
                $("#field" + this.row + this.col).html("");
            } else if (this.value == 2) {
                $("#field" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"white\" /></svg>");
            } else if (this.value == 3) {
                $("#field" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#edf8ff\" /></svg><img src=\"http://svgshare.com/i/3GU.svg\" class=\"crown\">");
            } else if (this.value == 6) {
                $("#field" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"red\" /></svg>");
            } else if (this.value == 7) {
                $("#field" + this.row + this.col).html("<svg xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"#d8111b\" /></svg><img src=\"http://svgshare.com/i/3GU.svg\" class=\"crown\">");
            }
        } // draw field and piece image 
    } // field constructor 
    function doesFieldExists(row, col) {
        if (row < 8 && col < 8 && row >= 0 && col >= 0) return true;
        else return false;
    }

    function getRow(field) {
        return parseInt(field.charAt(5));
    } // gets row number from field name
    function getCol(field) {
        return parseInt(field.charAt(6));
    } // gets col number from field name
    function canChooseField(field) {
        if (player == 1 &&
            (gameMap[getRow(field)][getCol(field)] == 2 ||
                gameMap[getRow(field)][getCol(field)] == 3)) {
            return true;
        } else if (player == 2 &&
            (gameMap[getRow(field)][getCol(field)] == 6 ||
                gameMap[getRow(field)][getCol(field)] == 7)) {
            return true;
        }
    }

    function changePlayer() {
        if (player == 1) {
            player = 2;
        } else {
            player = 1;
        }
    }

    function chooseField(field) {
        if (isNextJump == false) {
            if (chosenField == field) {
                $('#' + chosenField).css('background-color', 'black');
                chosenField = "none";
            } else {
                if (chosenField != "none") {
                    $('#' + chosenField).css('background-color', 'black');
                }
                chosenField = field;
                $('#' + chosenField).css('background-color', 'green');
            }
        }
    }

    function canMove(field) {
        var row = getRow(field);
        var col = getCol(field);
        var chosenRow = getRow(chosenField);
        var chosenCol = getCol(chosenField);
        if (chosenField != "none" &&
            player == 1 &&
            gameMap[chosenRow][chosenCol] == 3 &&
            (Math.abs(row - chosenRow) == Math.abs(col - chosenCol)) &&
            gameMap[row][col] == 1) {
            return true;
        } else
        if (chosenField != "none" &&
            player == 2 &&
            gameMap[chosenRow][chosenCol] == 7 &&
            (Math.abs(row - chosenRow) == Math.abs(col - chosenCol)) &&
            gameMap[row][col] == 1) {
            return true;
        }
        if (chosenField != "none" &&
            player == 1 &&
            gameMap[chosenRow][chosenCol] == 2 &&
            (row - chosenRow == -1) &&
            Math.abs(col - chosenCol) == 1 &&
            gameMap[row][col] == 1) {
            return true;
        } else
        if (chosenField != "none" &&
            player == 2 &&
            gameMap[chosenRow][chosenCol] == 6 &&
            (row - chosenRow == 1) &&
            Math.abs(col - chosenCol) == 1 &&
            gameMap[row][col] == 1) {
            return true;
        }
    }

    function move(field) {
        gameMap[getRow(field)][getCol(field)] = gameMap[getRow(chosenField)][getCol(chosenField)];
        gameMap[getRow(chosenField)][getCol(chosenField)] = 1;
        $('#' + chosenField).css('background-color', 'black');
        chosenField = "none";
        changePlayer();
        draw();
        turnCounter++;
        console.log(turnCounter);
    }

    function canMakeNextJump(field) {
        var isJumpPossible = false;
        var row = getRow(field);
        var col = getCol(field);
        if (player == 1 && gameMap[row][col] == 2 || gameMap[row][col] == 3) {
            if (doesFieldExists(row + 2, col + 2) &&
                gameMap[row + 2][col + 2] == 1 &&
                (gameMap[row + 1][col + 1] == 6 ||
                    gameMap[row + 1][col + 1] == 7)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col + 2) &&
                gameMap[row - 2][col + 2] == 1 &&
                (gameMap[row - 1][col + 1] == 6 ||
                    gameMap[row - 1][col + 1] == 7)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row + 2, col - 2) &&
                gameMap[row + 2][col - 2] == 1 &&
                (gameMap[row + 1][col - 1] == 6 ||
                    gameMap[row + 1][col - 1] == 7)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col - 2) &&
                gameMap[row - 2][col - 2] == 1 &&
                (gameMap[row - 1][col - 1] == 6 ||
                    gameMap[row - 1][col - 1] == 7)) {
                isJumpPossible = true;
            }
        }
        if (player == 2 && gameMap[row][col] == 6 || gameMap[row][col] == 7) {
            if (doesFieldExists(row + 2, col + 2) &&
                gameMap[row + 2][col + 2] == 1 &&
                (gameMap[row + 1][col + 1] == 2 ||
                    gameMap[row + 1][col + 1] == 3)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col + 2) &&
                gameMap[row - 2][col + 2] == 1 &&
                (gameMap[row - 1][col + 1] == 2 ||
                    gameMap[row - 1][col + 1] == 3)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row + 2, col - 2) &&
                gameMap[row + 2][col - 2] == 1 &&
                (gameMap[row + 1][col - 1] == 2 ||
                    gameMap[row + 1][col - 1] == 3)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col - 2) &&
                gameMap[row - 2][col - 2] == 1 &&
                (gameMap[row - 1][col - 1] == 2 ||
                    gameMap[row - 1][col - 1] == 3)) {
                isJumpPossible = true;
            }
        }
        return isJumpPossible;
    }

    function canJumpSpecific(field, field2) {
        var row = getRow(field);
        var col = getCol(field);
        var row2 = getRow(field2);
        var col2 = getCol(field2);
        var isJumpPossible = false;
        if (gameMap[row][col] == 2 || gameMap[row][col] == 3) {
            if (doesFieldExists(row + 2, col + 2) &&
                gameMap[row + 2][col + 2] == 1 &&
                row + 2 == row2 && col + 2 == col2 &&
                (gameMap[row + 1][col + 1] == 6 ||
                    gameMap[row + 1][col + 1] == 7)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col + 2) &&
                gameMap[row - 2][col + 2] == 1 &&
                row - 2 == row2 && col + 2 == col2 &&
                (gameMap[row - 1][col + 1] == 6 ||
                    gameMap[row - 1][col + 1] == 7)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row + 2, col - 2) &&
                gameMap[row + 2][col - 2] == 1 &&
                row + 2 == row2 && col - 2 == col2 &&
                (gameMap[row + 1][col - 1] == 6 ||
                    gameMap[row + 1][col - 1] == 7)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col - 2) &&
                gameMap[row - 2][col - 2] == 1 &&
                row - 2 == row2 && col - 2 == col2 &&
                (gameMap[row - 1][col - 1] == 6 ||
                    gameMap[row - 1][col - 1] == 7)) {
                isJumpPossible = true;
            }
        }
        if (gameMap[row][col] == 6 || gameMap[row][col] == 7) {
            if (doesFieldExists(row + 2, col + 2) &&
                gameMap[row + 2][col + 2] == 1 &&
                row + 2 == row2 && col + 2 == col2 &&
                (gameMap[row + 1][col + 1] == 2 ||
                    gameMap[row + 1][col + 1] == 3)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col + 2) &&
                gameMap[row - 2][col + 2] == 1 &&
                row - 2 == row2 && col + 2 == col2 &&
                (gameMap[row - 1][col + 1] == 2 ||
                    gameMap[row - 1][col + 1] == 3)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row + 2, col - 2) &&
                gameMap[row + 2][col - 2] == 1 &&
                row + 2 == row2 && col - 2 == col2 &&
                (gameMap[row + 1][col - 1] == 2 ||
                    gameMap[row + 1][col - 1] == 3)) {
                isJumpPossible = true;
            }
            if (doesFieldExists(row - 2, col - 2) &&
                gameMap[row - 2][col - 2] == 1 &&
                row - 2 == row2 && col - 2 == col2 &&
                (gameMap[row - 1][col - 1] == 2 ||
                    gameMap[row - 1][col - 1] == 3)) {
                isJumpPossible = true;
            }
        }
        return isJumpPossible;
    }

    function canJump() {
        var isJumpPossible = false;
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col++) {
                if (player == 1 && gameMap[row][col] == 2 || gameMap[row][col] == 3) {
                    if (doesFieldExists(row + 2, col + 2) &&
                        gameMap[row + 2][col + 2] == 1 &&
                        (gameMap[row + 1][col + 1] == 6 ||
                            gameMap[row + 1][col + 1] == 7)) {
                        isJumpPossible = true;
                    }
                    if (doesFieldExists(row - 2, col + 2) &&
                        gameMap[row - 2][col + 2] == 1 &&
                        (gameMap[row - 1][col + 1] == 6 ||
                            gameMap[row - 1][col + 1] == 7)) {
                        isJumpPossible = true;
                    }
                    if (doesFieldExists(row + 2, col - 2) &&
                        gameMap[row + 2][col - 2] == 1 &&
                        (gameMap[row + 1][col - 1] == 6 ||
                            gameMap[row + 1][col - 1] == 7)) {
                        isJumpPossible = true;
                    }
                    if (doesFieldExists(row - 2, col - 2) &&
                        gameMap[row - 2][col - 2] == 1 &&
                        (gameMap[row - 1][col - 1] == 6 ||
                            gameMap[row - 1][col - 1] == 7)) {
                        isJumpPossible = true;
                    }
                }
                if (player == 2 && gameMap[row][col] == 6 || gameMap[row][col] == 7) {
                    if (doesFieldExists(row + 2, col + 2) &&
                        gameMap[row + 2][col + 2] == 1 &&
                        (gameMap[row + 1][col + 1] == 2 ||
                            gameMap[row + 1][col + 1] == 3)) {
                        isJumpPossible = true;
                    }
                    if (doesFieldExists(row - 2, col + 2) &&
                        gameMap[row - 2][col + 2] == 1 &&
                        (gameMap[row - 1][col + 1] == 2 ||
                            gameMap[row - 1][col + 1] == 3)) {
                        isJumpPossible = true;
                    }
                    if (doesFieldExists(row + 2, col - 2) &&
                        gameMap[row + 2][col - 2] == 1 &&
                        (gameMap[row + 1][col - 1] == 2 ||
                            gameMap[row + 1][col - 1] == 3)) {
                        isJumpPossible = true;
                    }
                    if (doesFieldExists(row - 2, col - 2) &&
                        gameMap[row - 2][col - 2] == 1 &&
                        (gameMap[row - 1][col - 1] == 2 ||
                            gameMap[row - 1][col - 1] == 3)) {
                        isJumpPossible = true;
                    }
                }
            }
        }
        return isJumpPossible;
    }

    function jump(field) {
        if (chosenField != "none") {
            var mediumRow = (getRow(field) + getRow(chosenField)) / 2;
            var mediumCol = (getCol(field) + getCol(chosenField)) / 2;
            gameMap[getRow(field)][getCol(field)] = gameMap[getRow(chosenField)][getCol(chosenField)];
            gameMap[getRow(chosenField)][getCol(chosenField)] = 1;
            gameMap[mediumRow][mediumCol] = 1;
            $('#' + chosenField).css('background-color', 'black');
            if (canMakeNextJump(field) == false) {
                isNextJump = false;
                chosenField = "none";
                mediumRow = "none";
                mediumCol = "none";
                changePlayer();
                draw();
            } else {
                isNextJump = true;
                chosenField = field;
                $('#' + chosenField).css('background-color', 'green');
                mediumRow = "none";
                mediumCol = "none";
                draw();
            }
            turnCounter = 0;
        }
    }

    function draw() {
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col++) {
                field[row][col].draw();
            }
        }
    }

    function createFields() {
        for (var row = 0; row < 8; row++) {
            field[row] = [];
            for (var col = 0; col < 8; col++) {
                field[row][col] = new Field(row, col);
                if ((row % 2 == 0 && col % 2 == 1) || (row % 2 == 1 && col % 2 == 0)) {
                    boardCode += "<div class=\"black\" id=field" + row + col + "></div>";
                } else {
                    boardCode += "<div class=\"white\" id=field" + row + col + "></div>";
                }
            }
        }
        $("#board").html(boardCode);
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col++) {
                field[row][col].draw();
                if (gameMap[row][col] != 0) {
                    $('#field' + row + col).click(function () {
                        if (canChooseField(this.id)) {
                            chooseField(this.id);
                        } else if (chosenField != "none" &&
                            canJump() &&
                            canJumpSpecific(chosenField, this.id)) {
                            jump(this.id);
                        } else if (chosenField != "none" &&
                            canJump() == false &&
                            canMove(this.id)) {
                            move(this.id);
                        }
                    });
                }
            }
        }
    } // creates all the Fields
    createFields();
    draw();
})