
QUnit.test("Grid creation", function( assert ) {
    var grid = new window.Grid();
    var size = grid.size();
	assert.ok(size.x == 0);
	assert.ok(size.y == 0);
	assert.ok(grid.width() == 0);
	assert.ok(grid.height() == 0);
	
	assert.ok(grid.getLocation({}) == null);
	assert.ok(grid.locationAbove({x:1,y:0}) == null);
	assert.ok(grid.locationAbove({x:0,y:0}) == null);
	assert.ok(grid.at(1,1) == null);
});

QUnit.test("Grid insertion A", function( assert ) {
	var grid = new Grid();
	grid.put(0,0, "A");
	
	assert.ok(grid.at(0,0) == "A");
	var locOfA = grid.getLocation("A");
	assert.ok(locOfA.x == 0);
	assert.ok(locOfA.y == 0);
	
	assert.ok(grid.above("A") == null);
	assert.ok(grid.below("A") == null);
	assert.ok(grid.before("A") == null);
	assert.ok(grid.after("A") == null);
	
	var size = grid.size();
	assert.ok(size.x == 1);
	assert.ok(size.y == 1);
	assert.ok(grid.width() == 1);
	assert.ok(grid.height() == 1);
});

QUnit.test("Grid insertion A & B", function( assert ) {
	var grid = new Grid();
	grid.put(0,0, "A");
	grid.put(1,0, "B");
	
	assert.ok(grid.at(1,0) == "B");
	
	var locOfB = grid.getLocation("B");
	assert.ok(locOfB.x == 1);
	assert.ok(locOfB.y == 0);
	
	assert.ok(grid.above("B") == null);
	assert.ok(grid.below("B") == null);
	assert.ok(grid.before("B") == "A");
	assert.ok(grid.after("B") == null);
	assert.ok(grid.above("A") == null);
	assert.ok(grid.below("A") == null);
	assert.ok(grid.before("A") == null);
	assert.ok(grid.after("A") == "B");
	
	var size = grid.size();
	assert.ok(size.x == 2);
	assert.ok(size.y == 1);
	assert.ok(grid.width() == 2);
	assert.ok(grid.height() == 1);
});


QUnit.test("Grid insertion A & B & C", function( assert ) {
	var grid = new Grid();
	grid.put(0,0, "A");
	grid.put(1,0, "B");
	assert.ok(grid.at(0,1) == null);
	grid.put(0,1, "C");
	
	assert.ok(grid.at(0,1) == "C");
	assert.ok(grid.below("A") == "C");
	assert.ok(grid.above("C") == "A");
	
	var locOfC = grid.getLocation("C");
	assert.ok(locOfC.x == 0);
	assert.ok(locOfC.y == 1);
	
	assert.ok(grid.at(1,1) == null);
	grid.put(1,1, "D");
	assert.ok(grid.at(1,1) == "D");
	assert.ok(grid.above("D") == "B");
	assert.ok(grid.below("B") == "D");
	assert.ok(grid.before("D") == "C");
	assert.ok(grid.after("C") == "D");
	assert.ok(grid.above("C") == "A");
	assert.ok(grid.below("A") == "C");
	assert.ok(grid.before("B") == "A");
	assert.ok(grid.after("A") == "B");
});

QUnit.test("Grid growing and shrinking", function( assert ) {
    var grid = new window.Grid();
    var size = grid.size();
	assert.ok(size.x == 0);
	assert.ok(size.y == 0);

	grid.put(1,1,"A");
	size = grid.size();
	assert.ok(size.x == 2);
	assert.ok(size.y == 2);
	assert.ok(grid.width() == 2);
	assert.ok(grid.height() == 2);
	
	grid.put(4,5, "F");
	size = grid.size();
	assert.ok(size.x == 5);
	assert.ok(size.y == 6);
	assert.ok(grid.width() == 5);
	assert.ok(grid.height() == 6);
	
	grid.put(4,5, null);
	size = grid.size();
	assert.ok(size.x == 2);
	assert.ok(size.y == 2);
	assert.ok(grid.width() == 2);
	assert.ok(grid.height() == 2);
});

QUnit.test("Grid setGrid", function( assert ) {
    var grid = new window.Grid();

	// define an object that understands setGrid(grid)
	function ObjectThatUnderstandSetGrid() { }
	ObjectThatUnderstandSetGrid.prototype = Object.create({});
	ObjectThatUnderstandSetGrid.constructor = ObjectThatUnderstandSetGrid;
	ObjectThatUnderstandSetGrid.prototype.grid = null;	
	ObjectThatUnderstandSetGrid.prototype.setGrid = function(grid) {
		this.grid = grid;
	};
	
	// put an instance of that object in the grid
	var obj = new ObjectThatUnderstandSetGrid();
	grid.put(4,5, obj);
	assert.ok(obj.grid === grid);
	// remove that object from the grid
	grid.put(4,5, null); // forces a shrink
	assert.ok(obj.grid === null);
	
	var size = grid.size();
	assert.ok(size.x == 0);
	assert.ok(size.y == 0);
			
});

QUnit.test("Grid iteration", function( assert ) {
    var grid = new window.Grid();
	grid.put(10,10, "A");
	
	var locationsIterated = [];
	
	grid.cellsBetweenColumnsByRowDo(this, Grid.locationFrom(2,1), Grid.locationFrom(3,Infinity), function(cell, location){
		locationsIterated.push(location);
	});
	
	assert.ok(locationsIterated[0].x === 2);
	assert.ok(locationsIterated[0].y === 1);
	assert.ok(locationsIterated[locationsIterated.length-1].x === 3);
	assert.ok(locationsIterated[locationsIterated.length-1].y === 10);
	assert.ok(locationsIterated.length === 20);
	
	
});
