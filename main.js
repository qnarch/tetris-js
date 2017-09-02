'use strict';

var game = new Kiwi.Game(null, 'Hello World', null, { renderer: Kiwi.RENDERER_CANVAS });
var myState = new Kiwi.State('myState');

let playGrid = new PlayGrid(myState);

myState.preload = function(){
    Kiwi.State.prototype.preload.call(this);
    this.addImage('bg','bg.png');
    this.addImage('fg','fg.png');
    this.leftKey = Kiwi.Input.Keycodes.LEFT;
    this.rightKey = Kiwi.Input.Keycodes.RIGHT;
    this.upKey = Kiwi.Input.Keycodes.UP;
}

myState.create = function(){
    Kiwi.State.prototype.create.call(this);
		//this.logo = new Kiwi.GameObjects.StaticImage(this, this.textures['logo'], 100, 100);
		//this.secondlogo = new Kiwi.GameObjects.StaticImage(this, this.textures['logo'], 200, 300);			
		//this.addChild(this.logo);
		//this.addChild(this.secondlogo);

    //Attach callback to be executed when a key is pressed.
    this.game.input.keyboard.onKeyDown.add( 
        myState.onPress, 
        this );

    this.blocksArray = [];
    for (var i=0;i<playGrid.sizeX;i++) {
        this.blocksArray[i] = [];
        for (var j=0;j<playGrid.sizeY;j++) {
            this.blocksArray[i][j] = new Kiwi.GameObjects.StaticImage(this, this.textures['bg'], 10 + i*24, 10 + j*24);
	    this.addChild(this.blocksArray[i][j]);
        }
    }  
}

myState.update = function(){
    Kiwi.State.prototype.update.call(this);
    //this.logo.rotation += 2;
    //this.secondlogo.rotation += -1

    //update game logic
    playGrid.update();

    //draw
    for (var i=0;i<playGrid.sizeX;i++) {
        for (var j=0;j<playGrid.sizeY;j++) {
            if (playGrid.grid[i][j] == 0) {
                this.blocksArray[i][j].atlas = this.textures['bg'];
            }
            else if (playGrid.grid[i][j] != 0) {
                this.blocksArray[i][j].atlas = this.textures['fg'];
            }
        }
    }
};

myState.onPress = function(keyCode) {
    switch (keyCode) {
        case this.leftKey:
            playGrid.updateActivePos(-1,0);
            break;
        case this.rightKey:
            playGrid.updateActivePos(1,0);
            break;
        case this.upKey:
            playGrid.rotateActiveShape();
            break;
    }   
};

game.states.addState(myState, true);

