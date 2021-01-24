/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false, Renderable: false, Camera: false, mat4: false, vec3: false, vec2: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID) {
    this.deleteMode = false;
    this.lastDelete = null;
    this.lastCreated = null;
    
    this.updateDrawStart = null;
    this.updateDrawEnd = null;
    
    // variables of the constant color shader
    this.mConstColorShader = null;
    
    // display object array
    this.displayObjects = [];
    
    // curser TODO
    this.curserCube = null;
    
    // text variables
    this.lastUpdate = null;
    
    this.mRedSq = null;

    // The camera to view the scene
    this.mCamera = null;
    
    // Initialize the webGL Contextlast
    gEngine.Core.initializeEngineCore(htmlCanvasID);

    // Initialize the game
    this.initialize();
}

MyGame.prototype.initialize = function () {
    this.lastDelete = 0;
    this.lastCreated = 0;
    this.displayObjects = [];
    this.lastUpdate = 0;
    
    
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(0, 0),   // position of the camera
        100,                        // width of camera
        [20, 40, 600, 300]         // viewport (orgX, orgY, width, height)
        );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

    // Step  B: create the shader
    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the Simple FragmentShader  
        
    // curser
    this.curserCube = new Renderable(this.mConstColorShader);   
    this.curserCube.setColor([1,0,0,1]);
    this.curserCube.getXform().setPosition(0, 0);
    this.curserCube.getXform().setSize(1, 1);
   
    // Step F: Start the game loop running
    gEngine.GameLoop.start(this);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  D: Activate the curser
    this.curserCube.draw(this.mCamera.getVPMatrix());
    
    for(var i = 0; i < this.displayObjects.length; i++){
        var obj = this.displayObjects[i].GetObjects();
        for(var j = 0; j < obj.length; j++){
            obj[j].draw(this.mCamera.getVPMatrix());
        }
    }
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    // For this very simple game, let's move the white square and pulse the red
    var curserXform = this.curserCube.getXform();
    var delta = 0.5;
    
    
    
    if(this.deleteMode){
        if(this.displayObjects.length < 2){
            this.deleteMode = ! this.deleteMode;
            this.displayObjects.pop();
        }else{
            
            var dt =  (this.displayObjects[this.displayObjects.length - 1].GetCreateTime() - (Date.now() - this.lastDelete)) / 1000;
            var nextDelete = this.displayObjects[this.displayObjects.length - 1].GetCreateTime();
           
            if(Date.now() - this.lastDelete > nextDelete){
                this.lastDelete = Date.now();
                this.displayObjects.pop();
            }
        }
    }
    
    document.getElementById('nextDID').innerHTML = "Next item deleted in: " + dt;
    // delete mode
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.D)) {
        this.deleteMode = !this.deleteMode;
        this.lastDelete = Date.now();
        this.displayObjects.pop();
    }
    
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        if(!this.deleteMode){
            var createTime = Date.now() - this.lastCreated;
            this.lastCreated = Date.now();
            var n = new displayObject();
            n.Create(this.mConstColorShader, curserXform.getPosition(), createTime);
            this.displayObjects.push(n); 
        }
    }
    
    // TODO switch
    // right
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if (curserXform.getXPos() > 50) // this is the right-bound of the window
            curserXform.setPosition(-50, curserXform.getYPos());
        curserXform.incXPosBy(delta);
    }
    
    // left
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if (curserXform.getXPos() < -50) // this is the right-bound of the window
            curserXform.setPosition(50, curserXform.getYPos());
        curserXform.incXPosBy(-delta);
    }

    // up
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if (curserXform.getYPos() > 25) // this is the right-bound of the window
            curserXform.setPosition(curserXform.getXPos(), -25);
        curserXform.incYPosBy(delta);
    }
    
    // down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if (curserXform.getYPos() < -25) // this is the right-bound of the window
            curserXform.setPosition(curserXform.getXPos(), 25);
        curserXform.incYPosBy(-delta);
    }
    
    // delete mode
    document.getElementById('deleteID').innerHTML = "Delete Mode: " + this.deleteMode;
    
    // get number of objs
    document.getElementById('totNumObjs').innerHTML = "Total Number of Objects: " + CalcNumObjs(this);
    
    // update curser coordinates
    document.getElementById('curserPosID').innerHTML = "X: " + curserXform.getXPos().toFixed(2) + ", Y: " + curserXform.getYPos().toFixed(2);
};

function CalcNumObjs(MyGame){
    var numObjs = 0;
    for(var i = 0; i < MyGame.displayObjects.length; i++){
        numObjs += MyGame.displayObjects[i].GetCount();
    }
    return numObjs;
}