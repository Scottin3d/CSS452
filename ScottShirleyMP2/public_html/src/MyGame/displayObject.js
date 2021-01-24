/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function displayObject(){
    this.objects = [];
    this.numObjects = null;
    this.timeCreated = null;
}

displayObject.prototype.Create = function(shader, position, createTime){
    this.timeCreated = createTime;
    var count = (Math.random() * 10) + 10;
    count = Math.trunc(count);
    
    for(var i = 0; i < count; i++){
        var square = new Renderable(shader);
        square.setColor([Math.random(), Math.random(), Math.random(), 1]);

        // Step  D: Initialize the white Renderable object: centered, 5x5, rotated
        var pos = (Math.random() * 5);
        square.getXform().setPosition(position[0] + pos, position[1] + pos);
        
        var size = (Math.random() * 6) + 1;
        square.getXform().setSize(size, size);
        
        var rot = (Math.random() * 360);
        square.getXform().setRotationInDegree(rot); // In Radians
        this.objects.push(square);
   }
   
   this.numObjects = this.objects.length;
   return this;
};

displayObject.prototype.GetCount = function(){
    return this.objects.length;
};

displayObject.prototype.GetObjects = function(){
    return this.objects;
};

displayObject.prototype.GetCreateTime= function(){
    return this.timeCreated;
};