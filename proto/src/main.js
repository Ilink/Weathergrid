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

function color_box(i, r, c){
	var golden_ratio_conjugate = 0.61803398875;
	var percent = i * 100 % golden_ratio_conjugate * 100;
	percent = Math.max(percent, 15);
	r *= 10;
	c *= 20;
	r = Math.max(r, 15);
	c = Math.max(c, 45);
	return make_hsl(percent-100, r, c);
}



function color_boxes(){
	var $wrapper = $('.wrapper');
	boxes_iter($wrapper, function($item, col, row){
		console.log($item, col, row);
		$item.css({
			"background-color": color_box(col, col,row)
			// "background-color": make_hsl(percent-100,40,50)
		});
	});
}

$(document).ready(function(){
	make_boxes();
	color_boxes();
});