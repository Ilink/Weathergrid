function make_boxes(){
	var $wrapper = $('.wrapper #col0');

	col_iter($wrapper, function($insert, col, row){
		$insert.append("<div class='grid_item'></div>");
	});
}

function color_boxes(h_weight, s_weight, v_weight){
	var $wrapper = $('.wrapper');
	var total = total_boxes($wrapper);
	boxes_iter($wrapper, function($item, col, row, i){
		var h = h_weight * col;
		var s = s_weight * col / 20;
		var v = v_weight * row / 50;
		console.log(h,s,v, i, total);
		$item.css({
			"background-color": color_box(h, s, v, i/total)
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