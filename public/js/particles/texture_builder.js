function Texture_builder(gl){
    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    function get_texture_coords(){
        return [
            0.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]
    }

    this.init = function(name){
        var texture = gl.createTexture();
        texture.image = new Image();
        texture.image.onload = function() {
            handleLoadedTexture(texture)
        }

        texture.image.src = name;
        return texture;
    };

    this.init_buffer = function(verts){
        var texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        texture_coord_buffer.itemSize = 2;
        texture_coord_buffer.numItems = 4;
        return texture_coord_buffer;
    };
}