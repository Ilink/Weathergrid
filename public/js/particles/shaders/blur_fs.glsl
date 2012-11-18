<script id="sprite_fs" type="x-shader/fragment">
	precision highp float;

	uniform sampler2D uSampler;
	varying vec2 vTextureCoord;
	// uniform float u_blurStep;
	void main(void) {
		vec4 sample0,
		sample1,
		sample2,
		sample3;

		float step = 10.0 / 100.0;
		sample0 = texture2D(uSampler,
			vec2(vTextureCoord.x - step,
				vTextureCoord.y - step));
		sample1 = texture2D(uSampler,
			vec2(vTextureCoord.x + step,
				vTextureCoord.y + step));
		sample2 = texture2D(uSampler,
			vec2(vTextureCoord.x + step,
				vTextureCoord.y - step));
		sample3 = texture2D(uSampler,
			vec2(vTextureCoord.x - step,
				vTextureCoord.y + step));
		// gl_FragColor = (sample0 + sample1 + sample2 + sample3) / 4.0; 
		gl_FragColor = vec4(0.5, 1.0, 1.0, 1.0);
	}


</script>






