<script id="sprite_fs" type="x-shader/fragment">
	precision highp float;

	varying vec2 vTextureCoord;

	uniform sampler2D uSampler;

	void main(void) {
	    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	}
</script>