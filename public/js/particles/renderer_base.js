/*
Renderer Base
Provides some default uniforms and attributes.

Make sure you 'call' this constructor here, or nothing will work!
*/

function RendererBase(gl){
	this.gl = gl;
}

RendererBase.prototype.setDefaultUniforms = function(program, pMatrix, mvMatrix){
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, "uPMatrix"), false, pMatrix);
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, "uMVMatrix"), false, mvMatrix);
    this.gl.uniform1i(this.gl.getUniformLocation(program, "uSampler"), 1);
}

RendererBase.prototype.initGeoBuffer = function(verts){
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);
    buffer.itemSize = 3;
    buffer.numItems = verts.length/3;
    return buffer;
}