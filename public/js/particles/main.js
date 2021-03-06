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
    shader_loader.load(['sprite_vs', 'sprite_fs', 'rain_vs', 'rain_fs', 'background_fs', 'background_vs']);


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
        var background_shaders = {
            vs: shaders['background_vs.glsl'].text(),
            fs: shaders['background_fs.glsl'].text()
        }
        var gl = engine.get_gl();
        var boundaries = engine.get_boundaries();
        var boundaries_far = engine.get_boundaries(-10);



        var background_renderer = new Renderer(gl, background_shaders);

        // The shader for this does not use the perpsective matrix, so we just need clip space coords
        var background_rect = [
            -1,   -1,        0.0, // bot left
            -1,    1,     0.0, // top left
            1,  -1,        0.0, // bot right
            1,  1,     0.0  // top right
        ];
        background_renderer.add_geo(background_rect, [0,0,-40]);
        engine.add_renderer(background_renderer);

        
        var squid_renderer = new Renderer(gl, squid_shaders);
        // var squid_renderer = new Renderer(gl, rain_shaders);

        engine.add_renderer(squid_renderer);

        // var tmat = mat4.create();
        var tmat = [-1.5, -2.0, -7.0];
        var squid_sprite = squid_renderer.add_geo(geo_builder.rectangle(1.0, 1.0), tmat, 'squid_large.png');

        
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
        var z_min = -5.0;
        var z_max = -1;
        var top = 1.5;
        var z;
        var geo_arr = [];

        // If the user resizes their screen, the rain wont move beacause this is only calculated once
        for(var i = x_min; i < x_max; i++){
            var x = fit_bound(i, x_min, x_max, -4, 4);
            var z_rand = Math.random();
            z = fit_bound(z_rand, 0, 1, z_min, z_max);
            
            tmat = [x, boundaries.topleft[1], z];
            var _geo = rain_renderer.add_geo(geo_builder.rectangle(0.008, 0.09), tmat);
            _geo.vel = Math.random()/150.0 + 0.0001;
            geo_arr.push(_geo);
        }

        // Test Geo
        var boundaries = engine.get_boundaries();
        tmat = boundaries.botright;
        console.log(boundaries);
        // tmat[0] *= -1;
        tmat[2] = -1;
        var _geo = rain_renderer.add_geo(geo_builder.rectangle(0.02, 0.05), tmat);
        _geo.vel = 1;
        geo_arr.push(_geo);
        ////

        var timeline = new Timeline(function(dt){
            for(var i = 0; i < geo_arr.length; i++){
                if(geo_arr[i].trans[1] < -4){
                    geo_arr[i].trans[1] = boundaries.topleft[1]+1;
                } else
                geo_arr[i].trans[1] -= geo_arr[i].vel * dt;
            }
        });
        timeline.start();

        engine.start();
    });
});