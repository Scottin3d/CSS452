/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    var mTriangleVertexBuffer = null;
    var mCircleVertexBuffer = null;

    // First: define the vertices for a square
    var verticesOfSquare = [
        1, 1, 0.0,
        0, 1, 0.0,
        1, 0, 0.0,
        0, 0, 0.0
    ];
    
    // triangle
    var verticesOfTriangle = [
        0, 0, 0,
        0.5, 1, 0,
        1, 0, 0
    ];
    
    var rootTwo = Math.sqrt(2);
    
    // circle
    var verticesOfCircle = [
        0,0,0,
        0, 1, 0,
        rootTwo / 2, rootTwo / 2, 0, 
        1, 0, 0,
        rootTwo / 2, rootTwo / -2, 0,
        0, -1, 0,
        rootTwo / -2, rootTwo / -2, 0,
        -1, 0, 0,
        rootTwo / -2, rootTwo / 2, 0
        
    ];
    
    var vertices = null;
    const totalPoints = 20;
    var j = 0;
    /*
    for (let i = 0; i <= totalPoints; i++) {
       const angle= 2 * Math.PI * i / totalPoints;
       const x =  1 * Math.cos(angle);
       const y =  1 * Math.sin(angle);
       vertices.push(x, y);
       vertices[j] = x;
       vertices[j + 1] = y;
       vertices[j + 2] = 0;
       j += 3;
    }
    */
    
    var initialize = function () {
        // pass in a variable for shape?
        
        var gl = gEngine.Core.getGL();

        // square
        // Step A: Create a buffer on the gGL context for our vertex positions
        mSquareVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        
        
        // triangle
        // Step A: Create a buffer on the gGL context for our vertex positions
        mTriangleVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mTriangleVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfTriangle), gl.STATIC_DRAW);
        
        
        // circle
        // Step A: Create a buffer on the gGL context for our vertex positions
        mCircleVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mCircleVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfCircle), gl.STATIC_DRAW);
         
    };

    var getGLVertexRef = function () {
        
        return mSquareVertexBuffer;
    };
    
    var getGLVertexRefTriangle = function () { 
        
        return mTriangleVertexBuffer; 
    };
    
    var getGLvertexRefCircle = function () { 
        
        return mCircleVertexBuffer; 
    };


    var mPublic = {
        initialize: initialize,
        getGLVertexRef: getGLVertexRef,
        getGLVertexRefTriangle: getGLVertexRefTriangle,
        getGLvertexRefCircle: getGLvertexRefCircle
    };

    return mPublic;
}());