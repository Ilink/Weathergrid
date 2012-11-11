function Rain(){
    var geo = [];
    var tmat;
    
    for(var i = 0; i < 100; i++){
        tmat = [-50+i, 0.0, 0];
        verts = geo.rectangle(0.05, 0.5);
        var _geo = engine.add_geo(geo_builder.rectangle(0.05, 0.5), tmat);
        // _geo.velocity =
        geo.push(_geo);
    }
}