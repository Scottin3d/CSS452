/* 
 * The template for a AnimationView.
 */

"use strict";

// Constructor
function AnimationView(interactObj) {
    // textures: 
    this.kFontImage = "assets/Consolas-72.png";
    this.kMinionSprite = "assets/minion_sprite.png";

    // The camera to view the scene
    this.mCamera = null;
    this.mMinion = null;
    this.mFont = null;
    this.mInteractObj = interactObj;
    this._initialize();
};

AnimationView.prototype._initialize = function () {
    var uvCoordArray = this.mInteractObj.getBound().getElementUVCoordinateArray()
    console.log("UVCoord", uvCoordArray);
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(60, 40),   // position of the camera
        150,                        // width of camera
        [640, 360, 255, 255]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([1, 0.8, 0, 0.5]);

    this.mMinion = new SpriteAnimateRenderable(this.kMinionSprite);
    this.mMinion.setColor([1, 1, 1, 0]);
    this.mMinion.getXform().setPosition(60, 40); // DON'T CHANGE THESE VALS!!!!
    this.mMinion.getXform().setSize(140, 140);     // DON'T CHANGE THESE VALS!!!!
    this.mMinion.setSpriteSequence(350, 408, // top of image, left of image
        204, 164,                          // width x height in pixels
        5,                                 // number of elements in this sequence
        0);                                // horizontal padding in between
    this.mMinion.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mMinion.setAnimationSpeed(50);

    this.mFont = new SpriteAnimateRenderable(this.kFontImage);
    this.mFont.setColor([1, 1, 1, 0]);
    this.mFont.getXform().setPosition(60, 40);
    this.mFont.getXform().setSize(this.mCamera.getWCWidth(), this.mCamera.getWCWidth());
    this.mFont.setSpriteSequence(350, 200,    // first element pixel position: top-left 512 is top of image, 0 is left of image
        128, 128,                           // widthxheight in pixels
        5,                                  // number of elements in this sequence
        0);                                 // horizontal padding in between
    this.mFont.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mFont.setAnimationSpeed(50);
};

AnimationView.prototype.updateAnimation = function (option) {
    if (option === 1) {
        this.mMinion.updateAnimation();
    } else {
        this.mFont.updateAnimation();
    }
}

AnimationView.prototype.setSprSequence = function (option, topPx, leftPx, wPx, hPx, numElm, hPadding) {
    if (option === 1) {
        this.mMinion.setSpriteSequence(topPx, leftPx, wPx, hPx, numElm, hPadding);                                 
    } else {
        this.mFont.setSpriteSequence(topPx, leftPx, wPx, hPx, numElm, hPadding);      
    }
}

AnimationView.prototype.setSprSequenceUV = function (option, topUV, leftUV, wUV, hUV, numElm, hPadding) {
    if (option === 1) {
        this.mMinion.setSpriteSequenceUV(topUV, leftUV, wUV, hUV, numElm, hPadding);                                 
    } else {
        this.mFont.setSpriteSequenceUV(topUV, leftUV, wUV, hUV, numElm, hPadding);      
    }
}

AnimationView.prototype.draw = function (option) {
    this.mCamera.setupViewProjection();

    if (option === 1) {
        this.mMinion.draw(this.mCamera.getVPMatrix());
    } else {
        this.mFont.draw(this.mCamera.getVPMatrix());
    }
};
