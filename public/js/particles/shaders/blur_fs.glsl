<script id="sprite_fs" type="x-shader/fragment">
	precision highp float;

	varying vec2 vTextureCoord;

	uniform sampler2D uSampler;

	void main(void) {
	    // gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
</script>