/**
 * Provides requestAnimationFrame in a cross browser way.
 * paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
window.requestAnimationFrame = window.requestAnimationFrame || ( function() {
    return  window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(  callback, element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
})();


function Timeline(func){
	var anim_id;
	var start_time = 0;
	var self = this;
	var go = true;

	var frame = function(dt){
		func.call(this, dt);
		window.requestAnimationFrame(frame);
	}

	this.start = function(){
		if(start_time !== 0){
			var current = new Date();
			dt = current - start_time;
			start_time = current;
		} else {
			dt = 16; // ms per frame @ 60 fps
			start_time = new Date();
			console.lo
		}
		func.call(this, dt);
		if(go) window.requestAnimationFrame(self.start);
	}

	this.stop = function(){
		go = false;
	}
}