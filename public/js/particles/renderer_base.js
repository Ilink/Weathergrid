/*
Renderer Base
Provides some default uniforms and attributes.

Make sure you 'call' this constructor here, or nothing will work!
*/

function RendererBase(args){
    if(typeof args !== 'undefined'){
        console.log(args)
        this.gl = args.gl;
        this.shaderProgram = buildShaderProgram(this.gl, args.shaders);
        this.geo = [];
    }
}

// todo refctor, doing it this way is really slow
// should store the values of the uniform locations, not fetch them here
RendererBase.prototype.__setDefaultUniforms = function(program, pMatrix, mvMatrix, dim){
    this.gl.uniform2f( this.gl.getUniformLocation(program, 'resolution' ), dim.width, dim.height);
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, "uPMatrix"), false, pMatrix);
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(program, "uMVMatrix"), false, mvMatrix);
    // this.gl.uniform1i(this.gl.getUniformLocation(program, "uSampler"), 1);
}

RendererBase.prototype.initGeoBuffer = function(verts){
    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);
    buffer.itemSize = 3;
    buffer.numItems = verts.length/3;
    return buffer;
}

//todo This should work with actual geo objects
RendererBase.prototype.addGeo = function(verts, mat, textureName){
    var self = this;
    var geo = {
        verts: verts,
        buffer: self.initGeoBuffer(verts),
        trans: mat
    }
    
    if(typeof textureName !== 'undefined'){
        geo.texture = new Texture(self.gl, textureName, self.gl.getUniformLocation(self.shaderProgram, 
            "uSampler"), self.gl.getAttribLocation(self.shaderProgram, "aTextureCoord"));
    }
    this.geo.push(geo);
    return geo;
}