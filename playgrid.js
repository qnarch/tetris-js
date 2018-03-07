"use strict";

// First - the subclass constructor
function PlayGrid (state){
    this.state = state;

    this.sizeX = 10;
    this.sizeY = 20;

    this.activePosX = 3;
    this.activePosY = 0;

    this.grid = [];

    this.time = new Date().getTime();

    for (let i=0;i<this.sizeX;i+=1) {
        this.grid[i] = [];
        for (let j=0;j<this.sizeY;j+=1) {
            this.grid[i][j] = 0;
        }
    }

    this.activeShape = new Shape(this.state, "I-block");
    this.fillOutActiveShape(1);
}

PlayGrid.prototype.update = function() {
    if(new Date().getTime() > this.time + 300) {

        for (let i=0;i<this.activeShape.table.length;i+=1) {
            for (let j=0;j<this.activeShape.table[i].length;j+=1) {
                if(this.activeShape.table[i][j] == 1) {
                    let x = this.activePosX + i;
                    let y = this.activePosY + j;
                    if (y >= this.sizeY - 1 || this.grid[x][y+1] == 2) {
                        this.fillOutActiveShape(2); // 2 is reserved for fallen blocks for now

                        //row clear check
                        for (let k=0;k<this.sizeY;k+=1) {
                            for (let l=0;l<this.sizeX;l+=1) {
                                if (this.grid[l][k] != 2) {
                                    break;
                                }

                                if (l == 9) {
                                    console.log("row clear");
                                    for (let m=k;m>0;m--) {
                                        for (let n=0;n<this.sizeX;n+=1) {
                                            this.grid[n][m] = this.grid[n][m-1]
                                        }
                                    }
                                }
                            }
                        }

                        //fail check
                        for (let k=0;k<this.grid.length;k+=1) {
                            if (this.grid[k][0] == 2) {
                                console.log("GAME OVER");
                            }
                        }
                        //this.resetActiveShape(Math.floor(Math.random() * (6 - 0 + 1)) + 0);
			this.resetActiveShape("S-block");
                    }
                }
            }
        }

        this.updateActivePos(0, 1);
        this.time = new Date().getTime();
    }
}

PlayGrid.prototype.setBoard = function(currentBoard) {
    
    for (let i=0;i<this.sizeX;i+=1) {
        this.grid[i] = [];
        for (let j=0;j<this.sizeY;j+=1) {
            this.grid[i][j] = currentBoard[i][j];
        }
    }
    
    /*
    for (let i=0;i<this.sizeX;i+=1) {
        this.grid[i] = [];
        for (let j=0;j<this.sizeY;j+=1) {
            this.grid[i][j] = currentBoard[i*10 + j];
        }
    }
    */
    this.fillOutActiveShape(1);
}

/*
* Set the active shape of this PlayGrid and reset it's position to the top center.
* @param {String} shapeStr - A key representing the shape to be created. Accepted values:
*    "I-block", "T-block", "L-block", "RevL-block", "Z-block", "RevZ-block", "S-block".
*/
PlayGrid.prototype.resetActiveShape = function(shapeStr) {
    this.activeShape = new Shape(this.state, shapeStr);
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
    for (let i=0;i<this.activeShape.table.length;i+=1) {
        for (let j=0;j<this.activeShape.table[i].length;j+=1) {
            if(this.activeShape.table[i][j] == 1) {
                var x = this.activePosX + i;
                var y = this.activePosY + j;
                this.grid[x][y] = int;
            }
        }
    }
}

PlayGrid.prototype.checkCollision = function(deltaX, deltaY, nextTable) {
    for (let i=0;i<nextTable.length;i+=1) {
        for (let j=0;j<nextTable[i].length;j+=1) {
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
