/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, BlueLevel: false, Camera: false, Renderable: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

this.SmallCamera = null;

function MyGame() {
     // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/MyGame_cue.wav";
    
    // game data
    this.levelData = null;
    this.sceneSquares = null;
    // The camera to view the scene
    this.mCamera = null;
    this.mcXPos = null;
    this.mcYPos = null;
    this.mcWidthD = null;
    this.mcWdith = null;
    this.mcVXPos = null;
    this.mcVYPos = null;
    this.mcVXSize = null;
    this.mcVYSize = null;
    this.mcColor = null;
    
    this.smallCamera = null;
    this.scXPos = null;
    this.scYPos = null;
    this.scDelta = null;
    this.scFDelta = null;
    this.fastDelta = null;
    // the hero and the support objects
    this.whiteMover = null;
    this.redSpinner = null;
    
    this.greyScene = null;
    
    // for UI
    this.lastUIUpdate = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    // loads the audios
    //dwdwgEngine.AudioClips.loadAudio(this.kBgClip);
    //gEngine.AudioClips.loadAudio(this.kCue);
    
    // load json method
    gEngine.TextFileLoader.loadTextFile("assets/scene.json", 1);
};

// helper method to load json

MyGame.prototype.unloadScene = function() {
    //gEngine.ResourceMap.unloadAsset("MyGameLevel");
    //gEngine.ResourceMap.asyncLoadRequested(MyGameLevel);
    var scCam = this.smallCamera;
    this.SmallCamera = this.smallCamera;
    gEngine.ResourceMap.unloadAsset("scCam");
    gEngine.ResourceMap.storeAsset("scCam", scCam);
    
    // Step A: Game loop not running, unload all assets
    // stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene resources
    // gEngine.AudioClips.unloadAudio(this.kBgClip);
    //      You know this clip will be used elsewhere in the game
    //      So you decide to not unload this clip!!
    gEngine.AudioClips.unloadAudio(this.kCue);

    // Step B: starts the next level
    // starts the next level
    
    var nextLevel  = new BlueLevel();
    gEngine.Core.startScene(nextLevel);
};

