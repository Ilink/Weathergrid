<script id="sprite_vs" type="x-shader/vertex">
	attribute vec3 position;
	attribute vec2 aTextureCoord;

	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;

	varying vec2 vTextureCoord;

	void main(void) {
		// This adds the homogenous "w" coordinate to the end of the position
		// I think it is typically 1 for position vectors
	    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
	    vTextureCoord = aTextureCoord;
	}
</script>