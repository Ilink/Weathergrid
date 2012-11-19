<script id="rain_vs" type="x-shader/vertex"> 
 
    attribute vec3 position;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix; // combined modelview projection matrix
    uniform mat4 uPMatrix; // project

    varying vec2 vTextureCoord;

    void main(void) {
        gl_Position = vec4(position, 1.0);
        vTextureCoord = aTextureCoord;
    }

</script>