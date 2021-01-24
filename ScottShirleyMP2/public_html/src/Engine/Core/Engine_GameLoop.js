/*
 * File: EngineCore_Loop.js 
 * Implements the game loop functionality of gEngine
 */
/*jslint node: true, vars: true */
/*global gEngine: false, requestAnimationFrame: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

gEngine.GameLoop = (function () {
    var kFPS = 60;          // Frames per second
    var kMPF = 1000 / kFPS; // Milliseconds per frame.

    // Variables for timing gameloop.
    var mPreviousTime = Date.now();
    var mLagTime;
    
    
    // The current loop state (running or should stop)
    var mIsLoopRunning = false;

    var mMyGame = null;

    // This function assumes it is sub-classed from MyGame
    var _runLoop = function () {
        if (mIsLoopRunning) {
            var uperd = 0;
            // Step A: set up for next call to _runLoop and update input!
            requestAnimationFrame(function () { _runLoop.call(mMyGame); });

            // Step B: compute how much time has elapsed since we last RunLoop was executed
            var currentTime = Date.now();
            var elapsedTime = currentTime - mPreviousTime;
            mPreviousTime = currentTime;
            mLagTime += elapsedTime;
            
            var fps = 1000 / elapsedTime;
            
            
            
            // Step C: Make sure we update the game the appropriate number of times.
            //      Update only every Milliseconds per frame.
            //      If lag larger then update frames, update until caught up.
            
            while ((mLagTime >= kMPF) && mIsLoopRunning) {
                gEngine.Input.update();
                this.update();      // call MyGame.update()
                uperd++;
                mLagTime -= kMPF;
            }
            
            if(Date.now() - this.lastUpdate > 500){
                document.getElementById('fpsID').innerHTML = "FPS: " + fps.toFixed(0);
                document.getElementById('lagID').innerHTML = "Lag Time: " + mLagTime.toFixed(2) + " ms";
                document.getElementById('drawTimeID').innerHTML = "Time to update/ draw: " + (this.updateDrawEnd - this.updateDrawStart).toFixed(0) + " ms";
                document.getElementById('uperdID').innerHTML = "Number of Updates() Calls per Draw(): " + uperd;
                this.lastUpdate = Date.now();
            } 
            this.updateDrawStart = Date.now();
            // Step D: now let's draw
            this.draw();    // Call MyGame.draw()
            this.updateDrawEnd = Date.now();
            
        }
    };

    // update and draw functions must be set before this.
    var start = function (myGame) {
        mMyGame = myGame;

        // Step A: reset frame time 
        mPreviousTime = Date.now();
        mLagTime = 0.0;

        // Step B: remember that loop is now running
        mIsLoopRunning = true;

        // Step C: request _runLoop to start when loading is done
        requestAnimationFrame(function () { _runLoop.call(mMyGame); });
    };

    // No Stop or Pause function, as all input are pull during the loop
    // once stopped, tricky to start the loop
    // You should implement pausing of game in game update.

    var mPublic = {
        start: start
    };
    return mPublic;

}());