function col_iter($wrapper, callback){
	var col = 0, row = 0, $current = $wrapper;
	for(row = 0; row < 35; row++){
		// this is way more fun than two loops
		if(row > 0 && !(row%5)){
			$current = $current.next();
			col++;
		}
		callback.call(this, $current, col, row);
	}	
}

function boxes_iter($wrapper, callback){
	var col = 0, row = 0, i = 0;
	$wrapper.find('.col').each(function(col, el){
		$(el).children().each(function(row, item){
			i++;
			callback.call(this, $(item), col, row, i);
		});
	});
}

function total_boxes($wrapper){
	return $wrapper.find('.grid_item').length;
}

function make_hsl(h,s,l){
	var hsl = "hsl("+h+","+s+"%,"+l+"%)";
	return hsl;
}