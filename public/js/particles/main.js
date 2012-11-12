$(document).ready(function(){

    // Matrix multiplcation test
    var persp = mat4.create();
    mat4.perspective(45, $('canvas').width() / $('canvas').height(), 0.1, 100.0, persp);
    var test_pos = [1,2,3,1];
    var result = vec4.create();
    // mat4.multiplyVec3(persp,test_pos, result);
    mat4.multiply(persp,test_pos, result);

    console.log(result);


    var shader_loader = new Shader_loader();
    // shader_loader.load(['rain_vs', 'rain_fs']);
    shader_loader.load(['sprite_vs', 'sprite_fs', 'rain_vs', 'rain_fs']);


    $(document).on('shaders_loaded', function(e, shaders){
        var engine = new Engine($('canvas'));

        var squid_shaders = {
            vs: shaders['sprite_vs.glsl'].text(),
            fs: shaders['sprite_fs.glsl'].text()
        };
        var rain_shaders = {
            vs: shaders['rain_vs.glsl'].text(),
            fs: shaders['rain_fs.glsl'].text()
        }
        var gl = engine.get_gl();
        
        var squid_renderer = new Renderer(gl, squid_shaders);
        // var squid_renderer = new Renderer(gl, rain_shaders);

        engine.add_renderer(squid_renderer);

        // var tmat = mat4.create();
        var tmat = [-1.5, -2.0, -7.0];
        var squid_sprite = squid_renderer.add_geo(geo_builder.rectangle(1.0, 1.0), tmat, 'squid.png');

        
        var rain_renderer = new Renderer(gl, rain_shaders);
        engine.add_renderer(rain_renderer);

        /*
        Give me a range from edge to edge of the screen
        I am estimating the edge now, when my monitor is fullscreen
        -4 < x < 4

        Also, 1.5 is the top of the screen, hooray
        */
        var x_max = 100;
        var x_min = 0;
        var z_min = -12;
        var z_max = -5;
        var top = 1.5;
        var z;
        var geo_arr = [];
        for(var i = x_min; i < x_max; i++){
            var x = fit_bound(i, x_min, x_max, -4, 4);
            var z_rand = Math.random();
            z = fit_bound(z_rand, 0, 1, z_min, z_max);

            tmat = [-1.331599235534668, 0.41421353816986084, -1];
            // tmat = [x, 1.5, z];
            var _geo = rain_renderer.add_geo(geo_builder.rectangle(0.05, 0.5), tmat);
            _geo.vel = Math.random()/150.0;
            geo_arr.push(_geo);
        }

        var timeline = new Timeline(function(dt){
            for(var i = 0; i < geo_arr.length; i++){
                if(geo_arr[i].trans[1] < -4){
                    geo_arr[i].trans[1] = 1.5;
                } else
                geo_arr[i].trans[1] -= geo_arr[i].vel * dt;
            }
        });
        timeline.start();

        engine.start();
    });
});