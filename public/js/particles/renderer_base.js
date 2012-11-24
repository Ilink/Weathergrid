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
    this.gl.uniform1i(this.gl.getUniformLocation(program, "uSampler"), 1);
}

RendererBase.prototype.addGeo = function(verts, mat, textureName){
    var self = this;
    var geo = new Geo(self.gl, verts);
    geo.trans = mat;
    
    if(typeof textureName !== 'undefined'){
        geo.texture = new Texture(self.gl, textureName, self.gl.getUniformLocation(self.shaderProgram, 
            "uSampler"), self.gl.getAttribLocation(self.shaderProgram, "aTextureCoord"));
    }
    this.geo.push(geo);
    return geo;
}