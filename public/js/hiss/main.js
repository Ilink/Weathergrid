
	
	var test1 = 
	"var test = function()\n"+
	"	body()\n"+
	"	test()\n"+
	"	"
	console.log(test1);
	var parser = new Parser(test1);
