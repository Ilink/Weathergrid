$(document).ready(function(){
    var shader_loader = new Shader_loader();
    // shader_loader.load(['rain_vs', 'rain_fs']);
    shader_loader.load(['sprite_vs', 'sprite_fs']);


    $(document).on('shaders_loaded', function(e, shaders){
        var engine = new Engine($('canvas'), shaders);

        // var tmat = mat4.create();
        var tmat = [-1.5, 0.0, -7.0];

        var squid_sprite = engine.add_geo(geo_builder.rectangle(1.0, 1.0), tmat, 'squid.png');

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
            tmat = [x, 1.5, z];
            var _geo = engine.add_geo(geo_builder.rectangle(0.05, 0.5), tmat);
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
        // timeline.start();

        engine.start();
    });
});