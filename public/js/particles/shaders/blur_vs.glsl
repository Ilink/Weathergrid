<script id="sprite_vs" type="x-shader/vertex">
	attribute vec3 position;
	attribute vec2 aTextureCoord;

	uniform mat4 uMVMatrix; // combined modelview projection matrix
	uniform mat4 uPMatrix; // project

	varying vec2 vTextureCoord;

	void main(void) {
		// This adds the homogenous "w" coordinate to the end of the position
		// I think it is typically 1 for position vectors
		vec4 pos = uPMatrix * uMVMatrix * vec4(position, 1.0);
	    gl_Position = pos;
	    vTextureCoord = aTextureCoord;
	}
</script>