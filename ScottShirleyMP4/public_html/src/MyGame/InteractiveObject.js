/*
 * File: InteractiveObject.js
 *  
 * Texture objects where texture coordinate can change
 */
// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function InteractiveObject() {
    // textures: 
    //this.kBoundImage = "assets/bounds.png";
    this.mBoundImage = null;

    this.topSquare = null;
    this.topSquareCC = null;
    this.rightSquare = null;
    this.rightSquareCC = null;
    this.leftSquare = null;
    this.leftSquareCC = null;
    this.bottomSquare = null;
    this.bottomSquareCC = null;
}

/**
 * Public Methods
 */
InteractiveObject.prototype.draw = function (option, vpMatrix) {
    // set boundary for the marker
    if (option === 1) {
        var xForm = this.mBoundImage.getXform();
        this._setBoundSqPos(xForm, xForm.getXPos(), xForm.getYPos());
    }
    // Draw boundary
    this.mBoundImage.draw(vpMatrix);

    if (option === 1) {
        // Draw 4 bound marker
        this.topSquare.draw(vpMatrix);
        this.topSquareCC.draw(vpMatrix);
        this.rightSquare.draw(vpMatrix);
        this.rightSquareCC.draw(vpMatrix);
        this.leftSquare.draw(vpMatrix);
        this.leftSquareCC.draw(vpMatrix);
        this.bottomSquare.draw(vpMatrix);
        this.bottomSquareCC.draw(vpMatrix);
    }
};

InteractiveObject.prototype.initialize = function (option, xPos, yPos, w, h) {
    if (option === 1) {
        // Init Bound
        this._initBound();
        // Init 4 corner square
        this._initBoundarySq();
        // set boundary for the marker
        var xForm = this.mBoundImage.getXform();
        this._setBoundSqPos(xForm, xForm.getXPos(), xForm.getYPos());
    } else {
        // Init Bound
        this._initBoundOnly(xPos, yPos, w, h);
    }
}


//---get-fucntions
InteractiveObject.prototype.getBoundXForm = function () {
    return this.mBoundImage.getXform();
}

InteractiveObject.prototype.getBound = function () {
    return this.mBoundImage;
}

InteractiveObject.prototype.getBoundTopSqPos = function () {
    return this.topSquare.getXform().getYPos();
}

InteractiveObject.prototype.getBoundBotSqPos = function () {
    return this.bottomSquare.getXform().getYPos();
}

InteractiveObject.prototype.getBoundLeftSqPos = function () {
    return this.leftSquare.getXform().getXPos();
}

InteractiveObject.prototype.getBoundRightSqPos = function () {
    return this.rightSquare.getXform().getXPos();
}

InteractiveObject.prototype.getAllSqXForm = function () {
    var sqArr = [];
    sqArr.push(this.topSquare.getXform());
    sqArr.push(this.bottomSquare.getXform());
    sqArr.push(this.leftSquare.getXform());
    sqArr.push(this.rightSquare.getXform());
    return sqArr;
}

//---set-functions
InteractiveObject.prototype.incBoundXPos = function (delta) {
    this.mBoundImage.getXform().incXPosBy(delta);
}

InteractiveObject.prototype.incBoundYPos = function (delta) {
    this.mBoundImage.getXform().incYPosBy(delta);
}

InteractiveObject.prototype.incBoundSize = function (delta) {
    if (this.mBoundImage.getXform().getWidth() > 0) {
        this.mBoundImage.getXform().incSizeBy(delta);
        return;
    }

    if ((this.mBoundImage.getXform().getWidth() <= 0)
        && delta > 0) {
        this.mBoundImage.getXform().incSizeBy(delta);
        return;
    }
}

InteractiveObject.prototype.setBoundHeight = function (delta) {
    if (this.mBoundImage.getXform().getHeight() > 0) {
        this.mBoundImage.getXform().incHeightBy(delta);
        return;
    }

    if ((this.mBoundImage.getXform().getHeight() <= 0)
        && delta > 0) {
        this.mBoundImage.getXform().incHeightBy(delta);
        return;
    }
}


