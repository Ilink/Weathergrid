function make_boxes(){
	var $wrapper = $('.wrapper #col0');

	col_iter($wrapper, function($insert, col, row){
		$insert.append("<div class='grid_item'></div>");
	});
}

function make_hsl(h,s,l){
	var hsl = "hsl("+h+","+s+"%,"+l+"%)";
	return hsl;
}

var grey = {
	h: 206,
	s: 12,
	v: 93
}

function color_box(i, r, c){
	var golden_ratio_conjugate = 0.61803398875;
	var percent = i * 100 % golden_ratio_conjugate * 100;

	var base = {
		h: Math.max(percent, 15)-100,
		s: Math.max((r * 10), 15),
		v: Math.max((c * 20), 45)
	};

	// base = {
	// 	h: 233,
	// 	s: 56,
	// 	v: 100
	// }

	var grey_mix = blend.color(grey, base, 0.8);

	var hsl = make_hsl(grey_mix.h, grey_mix.s, grey_mix.v);
	// var hsl = make_hsl(base.h, base.s, base.v);

	return hsl;
}

function color_boxes(h_weight, s_weight, v_weight){
	var $wrapper = $('.wrapper');
	boxes_iter($wrapper, function($item, col, row){
		var h = h_weight * col;
		var s = s_weight * col / 20;
		var v = v_weight * row / 50;
		console.log(h,s,v);
		$item.css({
			"background-color": color_box(h, s, v)
		});
	});
}

$(document).ready(function(){
	
	$.ajax({
		type: 'GET',
		url: '/weather.json',
		success: function(data){
			console.log(data);
			make_boxes();
			color_boxes(data.temp, 1, data.temp);
		}
	});
	
});