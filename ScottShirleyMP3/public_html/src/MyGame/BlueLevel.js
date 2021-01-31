/*
 * File: BlueLevel.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, Scene: false, MyGame: false, SceneFileParser: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function BlueLevel() {
    // audio clips: supports both mp3 and wav formats
    this.kBgClip = "assets/sounds/BGClip.mp3";
    this.kCue = "assets/sounds/BlueLevel_cue.wav";

    // scene file name
    this.kSceneFile = "assets/BlueLevel.xml";
    // all squares
    this.mSqSet = [];        // these are the Renderable objects

    // The camera to view the scene
    this.mCamera = null;
    this.mcXPos = null;
    this.mcYPos = null;
    this.mcWidthD = null;
    this.mcWidth = null;
    this.mcVXPos = null;
    this.mcVYPos = null;
    this.mcVXSize = null;
    this.mcVYSize = null;
    this.mcColor = null;
    
    // small camera
    this.smallCamera = null;
    this.scXPos = null;
    this.scYPos = null;
    this.scDelta = null;
    this.scFDelta = null;
    this.fastDelta = null;
    
    this.redSpinner = null;
    this.whiteMover = null;
    
    this.lastUIUpdate = null;
}
gEngine.Core.inheritPrototype(BlueLevel, Scene);

BlueLevel.prototype.loadScene = function () {
    // load the scene file
    
    gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eXMLFile);

    // loads the audios
    gEngine.AudioClips.loadAudio(this.kBgClip);
    gEngine.AudioClips.loadAudio(this.kCue);
};

BlueLevel.prototype.unloadScene = function () {
    // stop the background audio
    gEngine.AudioClips.stopBackgroundAudio();
    
    var scCam = this.smallCamera;
    this.SmallCamera = this.smallCamera;
    gEngine.ResourceMap.unloadAsset("scCam");
    gEngine.ResourceMap.storeAsset("scCam", scCam);

    // unload the scene flie and loaded resources
    gEngine.TextFileLoader.unloadTextFile(this.kSceneFile);
    gEngine.AudioClips.unloadAudio(this.kBgClip);
    gEngine.AudioClips.unloadAudio(this.kCue);

    var newLevel = new MyGame();
    gEngine.Core.startScene(newLevel);
};

BlueLevel.prototype.initialize = function () {
    this.lastUIUpdate = 0;
    var sceneParser = new SceneFileParser(this.kSceneFile);

    // Step A: Read in the camera
    this.mCamera = sceneParser.parseCamera();
    
    this.mcXPos = this.mCamera.getWCCenter()[0];
    this.mcYPos = this.mCamera.getWCCenter()[1];
    this.mcWidthD = this.mCamera.mWCWidth;
    this.mcWidth = this.mcWidthD;
    this.mcVXPos = this.mCamera.getViewport()[0];
    this.mcVYPos = this.mCamera.getViewport()[1];
    this.mcVXSize = this.mCamera.getViewport()[2];
    this.mcVYSize = this.mCamera.getViewport()[3];
    this.mcColor = this.mCamera.getBackgroundColor();
    
    // Step B: Read all the squares
    sceneParser.parseSquares(this.mSqSet);

    // now start the bg music ...
    gEngine.AudioClips.playBackgroundAudio(this.kBgClip);
   
    this.whiteMover = this.mSqSet[0];
    this.redSpinner = this.mSqSet[1];
    
    
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
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
BlueLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();
    //this.redSpinner.draw(this.mCamera.getVPMatrix());
    //this.whiteMover.draw(this.mCamera.getVPMatrix());
    // Step  C: draw all the squares
    var i;
    for (i = 0; i < this.mSqSet.length; i++) {
        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
        
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
BlueLevel.prototype.update = function () {
    // spin red
    var rot = this.redSpinner.getXform().getRotationInDegree();
    rot < 360 ? rot += (360 / (5 * 60)) : rot = 0; // 60 is fps
    this.redSpinner.getXform().setRotationInDegree(rot);
    
    // move white
    var pos = this.mSqSet[0].getXform().getXPos();
    var limitRight = this.mcXPos + (this.mcWidth / 2);
    var limitLeft = this.mcXPos - (this.mcWidth / 2);
    pos < limitRight ? pos += (20 / (3 * 60)) : pos = limitLeft;
    this.mSqSet[0].getXform().setPosition(pos, this.mcYPos);
    
    
    
    // For this very simple game, let's move the first square
    var xform = this.mSqSet[1].getXform();
    var deltaX = 0.05;

    /// Move right and swap ovre
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        gEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(deltaX);
        if (xform.getXPos() > 30) { // this is the right-bound of the window
            xform.setPosition(12, 60);
        }
    }

    // Step A: test for white square movement
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        gEngine.AudioClips.playACue(this.kCue);
        xform.incXPosBy(-deltaX);
        if (xform.getXPos() < 11) { // this is the left-boundary
            gEngine.GameLoop.stop();
        }
    }
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
        this.mcWidth < 150 ? this.mcWidth += 5 : this.mcWidth = 150;
    }
    // X: Zoom in
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.X)){
        this.mcWidth >= 5 ? this.mcWidth -= 5 : this.mcWidth = 5;
    }
    // R: Reset Camera
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.R)){
        this.mcWidth = this.mcWidthD;
    }
    
    // small camera
    // T: Fast Mode
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.T)){
        this.fastDelta = !this.fastDelta;
    }
    var delta;
    this.fastDelta ? delta = this.scFDelta : delta = this.scDelta;
    var viewport = this.mCamera.getViewport();
    // D: move small camera right
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (this.scXPos  > viewport[2]) // this is the right-bound of the window
            this.scXPos = 20;
        this.scXPos += delta;
    }
    // A: move small camera left
    if (gEngine.Input.onKeyReleased(gEngine.Input.keys.A)) {
        if (this.scXPos  < 20) // this is the right-bound of the window
            this.scXPos = viewport[2];
        this.scXPos -= delta * 5;
    }
    // W: move small camera up
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if (this.scYPos  > viewport[3]) // this is the right-bound of the window
            this.scYPos = 40;
        this.scYPos += delta;
    }
    // S: move small camera down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (this.scYPos  < 40) // this is the right-bound of the window
            this.scYPos = viewport[3];
        this.scYPos -= delta;
    }
    
    // update main camera
    this.mCamera.setWCWidth(this.mcWidth);
    
    this.smallCamera.setViewport([this.scXPos, this.scYPos, 100, 100]);
    
    if(Date.now() - this.lastUIUpdate > 100){
        this.lastUIUpdate = Date.now();
        document.getElementById("cursorXID").innerHTML = this.scXPos;
        document.getElementById("cursorYID").innerHTML = this.scYPos;
        document.getElementById("fastMode").innerHTML = this.fastDelta;
        document.getElementById("whiteXID").innerHTML = pos.toFixed(1);
        document.getElementById("whiteYID").innerHTML = this.whiteMover.getXform().getYPos();
        document.getElementById("redRotID").innerHTML = this.redSpinner.getXform().getRotationInDegree().toFixed(0);
        document.getElementById("mcWidthID").innerHTML = this.mcWidth;
        document.getElementById("mcXposID").innerHTML = this.mcXPos;
        document.getElementById("mcYposID").innerHTML = this.mCamera.getWCCenter()[1];
    }
    
    // Q: Change scene TODO
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        //this.unloadScene();
        gEngine.GameLoop.stop();
    }
};