/*
note box = {
	width: 100px,
	height: 100px
}

I want this to fill the entire screen with boxes
*/
function Layout($wrapper, margin, box_dim){

	var cols, rows, self = this;

	function total_boxes(){
		return $wrapper.find('.grid_item').length;
	}

	function col_iter(callback){
		var col = 0, row = 0, $current = $wrapper.find('.col').first();
		console.log($current);
		for(row = 0; row < cols; row++){
			if(row > 0 && !(row % rows)){
				$current = $current.next();
				col++;
			}
			callback.call(this, $current, col, row);
		}
	}

	function col_iter2(callback){
		var $current = $wrapper.find('.col').first();
		
		for(var col = 0; col < cols; col++){
			for(var row = 0; row < rows; row++){
				callback($current);
			}
			$current = $current.next();
		}
	}

	function get_num_cols($container){
		return Math.floor($container.width() / (box_dim.width + margin*2));
	}

	function get_num_rows($container){
		return Math.floor($container.height() / (box_dim.height + margin*2));
	}

	function make_cols(){
		for(var i = 0; i < cols; i++){
			$wrapper.append("<div class='col'></div>");
		}
	}

	function make_boxes(){
		$wrapper.hide();
		make_cols();
		col_iter2(function($insert, col, row){
			$insert.append("<div class='grid_item'></div>");
		});
		$wrapper.show();
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

	this.update = function(){
		var $document = $(document);
		cols = get_num_cols($document);
		rows = get_num_rows($document);
		console.log(rows, cols);
		make_boxes();
	}

	this.each = function(callback){
		boxes_iter($wrapper, function($item, col, row, i){
			callback.call(this, $item, col, row, i);
		});
	}

	// Constructor
	self.update();

}
