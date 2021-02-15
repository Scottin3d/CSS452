/* 
 * The template for a ZoomedView.
 */

"use strict";

// Constructor
function ZoomedView(interactiveObj) {

    // The camera to view the scene
    this.mCameraTop = null;
    this.mCameraLeft = null;
    this.mCameraRight = null;
    this.mCameraBot = null;

    this.mInteractiveObject = interactiveObj;
    this.mBoundWidth = interactiveObj.getBoundXForm().getWidth() / 2;
    var sqArr = interactiveObj.getAllSqXForm();
    this.mTopSqPos = sqArr[0];
    this.mBotSqPos = sqArr[1];
    this.mLeftSqPos = sqArr[2];
    this.mRightSqPos = sqArr[3];
    this._initialize();
};


ZoomedView.prototype._initialize = function () {
    // Step A: set up the cameras
    this.mCameraTop = new Camera(
        vec2.fromValues(this.mTopSqPos.getXPos(), this.mTopSqPos.getYPos()),
        this.mBoundWidth,
        [63.5, 297, 125, 145]
    );
    this.mCameraTop.setBackgroundColor([1, 1, 1, 1]);

    this.mCameraLeft = new Camera(
        vec2.fromValues(this.mLeftSqPos.getXPos(), this.mLeftSqPos.getYPos()),
        this.mBoundWidth,
        [3, 150, 125, 145]
    );
    this.mCameraLeft.setBackgroundColor([1, 1, 1, 1]);

    this.mCameraRight = new Camera(
        vec2.fromValues(this.mRightSqPos.getXPos(), this.mRightSqPos.getYPos()),
        this.mBoundWidth,
        [131, 150, 125, 145]
    );
    this.mCameraRight.setBackgroundColor([1, 1, 1, 1]);

    this.mCameraBot = new Camera(
        vec2.fromValues(this.mBotSqPos.getXPos(), this.mBotSqPos.getYPos()),
        this.mBoundWidth,
        [63.5, 3, 125, 145]
    );
    this.mCameraBot.setBackgroundColor([1, 1, 1, 1]);
};

//---------------------------------------DRAW------------------------------------
ZoomedView.prototype.drawTop = function () {
    this.mCameraTop.setupViewProjection();
    return this.mCameraTop;
};

ZoomedView.prototype.drawBot = function () {
    this.mCameraBot.setupViewProjection();
    return this.mCameraBot;
};

ZoomedView.prototype.drawLeft = function () {
    this.mCameraLeft.setupViewProjection();
    return this.mCameraLeft;

};

ZoomedView.prototype.drawRight = function () {
    this.mCameraRight.setupViewProjection();
    return this.mCameraRight;
};


//---------------------------------------UPDATE------------------------------------
ZoomedView.prototype.updateCamPos = function (interactiveObj) {
    var sqArr = interactiveObj.getAllSqXForm();
    this.mTopSqPos = sqArr[0];
    this.mBotSqPos = sqArr[1];
    this.mLeftSqPos = sqArr[2];
    this.mRightSqPos = sqArr[3];
    this.mCameraTop.setWCCenter(this.mTopSqPos.getXPos(), this.mTopSqPos.getYPos());
    this.mCameraRight.setWCCenter(this.mRightSqPos.getXPos(), this.mRightSqPos.getYPos());
    this.mCameraBot.setWCCenter(this.mBotSqPos.getXPos(), this.mBotSqPos.getYPos());
    this.mCameraLeft.setWCCenter(this.mLeftSqPos.getXPos(), this.mLeftSqPos.getYPos());
};

ZoomedView.prototype.scaleCam = function (interactiveObj) {
    this.mBoundWidth = interactiveObj.getBoundXForm().getWidth() / 2;
    this.mCameraTop.setWCWidth(this.mBoundWidth);
    this.mCameraBot.setWCWidth(this.mBoundWidth);
    this.mCameraRight.setWCWidth(this.mBoundWidth);
    this.mCameraLeft.setWCWidth(this.mBoundWidth);
};
