'use strict';

// First - the subclass constructor
function PlayGrid (state){
    this.state = state;

    this.sizeX = 10;
    this.sizeY = 20;

    this.activePosX = 3;
    this.activePosY = 0;

    this.grid = [];

    this.time = new Date().getTime();

    for (var i=0;i<this.sizeX;i++) {
        this.grid[i] = [];
        for (var j=0;j<this.sizeY;j++) {
            this.grid[i][j] = 0;
        }
    }

    this.activeShape = new Shape(this.state, 0);
    this.fillOutActiveShape(1);
}

PlayGrid.prototype.update = function() {
    if(new Date().getTime() > this.time + 300) {

        for (var i=0;i<this.activeShape.table.length;i++) {
            for (var j=0;j<this.activeShape.table[i].length;j++) {
                if(this.activeShape.table[i][j] == 1) {
                    let x = this.activePosX + i;
                    let y = this.activePosY + j;
                    if (y >= this.sizeY - 1 || this.grid[x][y+1] == 2) {
                        this.fillOutActiveShape(2); // 2 is reserved for fallen blocks for now

			//row clear check
                        for (var k=0;k<this.sizeY;k++) {
                            for (var l=0;l<this.sizeX;l++) {
                                if (this.grid[l][k] != 2) {
                                    break;
                                }

                                if (l == 9) {
                                    console.log("row clear");
                                    for (var m=k;m>0;m--) {
                                        for (var n=0;n<this.sizeX;n++) {
                                            this.grid[n][m] = this.grid[n][m-1]
                                        }
                                    }
                                }
                            }
                        }

                        //fail check
                        for (var k=0;k<this.grid.length;k++) {
                            if (this.grid[k][0] == 2) {
                                console.log("GAME OVER");
                            }
                        }
                        this.resetActiveShape(Math.floor(Math.random() * (6 - 0 + 1)) + 0);

                    }
                }
            }
        }
        
        this.updateActivePos(0, 1);
        this.time = new Date().getTime();
    }
}

PlayGrid.prototype.setBoard = function(currentBoard) {
    for (var i=0;i<this.sizeX;i++) {
        this.grid[i] = [];
        for (var j=0;j<this.sizeY;j++) {
            this.grid[i][j] = currentBoard[i][j];
        }
    }
    this.fillOutActiveShape(1);
}

PlayGrid.prototype.resetActiveShape = function(index) {
    this.activeShape = new Shape(this.state, index);
    this.activePosX = 3;
    this.activePosY = 0;
}

PlayGrid.prototype.updateActivePos = function(deltaX, deltaY) {
    //Update position of active shape, only if not collided

    //Collision check
    if (this.checkCollision(deltaX, deltaY, this.activeShape.table)) { return; }

    this.fillOutActiveShape(0);
    this.activePosX = this.activePosX + deltaX;
    this.activePosY = this.activePosY + deltaY;
    this.fillOutActiveShape(1);
}

PlayGrid.prototype.rotateActiveShape = function() {

    //Collision check
     let nextTable = this.activeShape.shape[this.activeShape.getNextRotIndex()];
    if (this.checkCollision(0, 0, nextTable)) { return; }

    this.fillOutActiveShape(0);
    this.activeShape.rotate();
    this.fillOutActiveShape(1);
}

PlayGrid.prototype.fillOutActiveShape  = function(int) {
    for (var i=0;i<this.activeShape.table.length;i++) {
        for (var j=0;j<this.activeShape.table[i].length;j++) {
            if(this.activeShape.table[i][j] == 1) {
                var x = this.activePosX + i;
		var y = this.activePosY + j;
                this.grid[x][y] = int;
            }
        }
    }  
}

PlayGrid.prototype.checkCollision = function(deltaX, deltaY, nextTable) {
    for (var i=0;i<nextTable.length;i++) {
        for (var j=0;j<nextTable[i].length;j++) {
            if(nextTable[i][j] == 1) {
                let x = this.activePosX + deltaX + i;
                let y = this.activePosY + deltaY + j;

                if (x < 0) { return true; }
                if (x >= this.sizeX) { return true; }
                if (this.grid[x][y] == 2) {return true; }
            }
        }
    }

    return false;
}

PlayGrid.prototype.getBlockValueAt = function(i, j) {
    var output = this.grid[i][j];
    return output;
}
