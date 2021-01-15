/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine: false, SimpleShader: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame(htmlCanvasID) {
    // The shader for drawing
    this.mShader = null;

    // Step A: Initialize the webGL Context and the VertexBuffer
    gEngine.Core.initializeWebGL(htmlCanvasID);

    // Step B: Create, load and compile the shaders
    this.mShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",        // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");       // Path to the FragmentShader

    // Step C: Draw!
    // Step C1: Clear the canvas
    
    gEngine.Core.clearCanvas([0, 0.8, 0, 1]);
    var color = [0, 0, 1, 0.1];
    var offset = [-0.9, 0.75];
    var scale = [0.1, 0.1];
    var count = 5;
    var shapeCount = 4;
    for(var i = 0; i < shapeCount; i++){
        for (var j = 0; j < count; j++) {
            this.mShader.activateShader(i, color, offset, scale);
            if(i==3){
                this.mShader.activateShader(i+1, [0,0,1, color[3]], offset, scale);
            }
            scale = GetRand();
            offset[0] += 0.3;
            color[3] += .2;
        }
        color = [i, (i+1)%2, 0, 0.1];
        offset[0] = -0.9;
        offset[1] -= 0.25;
    }
    
    /*
    // Step C2: Activate the proper shader
    for (var i = 0; i < count; i++) {
        this.mShader.activateShader(0, color, offset, scale);
        scale = GetRand();
        offset[0] += 0.3;
        color[3] += .2;
    }
    
    // triangle
    color = [1, 0, 0, 0.1];
    offset = [-0.9, 0.25]
    for (var i = 0; i < count; i++) {
        this.mShader.activateShader(1, color, offset, scale);
        scale = GetRand();
        offset[0] += 0.3;
        color[3] += .2;
    }
    
    // circle
    color = [0, 1, 0, 0.1];
    offset = [-0.9, -0.5]
    for (var i = 0; i < count; i++) {
        this.mShader.activateShader(2, color, offset, scale);
        scale = GetRand();
        offset[0] += 0.3;
        color[3] += .2;
    }
    */
   
    // Step C3: Draw with the currently activated geometry and the activated shader
    var gl = gEngine.Core.getGL();
}

function GetRand(){
    var x = (Math.random() + 0.1) * 0.25;
    var y = (Math.random() + 0.1) * 0.25;
    return [x, y];
    
}

