<script id="rain_fs" type="x-shader/fragment"> 

	precision highp float;
	varying vec2 vTextureCoord;
	uniform sampler2D uSampler;
	uniform vec2 resolution;

	void main(void) {
		vec2 position = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	}

</script>