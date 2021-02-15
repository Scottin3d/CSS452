
"use strict";

// Constructor
function MainView() {
    // textures: 
    this.fontSprite = fontSprite;
    this.minionSprite = minionSprite;
    this.font32 = font32;
    this.boundSprite = boundSprite;
    
    this.currentSprite = null;

    // cameras
    this.mCamera = null;
    this.mAnimationView = null;

    // Support Objects: SpriteSource and InteractionBound
    this.mSpriteSource = null;
    this.mOption = 1; // this is for the sprite draw function (switching between different image/sprite)
    this.mInteractiveObject = null;
    this.mInteractiveObjArray = [];

    this.lastUpdate = null;
    this.mStatus = null;
    this.imgInfo = null;

    // spriate animation values - unique to minion sprite
    this.mSAWidth = 204;
    this.mSAHeight = 164;
    this.mSATopPx = 350;
    this.mSALeftPx = 408;
    this.mNumElm = 3;
};

gEngine.Core.inheritPrototype(MainView, Scene);


MainView.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(fontSprite);
    gEngine.Textures.loadTexture(this.boundSprite);
    gEngine.Textures.loadTexture(this.minionSprite);
    gEngine.Fonts.loadFont(font32);
};

MainView.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(fontSprite);
    gEngine.Textures.unloadTexture(this.boundSprite);
    gEngine.Textures.unloadTexture(this.minionSprite);
    gEngine.Fonts.unloadFont(font32);

    var nextLevel = new GameOver();     // next level to be loaded
    gEngine.Core.startScene(nextLevel);
};

MainView.prototype.initialize = function () {
    // main camera
    this.mCamera = new Camera(
            vec2.fromValues(60, 40),    // position of the camera
            150,                        // width of camera
            [20, 20, 600, 680]          // viewport (orgX, orgY, width, height)
            );
    var scColor = hexToRgb("00509D");
    this.mCamera.setBackgroundColor([scColor.r, scColor.g, scColor.b, 1]);

    // 2 Objects
    this.mSpriteSource = new SpriteSource();
    this.mSpriteSource.initialize();

    this.currentSprite = minionSprite;
    this.mInteractiveObject = new InteractiveObject();
    this.mInteractiveObject.initialize(1, 60, 40, 28, 25);
   
    // animation small view
    this.mAnimationView = new AnimationView(this.mInteractiveObject);

    this.lastUpdate = 0;
    // image information bar
    this.imgInfo = new FontRenderable("");
    this.imgInfo.setFont(font32);
    var c = hexToRgb("FFD500");
    this.imgInfo.setColor([c.r, c.g, c.b, c.a]);
    this.imgInfo.getXform().setPosition(-10, -35);
    this.imgInfo.setTextHeight(4);
    
    // Status Bar
    this.mStatus = new FontRenderable("");
    this.mStatus.setFont(font32);
    c = hexToRgb("FFFFFF");
    this.imgInfo.setColor([c.r, c.g, c.b, c.a]);
    this.mStatus.getXform().setPosition(-10, -40);
    this.mStatus.setTextHeight(4);
};


MainView.prototype.draw = function () {

    // Step A: clear the canvas
    var scColor = hexToRgb("003F88");
    gEngine.Core.clearCanvas([scColor.r, scColor.g, scColor.b, 1]); // clear to light gray

    // Step  B: Activate the drawing Camera
    this.mCamera.setupViewProjection();

    // Step  C: Draw everything
    
    this.mSpriteSource.draw(this.mOption, this.mCamera.getVPMatrix());
    this.mInteractiveObject.draw(1, this.mCamera.getVPMatrix());
    
    // Draw the Animation Frame if any
    for (var i = 0; i < this.mInteractiveObjArray.length; i++) {
        console.log("interactive obj array", this.mInteractiveObjArray);
        this.mInteractiveObjArray[i].draw(2, this.mCamera.getVPMatrix());
    }
    // Draw status
    this.mStatus.draw(this.mCamera.getVPMatrix());
    this.imgInfo.draw(this.mCamera.getVPMatrix());
    
    this.mAnimationView.draw(this.mOption);
};