InteractiveObject.prototype.setBoundWidth = function (delta) {
    if (this.mBoundImage.getXform().getWidth() > 0) {
        this.mBoundImage.getXform().incWidthBy(delta);
        return;
    }

    if ((this.mBoundImage.getXform().getWidth() <= 0)
        && delta > 0) {
        this.mBoundImage.getXform().incWidthBy(delta);
        return;
    }
}

//---boundary-of-movable-object
InteractiveObject.prototype._initBound = function () {
    this.mBoundImage = new SpriteRenderable(boundSprite);
    var c = hexToRgb("FFFFFF");
    this.mBoundImage.setColor([c.r, c.g, c.b, c.a]);
    this.mBoundImage.getXform().setPosition(60, 42);
    this.mBoundImage.getXform().setSize(28, 25);
}

InteractiveObject.prototype._initBoundOnly = function (xPos, yPos, w, h) {
    this.mBoundImage = new SpriteRenderable(boundSprite);
    var c = hexToRgb("7F8B4F");
    this.mBoundImage.setColor([c.r, c.g, c.b, c.a]);
    this.mBoundImage.getXform().setPosition(xPos, yPos);
    this.mBoundImage.getXform().setSize(w, h);
}

InteractiveObject.prototype._initBoundarySq = function () {
    var c = hexToRgb("FFD500");
    this.topSquare = new Renderable(this.mConstColorShader);
    this.topSquare.setColor([c.r, c.g, c.b, c.a]);
    this.topSquare.getXform().setSize(2, 2);
    c = hexToRgb("00509D");
    this.topSquareCC = new Renderable(this.mConstColorShader);
    this.topSquareCC.setColor([c.r, c.g, c.b, c.a]);
    this.topSquareCC.getXform().setSize(1, 1);
    c = hexToRgb("FFD500");
    this.rightSquare = new Renderable(this.mConstColorShader);
    this.rightSquare.setColor([c.r, c.g, c.b, c.a]);
    this.rightSquare.getXform().setSize(2, 2);
    c = hexToRgb("00509D");
    this.rightSquareCC = new Renderable(this.mConstColorShader);
    this.rightSquareCC.setColor([c.r, c.g, c.b, c.a]);
    this.rightSquareCC.getXform().setSize(1, 1);
    c = hexToRgb("FFD500");
    this.leftSquare = new Renderable(this.mConstColorShader);
    this.leftSquare.setColor([c.r, c.g, c.b, c.a]);
    this.leftSquare.getXform().setSize(2, 2);
    c = hexToRgb("00509D");
    this.leftSquareCC = new Renderable(this.mConstColorShader);
    this.leftSquareCC.setColor([c.r, c.g, c.b, c.a]);
    this.leftSquareCC.getXform().setSize(1, 1);
    c = hexToRgb("FFD500");
    this.bottomSquare = new Renderable(this.mConstColorShader);
    this.bottomSquare.setColor([c.r, c.g, c.b, c.a]);
    this.bottomSquare.getXform().setSize(2, 2);
    c = hexToRgb("00509D");
    this.bottomSquareCC = new Renderable(this.mConstColorShader);
    this.bottomSquareCC.setColor([c.r, c.g, c.b, c.a]);
    this.bottomSquareCC.getXform().setSize(1, 1);
}

InteractiveObject.prototype._setBoundSqPos = function (xForm, xPos, yPos) {
    var halfXLen = xForm.getWidth() / 2;
    var halfYLen = xForm.getHeight() / 2;
    this.topSquare.getXform().setPosition(xPos, yPos + halfYLen);
    this.topSquareCC.getXform().setPosition(xPos, yPos + halfYLen);
    this.rightSquare.getXform().setPosition(xPos + halfXLen, yPos);
    this.rightSquareCC.getXform().setPosition(xPos + halfXLen, yPos);
    this.leftSquare.getXform().setPosition(xPos - halfXLen, yPos);
    this.leftSquareCC.getXform().setPosition(xPos - halfXLen, yPos);
    this.bottomSquare.getXform().setPosition(xPos, yPos - halfYLen);
    this.bottomSquareCC.getXform().setPosition(xPos, yPos - halfYLen);
}

