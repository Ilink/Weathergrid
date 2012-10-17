/*
note box = {
	width: 100px,
	height: 100px
}

I want this to fill the entire screen with boxes
*/
function Layout($wrapper, box){

	// both of these are temp until i make the automatic layout
	var rows = 5;
	var total = $wrapper.find('.col').length * rows;

	function total_boxes($wrapper){
		return $wrapper.find('.grid_item').length;
	}

	function col_iter($wrapper, callback){
		var col = 0, row = 0, $current = $wrapper;
		for(row = 0; row < total; row++){
			// this is way more fun than two loops
			if(row > 0 && !(row%5)){
				$current = $current.next();
				col++;
			}
			callback.call(this, $current, col, row);
		}	
	}

	function make_boxes(){
		var $wrapper = $('.wrapper #col0');

		col_iter($wrapper, function($insert, col, row){
			$insert.append("<div class='grid_item'></div>");
		});
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

	// Constructor
	make_boxes();

	// eventually this will work when the window is resized
	this.update = function(){
		make_boxes();
		/*
		create missing boxes
		redo all the coloring
		*/
	}

	this.each = function(callback){
		boxes_iter($wrapper, function($item, col, row, i){
			callback.call(this, $item, col, row, i);
		});
	}

}

