
"use strict";

// Constructor
function AnimationView(interactObj) {
    // The camera to view the scene
    this.animationSpeed = null;
    this.currentSprite = null;
    this.mCamera = null;
    this.mMinion = null;
    this.mFont = null;
    this.mInteractObj = interactObj;
    this._initialize();
};

AnimationView.prototype._initialize = function () {
    this.currentSprite = minionSprite;
    this.animationSpeed = 50;
    var uvCoordArray = this.mInteractObj.getBound().getElementUVCoordinateArray();
    console.log("UVCoord", uvCoordArray);
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(60, 40),   // position of the camera
        150,                        // width of camera
        [640, 360, 255, 255]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([1, 0.8, 0, 0.5]);

    this.mMinion = new SpriteAnimateRenderable(minionSprite);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(60, 40);            // DON'T CHANGE THESE VALS!!!!
    this.mMinion.getXform().setSize(140, 140);              // DON'T CHANGE THESE VALS!!!!
    this.mMinion.setSpriteSequence(350, 408,                // top of image, left of image
        204, 164,                                           // width x height in pixels
        5,                                                  // number of elements in this sequence
        0);                                                 // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(this.animationSpeed );

    this.mFont = new SpriteAnimateRenderable(fontSprite);
    this.mFont.setColor([1, 1, 1, 0]);
    this.mFont.getXform().setPosition(60, 40);
    this.mFont.getXform().setSize(this.mCamera.getWCWidth(), this.mCamera.getWCWidth());
    this.mFont.setSpriteSequence(350, 200,                  // first element pixel position: top-left 512 is top of image, 0 is left of image
        128, 128,                                           // widthxheight in pixels
        5,                                                  // number of elements in this sequence
        0);                                                 // horizontal padding in between
    this.mFont.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mFont.setAnimationSpeed(this.animationSpeed );
};

// <param>speed</param> the current sprite to be rendered
AnimationView.prototype.setAnimationSpeed = function (speed){
    this.animationSpeed = speed;
    this.mFont.SetSpeed(this.animationSpeed);
    this.mMinion.SetSpeed(this.animationSpeed);
};

// <param>optiom</param> which sprite is being rendered
AnimationView.prototype.updateAnimation = function (option) {
    if (option === 1) {
        this.mMinion.updateAnimation();
    } else {
        this.mFont.updateAnimation();
    }
};

// <param>sprite</param> the current sprite to be rendered
AnimationView.prototype.setCurrentSprite = function (sprite){
    this.currentSprite = sprite;
};

AnimationView.prototype.GetCurrentSpriteStats = function (){
    return this.mMinion.GetCurrentSpriteStats();
};

// <param>optiom</param> which sprite is being rendered
// <param>topPx</param>  top of image (in PIXEL)
// <param>leftPx</param> left of image (in PIXEL)
// <param>wPx</param> width (in PIXEL)
// <param>hPx</param> height (in PIXEL)
// <param>numElm</param> number of elements in this sequence
// <param>hPadding</param> horizontal padding in between
AnimationView.prototype.setSprSequence = function (option, topPx, leftPx, wPx, hPx, numElm, hPadding) {
    if (option === 1) {
        this.mMinion.setSpriteSequence(topPx, leftPx, wPx, hPx, numElm, hPadding);                                 
    } else {
        this.mFont.setSpriteSequence(topPx, leftPx, wPx, hPx, numElm, hPadding);      
    }
};

// <param>optiom</param> which sprite is being rendered
// <param>topUV</param>  top of image (in PIXEL)
// <param>leftUV</param> left of image (in PIXEL)
// <param>wUV</param> width (in PIXEL)
// <param>hUV</param> height (in PIXEL)
// <param>numElm</param> number of elements in this sequence
// <param>hPadding</param> horizontal padding in between
AnimationView.prototype.setSprSequenceUV = function (option, topUV, leftUV, wUV, hUV, numElm, hPadding) {
    if (option === 1) {
        this.mMinion.setSpriteSequenceUV(topUV, leftUV, wUV, hUV, numElm, hPadding);                                 
    } else {
        this.mFont.setSpriteSequenceUV(topUV, leftUV, wUV, hUV, numElm, hPadding);      
    }
};

// <param>optiom</param> which sprite is being rendered
AnimationView.prototype.draw = function (option) {
    this.mCamera.setupViewProjection();

    if (option === 1) {
        this.mMinion.draw(this.mCamera.getVPMatrix());
    } else {
        this.mFont.draw(this.mCamera.getVPMatrix());
    }
};
