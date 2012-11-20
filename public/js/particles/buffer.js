function Buffer(gl, verts, itemSize, attr){

    var glBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    glBuffer.itemSize = itemSize;
    glBuffer.numItems = verts.length / itemSize;
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);

    this.glBuffer = glBuffer;
    this.set = function(){
        gl.vertexAttribPointer(attr, glBuffer.itemSize, gl.FLOAT, false, 0, 0);
    };
}