MainView.prototype.update = function () {
    var spriteDelta = 0.5;
    var moveSprite = 3.3;
    var boundXForm = this.mInteractiveObject.getBoundXForm();
    var boundLeftSqPos = this.mInteractiveObject.getBoundLeftSqPos();
    var boundRightSqPos = this.mInteractiveObject.getBoundRightSqPos();
    var boundTopSqPos = this.mInteractiveObject.getBoundTopSqPos();
    var boundBotSqPos = this.mInteractiveObject.getBoundBotSqPos();
    var spriteLeftSqPos = this.mSpriteSource.getSpriteLeftSqPos();
    var spriteRightSqPos = this.mSpriteSource.getSpriteRightSqPos();
    var spriteTopSqPos = this.mSpriteSource.getSpriteTopSqPos();
    var spriteBotSqPos = this.mSpriteSource.getSpriteBotSqPos();


    //---arrow---scaling
    // < left
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
        if ((boundLeftSqPos >= spriteLeftSqPos)
                && (boundRightSqPos < spriteRightSqPos)) {
            // apply change
            this.mInteractiveObject.setBoundWidth(spriteDelta);
            this.mSAWidth += moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    // ^ up
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
        if ((boundTopSqPos <= spriteTopSqPos)
                && (boundBotSqPos > spriteBotSqPos)) {
            // apply change
            this.mInteractiveObject.setBoundHeight(spriteDelta);
            this.mSAHeight += moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    // > right
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
        if ((boundLeftSqPos > spriteLeftSqPos)
                && (boundRightSqPos <= spriteRightSqPos)) {
            // apply change
            this.mInteractiveObject.setBoundWidth(-spriteDelta);
            this.mSAWidth -= moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    // v down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
        if ((boundTopSqPos < spriteTopSqPos)
                && (boundBotSqPos >= spriteBotSqPos)) {
            // apply change
            this.mInteractiveObject.setBoundHeight(-spriteDelta);
            this.mSAHeight -= moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    //---wasd---interactive-object-movement
    // w up
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        if (boundTopSqPos < spriteTopSqPos) {
            // apply change
            this.mInteractiveObject.incBoundYPos(spriteDelta);
            this.mSATopPx += moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    // a left
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        if (boundLeftSqPos > spriteLeftSqPos) {
            // apply change
            this.mInteractiveObject.incBoundXPos(-spriteDelta);
            this.mSALeftPx -= moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    // s
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        if (boundBotSqPos > spriteBotSqPos) {
            // apply change
            this.mInteractiveObject.incBoundYPos(-spriteDelta);
            this.mSATopPx -= moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    // d
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        if (boundRightSqPos < spriteRightSqPos) {
            // apply change
            this.mInteractiveObject.incBoundXPos(spriteDelta);
            this.mSALeftPx += moveSprite;
            // set new animation sequence
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }

    //---change-image
    // z 
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Z)) {
        this.mOption = 2;
        this.currentSprite = fontSprite;
        this.mAnimationView.prototype.setCurrentSprite(this.currentSprite);
    }
    // x
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.X)) {
        this.mOption = 1;
        this.currentSprite = minionSprite;
        this.mAnimationView.prototype.setCurrentSprite(this.currentSprite);
    }

    //---show-remaining-frames
    // q
    // TODO Fix
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        //"first element" : this.mFirstElmLeft, 
        //"element top" : this.mElmTop,
        //"element width": this.mElmWidth,a
        //"element height" : this.mElmHeight,
        //"element padding" : this.mWidthPadding,
        //"number of elements" : this.mNumElems};
        var stats = this.mInteractiveObject.getBoundXForm();
        
        for (var i = 1; i <= this.mNumElm; i++) {
            var interactiveObj = new InteractiveObject();
            interactiveObj.initialize(this.mOption, boundXForm.getYPos() * i, boundXForm.getHeight() , boundXForm.getWidth(), boundXForm.getHeight());
            this.mInteractiveObjArray.push(interactiveObj);
        }
        /*
        if ((boundTopSqPos < spriteTopSqPos)
                && (boundBotSqPos > spriteBotSqPos)
                && (boundLeftSqPos > spriteLeftSqPos)
                && (boundRightSqPos <= spriteRightSqPos)) {
            const interactiveObj = new InteractiveObject();
            interactiveObj.initialize(2, boundRightSqPos, boundXForm.getHeight(), boundXForm.getWidth(), boundXForm.getHeight());
            this.mInteractiveObjArray.push(interactiveObj);
        }
        */
    }
    // k
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.K)) {
        if (this.mInteractiveObjArray.length > 0) {
            this.mInteractiveObjArray.splice(0, 1);
        }
    }
    //--percise-zoom
    // space
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        if ((boundTopSqPos < spriteTopSqPos)
                && (boundBotSqPos > spriteBotSqPos)
                && (boundLeftSqPos > spriteLeftSqPos)
                && (boundRightSqPos <= spriteRightSqPos)) {
            this.mInteractiveObject.incBoundSize(spriteDelta * 10 / 100);

            this.mSAWidth += (moveSprite  * 10 / 100);
            this.mSAHeight += (moveSprite  * 10 / 100);
            this.mAnimationView.setSprSequence(this.mOption,
                    this.mSATopPx, this.mSALeftPx,                              // top of image, left of image (in PIXEL)
                    this.mSAWidth, this.mSAHeight,                              // width x height in pixels
                    this.mNumElm,                                               // number of elements in this sequence
                    0);                                                         // horizontal padding in between
        }
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.One)) {
        this.mAnimationView.prototype.setAnimationSpeed(10);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Two)) {
        this.mAnimationView.prototype.setAnimationSpeed(20);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Three)) {
        this.mAnimationView.prototype.setAnimationSpeed(30);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Four)) {
        this.mAnimationView.prototype.setAnimationSpeed(40);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Five)) {
        this.mAnimationView.prototype.setAnimationSpeed(50);
    }

    if(Date.now() - this.lastUpdate > 500){
        this.lastUpdate = Date.now();
        this._updateStatus(boundXForm.getXPos(), boundXForm.getYPos(), boundXForm.getWidth(), boundXForm.getHeight());
        this._updateImageInfo();
    }
    
    this.mAnimationView.updateAnimation(this.mOption);
};

MainView.prototype._updateStatus = function (boundXPos, boundYPos, boundXSize, boundYSize) {
    this.mStatus.setText("Status: Bound Pos=(" + boundXPos.toFixed(2) + ",  " + boundYPos.toFixed(2)
            + ")  Size = (" + boundXSize.toFixed(2) + ", " + boundYSize.toFixed(2) + ")");
};

MainView.prototype._updateImageInfo = function(){
    this.imgInfo.setText("Current Image: " + this.currentSprite); 
};

