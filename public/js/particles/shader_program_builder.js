/*
Shader
Should be able to build a shader - specifying the source and compiling it.
*/

function ShaderProgramBuilder(gl){
	function getShader(shaderSrc, type){
	    var shader;
	    if(type.toLowerCase() === 'fs'){
	        shader = gl.createShader(gl.FRAGMENT_SHADER);
	    } else if(type.toLowerCase() === 'vs'){
	        shader = gl.createShader(gl.VERTEX_SHADER);
	    } else throw "Shader is of wrong type - should be vs or fs - got " + type;

	    gl.shaderSource(shader, shaderSrc);
	    gl.compileShader(shader);

	    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	        console.log(gl.getShaderInfoLog(shader));
	        return null;
	    }

	    return shader;
	}

	this.build = function(shaderSrcPair){
		var vs = getShader(shaderSrcPair.vs, 'vs');
		var fs = getShader(shaderSrcPair.fs, 'fs');

		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vs);
		gl.attachShader(shaderProgram, fs);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		    throw "Could not initialise shaders";
		}

		return shaderProgram;
	}
}

