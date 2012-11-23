function Buffer(gl, verts, itemSize, attr){

    var glBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    this.glBuffer = glBuffer;
    this.itemSize = itemSize;
    this.numItems = verts.length / itemSize;
    this.set = function(){
        gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
        gl.vertexAttribPointer(attr, itemSize, gl.FLOAT, false, 0, 0);
    };
}