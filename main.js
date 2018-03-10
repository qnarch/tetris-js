"use strict";

var comVersion = "0.1";

var game = new Kiwi.Game(null, "Hello World", null, { renderer: Kiwi.RENDERER_CANVAS });
var myState = new Kiwi.State("myState");
var name = "";

var playGrid = new PlayGrid(myState);

var connection = new WebSocket("ws://localhost:12345");
connection.onopen = function (event) {
    window.alert("Connected to server!");
    connection.send("Client connected!");
};

/*
* Send the desired action to the TetrisSlinger server.
* @param {String} typeStr - The action type.
* @param {String} valueStr - The value.
* @see {@link https://knark.io/tetrisslinger-docs/com.html} for further information.
*/
connection.sendAction = function(typeStr, valueStr) {
    var msgDict = { "version":comVersion, "type":typeStr, "value":valueStr };
    var msg = JSON.stringify(msgDict);
    this.send(msg);
};

/*
* Handler for incoming messages from the TetrisSlinger server. Do not call from this application.
* @param {Event} e
*/
connection.onmessage = function(e){
    window.alert(e.data);
    var server_message = e.data;
    var message = JSON.parse(server_message);

    if (!message.response_type) {
        return;
    }

    switch(message.response_type) {
        case "board":
            playGrid.setBoard(message.value);
            break;
        
        case "active_block":
            playGrid.resetActiveShape(message.value);
            break;
    }
};

myState.preload = function(){
    Kiwi.State.prototype.preload.call(this);
    this.addImage("bg","bg.png");
    this.addImage("fg","fg.png");
    this.leftKey = Kiwi.Input.Keycodes.LEFT;
    this.rightKey = Kiwi.Input.Keycodes.RIGHT;
    this.upKey = Kiwi.Input.Keycodes.UP;
    this.downKey = Kiwi.Input.Keycodes.DOWN;
    this.spaceKey = Kiwi.Input.Keycodes.SPACEBAR;
    this.special1Key = Kiwi.Input.Keycodes.ONE;
/*
    this.special2Key = Kiwi.Input.Keycodes.TWO;
    this.special3Key = Kiwi.Input.Keycodes.THREE;
    this.special4Key = Kiwi.Input.Keycodes.FOUR;
    this.special5Key = Kiwi.Input.Keycodes.FIVE;
*/
    this.testKey = Kiwi.Input.Keycodes.T;

};

myState.create = function(){
    Kiwi.State.prototype.create.call(this);
                //this.logo = new Kiwi.GameObjects.StaticImage(this, this.textures["logo"], 100, 100);
                //this.secondlogo = new Kiwi.GameObjects.StaticImage(this, this.textures["logo"], 200, 300);
                //this.addChild(this.logo);
                //this.addChild(this.secondlogo);

    //Attach callback to be executed when a key is pressed.
    this.game.input.keyboard.onKeyDown.add(myState.onPress, this);

    this.blocksArray = [];
    for (let i=0;i<playGrid.sizeX;i+=1) {
        this.blocksArray[i] = [];
        for (let j=0;j<playGrid.sizeY;j+=1) {
            this.blocksArray[i][j] = new Kiwi.GameObjects.StaticImage(this, this.textures["bg"], 10 + i*24, 10 + j*24);
            this.addChild(this.blocksArray[i][j]);
        }
    }

    while(!name)
    {
        name = prompt("Please enter your name", "Player");
    }
    connection.sendAction("set_name", name);

    connection.sendAction("start_game", true);

};

myState.update = function(){
    Kiwi.State.prototype.update.call(this);
    //this.logo.rotation += 2;
    //this.secondlogo.rotation += -1

    //update game logic
    playGrid.update();

    if(playGrid.gameOver)
    {
        connection.sendAction("end_game", true);
    }

    //draw
    for (let i=0;i<playGrid.sizeX;i+=1) {
        for (let j=0;j<playGrid.sizeY;j+=1) {
            if (playGrid.grid[i][j] == 0) {
                this.blocksArray[i][j].atlas = this.textures["bg"];
            }
            else if (playGrid.grid[i][j] != 0) {
                this.blocksArray[i][j].atlas = this.textures["fg"];
            }
        }
    }
};

myState.onPress = function(keyCode) {
    switch (keyCode) {
        case this.leftKey:
            playGrid.updateActivePos(-1,0);
            connection.sendAction("move_active_block", "left");
            break;
        case this.rightKey:
            playGrid.updateActivePos(1,0);
            connection.sendAction("move_active_block", "right");
            break;
        case this.upKey:
            connection.sendAction("move_active_block", "rotate");
            playGrid.rotateActiveShape();
            break;
        case this.downKey:
            connection.sendAction("move_active_block", "down");
            break;
        case this.spaceKey:
            connection.sendAction("move_active_block", "hard_drop");
            break;
        case this.specialKey:
            connection.sendAction("special1");
            break;
/*
        case this.special2Key:
            connection.sendAction("special2");
            break;
        case this.special3Key:
            connection.sendAction("special3");
            break;
        case this.special4Key:
            connection.sendAction("special4");
            break;
        case this.special5Key:
            connection.sendAction("special5");
            break;
        case this.testKey:
            connection.sendAction("test");
            break;
*/
    }
};

game.states.addState(myState, true);