MyGame.prototype.initialize = function () {
    //testing
    var jsonFile = gEngine.ResourceMap.retrieveAsset("assets/scene.json");
    this.levelData = JSON.parse(jsonFile);

    // main camera
    this.mcXPos = this.levelData.Camera.Center[0];
    this.mcYPos = this.levelData.Camera.Center[1];
    this.mcWidthD = this.levelData.Camera.Width;
    this.mcWdith = this.mcWidthD;
    this.mcVXPos = this.levelData.Camera.Viewport[0];
    this.mcVYPos = this.levelData.Camera.Viewport[1];
    this.mcVXSize = this.levelData.Camera.Viewport[2];
    this.mcVYSize = this.levelData.Camera.Viewport[3];
    this.mcColor = this.levelData.Camera.BgColor;

    this.mCamera = new Camera(
        vec2.fromValues( this.mcXPos, this.mcYPos),   // position of the camera
        this.mcWdith,                        // width of camera
        [this.mcVXPos, this.mcVYPos, this.mcVXSize,  this.mcVYSize]         // viewport (orgX, orgY, width, height)
        );

    this.mCamera.setBackgroundColor(this.mcColor);

    if(!gEngine.ResourceMap.isAssetLoaded("scCam")){
        this.scXPos = 20;
        this.scYPos = 40;
        
        this.smallCamera = new Camera(
            vec2.fromValues(20, 60),
            10,
            [this.scXPos, this.scYPos, 100, 100] 
            );
    }else{
        this.smallCamera = gEngine.ResourceMap.retrieveAsset("scCam");
        this.scXPos = this.smallCamera.getViewport()[0];
        this.scYPos = this.smallCamera.getViewport()[1];
    }
    this.scDelta = 1;
    this.scFDelta = 5;
    this.fastDelta = false;
            // sets the background to gray
    //document.getElementById("curserPosID").innerHTML = JSON.stringify(this.levelData.Square);
    // for UI updates
    this.lastUIUpdate = 0;
    
    
    var scColor = hexToRgb("06D6A0");
    this.smallCamera.setBackgroundColor([scColor.r, scColor.g, scColor.b, scColor.a]);  
    // Step B: Create the support object in red
    this.redSpinner = new Renderable(gEngine.DefaultResources.getConstColorShader());
    var rsc = hexToRgb("EF476F");
    this.redSpinner.setColor([rsc.r, rsc.g, rsc.b, rsc.a]);
    this.redSpinner.getXform().setPosition(20, 60);
    this.redSpinner.getXform().setSize(2, 10);

    // Setp C: Create the hero object in blue
    this.whiteMover = new Renderable(gEngine.DefaultResources.getConstColorShader());
    this.whiteMover.setColor([1, 1, 1, 1]);
    this.whiteMover.getXform().setPosition(20, 60);
    this.whiteMover.getXform().setSize(2, 3);

    // scene squares
    this.sceneSquares = [];
    for(var i = 0; i < this.levelData.Square.length; i++){
        var s = this.levelData.Square[i];
        var square = new Renderable(gEngine.DefaultResources.getConstColorShader());
        square.setColor(s.Color);
        square.getXform().setPosition(s.Pos[0], s.Pos[1]);
        square.getXform().setRotationInDegree(s.Rotation);
        square.getXform().setSize(s.Width, s.Height);
        this.sceneSquares.push(square);
    }
    
    this.redSpinner =  this.sceneSquares[1];
    this.whiteMover =  this.sceneSquares[0];
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        
    // draw order VVVV
    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();
    
    this.redSpinner.draw(this.mCamera.getVPMatrix());
    this.whiteMover.draw(this.mCamera.getVPMatrix());
    // draw square objects
    for(var i = 2; i < this.sceneSquares.length; i++){
        this.sceneSquares[i].draw(this.mCamera.getVPMatrix());
    }
    
    if(this.smallCamera){
        this.smallCamera.setupViewProjection();
        // Step  C: draw everything
        this.redSpinner.draw(this.smallCamera.getVPMatrix());
        this.whiteMover.draw(this.smallCamera.getVPMatrix());
    }
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    
    // spin red
    var rot = this.redSpinner.getXform().getRotationInDegree();
    rot < 360 ? rot += (360 / (5 * 60)) : rot = 0; // 60 is fps
    this.redSpinner.getXform().setRotationInDegree(rot);
    
    // move white
    var pos = this.whiteMover.getXform().getXPos();
    var limitRight = this.mcXPos + (this.mcWdith / 2);
    var limitLeft = this.mcXPos - (this.mcWdith / 2);
    pos < limitRight ? pos += (20 / (3 * 60)) : pos = limitLeft;
    this.whiteMover.getXform().setPosition(pos, 60);
    
    // main camera
    // B: move main camera right
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.B)) {
        //if (this.mcXPos  > this.mcVXSize) // this is the right-bound of the window
            //this.mcXPos = 20;
       this.mcXPos += 1;
    }
    // C: move main camera left
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.C)) {
        //if (this.mcXPos  < 20) // this is the right-bound of the window
            //this.mcXPos = this.mcVXSize;
        this.mcXPos -= 1;
    }
    // F: move main camera up
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.F)) {
        //if (this.mcYPos  > this.mcVYSize) // this is the right-bound of the window
            //this.mcYPos = 40;
        this.mcYPos += 1;
    }
    // V: move main camera down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.V)) {
        //if (this.scYPos  < 40) // this is the right-bound of the window
            //this.scYPos = this.mcVYSize;
        this.mcYPos -= 1;
    }
    // Z: Zoom out
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)){
        this.mcWdith < 150 ? this.mcWdith += 5 : this.mcWdith = 150;
    }
    // X: Zoom in
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.X)){
        this.mcWdith >= 5 ? this.mcWdith -= 5 : this.mcWdith = 5;
    }
    // R: Reset Camera
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.R)){
        this.mcWdith = this.mcWidthD;
    }
    
    // small camera
    // T: Fast Mode
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.T)){
        this.fastDelta = !this.fastDelta;
    }
    var delta;
    this.fastDelta ? delta = this.scFDelta : delta = this.scDelta;
    // D: move small camera right
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (this.scXPos  > this.mcVXSize) // this is the right-bound of the window
            this.scXPos = 20;
        this.scXPos += delta;
    }
    // A: move small camera left
    if (gEngine.Input.onKeyReleased(gEngine.Input.keys.A)) {
        if (this.scXPos  < 20) // this is the right-bound of the window
            this.scXPos = this.mcVXSize;
        this.scXPos -= delta * 5;
    }
    // W: move small camera up
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if (this.scYPos  > this.mcVYSize) // this is the right-bound of the window
            this.scYPos = 40;
        this.scYPos += delta;
    }
    // S: move small camera down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (this.scYPos  < 40) // this is the right-bound of the window
            this.scYPos = this.mcVYSize;
        this.scYPos -= delta;
    }
    
    // update cameras
    // update small camera
    this.smallCamera.setViewport([this.scXPos, this.scYPos, 100, 100]);
    // update main camera
    this.mCamera.setWCCenter(this.mcXPos, this.mcYPos);
    this.mCamera.setWCWidth(this.mcWdith);
    
    // update UI text
    if(Date.now() - this.lastUIUpdate > 100){
        this.lastUIUpdate = Date.now();
        document.getElementById("cursorXID").innerHTML = this.scXPos;
        document.getElementById("cursorYID").innerHTML = this.scYPos;
        document.getElementById("fastMode").innerHTML = this.fastDelta;
        document.getElementById("whiteXID").innerHTML = pos.toFixed(1);
        document.getElementById("whiteYID").innerHTML = this.whiteMover.getXform().getYPos();
        document.getElementById("redRotID").innerHTML = this.redSpinner.getXform().getRotationInDegree().toFixed(0);
        document.getElementById("mcWidthID").innerHTML = this.mcWdith;
        document.getElementById("mcXposID").innerHTML = this.mcXPos;
        document.getElementById("mcYposID").innerHTML = this.mcYPos;
    }
    
    
    // Q: Change scene TODO
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        //this.unloadScene();
        gEngine.GameLoop.stop();
    }
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: 1
  } : null;
}