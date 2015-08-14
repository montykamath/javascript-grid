"use strict";
(function(module) {
	
	// ##############################################################################
	// Grid is a two dimensional grid data structure.  Grids have rows.  Each row has columns.
	// 0,0 is the the first cell in the grid.  Grids can grow and shrink as needed.
	function Grid() {
		this.rows = [];
	};
	Grid.prototype = Object.create(Object.prototype); // Subclass of Object
	Grid.prototype.constructor = Grid;

	// #####################################################
	// STATIC METHODS
	Grid.locationFrom = function(x,y) {
		var loc = {};
		loc.x = x;
		loc.y = y;
		return loc;
	};
	
	Grid.locationsAreEqual = function() {
		// compare any number of locations
		var args = Array.prototype.slice.call(arguments, 0);
		var x = args[0].x;
		var y = args[0].y;
		var answer = true;
		for(var i=1; i<args.length; i++) {
			if(args[i].x != x || args[i].y != y) {
				answer = false;
				break;
			}
		}
		return answer;
	};

	// #####################################################
	// PRIVATE METHODS
	Grid.prototype._addEmptyRow = function() {
		// use first row's length to init each empty row
		var size = this.rows.length == 0 ? 0 : this.rows[0].length;
		var rowToAdd = [];
		for(var i = 0; i<size; i++) {
			rowToAdd.push(null);
		}
		this.rows.push(rowToAdd);
	};

	Grid.prototype._addEmptyColumn = function() {
		
		if(this.rows.length == 0) return;
		
		for(var i = 0; i<this.rows.length; i++) {
			this.rows[i].push(null);
		}
	};

	Grid.prototype._shrink = function() {
		// Remove any unnecessary rows and columns
		
		while(this._lastRowIsEmpty()) {
			this.rows.splice(this.rows.length-1, 1);  // remove the bottom row
		}
		
		while(this._lastColumnIsEmpty()) {
			for(var i=0; i<this.rows.length; i++) {
				var eachRow = this.rows[i];
				eachRow.splice(eachRow.length-1, 1);  // remove the last column
			}
		}    
	};

	Grid.prototype._lastColumnIsEmpty = function() {
		if(this.rows.length == 0) return false;
		for(var i=0; i<this.rows.length; i++) {
			var eachRow = this.rows[i];
			if(eachRow[eachRow.length-1] != null) return false;
		}
		return true;
	};

	Grid.prototype._lastRowIsEmpty = function() {
		if(this.rows.length == 0) return false;
		// Remove any unnecessary rows and columns
		var lastRow = this.rows[this.rows.length-1];
		for(var i=0; i<lastRow.length; i++) {
			if(lastRow[i] != null) return false;
		}
		return true;
	};

	// #####################################################
	// PUBLIC METHODS
	Grid.prototype.at = function(x,y) {
		// make sure we have enough rows and columns
		if(this.rows.length-1 >= y && this.rows[y].length-1 >= x)
			return this.rows[y][x];
		return null;
	};

	Grid.prototype.atLocation = function(location) {
		if(!location) return null;
		return this.at(location.x, location.y);
	};

	Grid.prototype.put = function(x,y, cell) {
		// make sure we have enough rows
		while(this.rows.length-1 < y) {
			this._addEmptyRow();
		}
		
		// make sure we have enough cells
		while(this.rows[0].length-1 < x) {
			this._addEmptyColumn();
		}

		// get the row where this new thing should go
		var row = this.rows[y];
		
		// tell the old thing to forget about me if it understands setGrid(grid)
		if(row[x] && (typeof row[x].setGrid === 'function') )
			row[x].setGrid(null);
		// tell the new thing to know about me if it understands setGrid(grid)
		if(cell && (typeof cell.setGrid === 'function') )
			cell.setGrid(this);
		
		// put the new thing in the row
		row[x] = cell;
		
		// if they blanked out a cell then shrink if needed
		if(cell == null) this._shrink();

		return cell;
	};

	Grid.prototype.isEmpty = function() {
		return this.rows.length == 0;
	};

	Grid.prototype.empty = function() {
		
		// tell each grid action it is about to be removed from the grid so it can release resources
		this.cellsByRowDo(this, function(gridAction, location){
			if(gridAction != null) {
				gridAction.aboutToRemoveFromGrid(this);
			}
		});
		
		this.rows = [];
	};

	Grid.prototype.size = function() {
		var size = {};
		if(this.rows.length == 0)
			size.x = 0;
		else
			size.x = this.rows[0].length;
		size.y = this.rows.length;
		return size;
	};

	Grid.prototype.width = function() {
		var size = this.size();
		return size.x;
	};

	Grid.prototype.height = function() {
		var size = this.size();
		return size.y;
	};

	Grid.prototype.getLocation = function(cell) {
		
		// null is the placeholder so it is everywhere
		if(cell == null) return null; // null means not found
		
		for(var y = 0; y<this.rows.length; y++) {
			var row = this.rows[y];
			for(var x = 0; x<row.length; x++) {
				var eachCell = row[x];
				if(cell == eachCell) {
					return {x: x, y: y};
				}
			}
		}
		
		// null means not found
		return null;
	};

	Grid.prototype.locationAbove = function(location) {
		if(!location) return null;
		var loc = Grid.locationFrom(location.x,location.y-1);
		if(loc.x < 0 || loc.y < 0) return null;
		return loc;
	};
	
	Grid.prototype.locationBelow = function(location) {
		if(!location) return null;
		var loc = Grid.locationFrom(location.x,location.y+1);
		if(loc.x < 0 || loc.y < 0) return null;
		return loc;
	};
	
	Grid.prototype.locationBefore = function(location) {
		if(!location) return null;
		var loc = Grid.locationFrom(location.x-1,location.y);
		if(loc.x < 0 || loc.y < 0) return null;
		return loc;
	};
	
	Grid.prototype.locationAfter = function(location) {
		if(!location) return null;
		var loc = Grid.locationFrom(location.x+1,location.y);
		if(loc.x < 0 || loc.y < 0) return null;
		return loc;
	};

	Grid.prototype.above = function(cell) {
		var locOfCell = this.getLocation(cell);
		var loc = this.locationAbove(locOfCell);
		return this.atLocation(loc);
	};
	
	Grid.prototype.below = function(cell) {
		var locOfCell = this.getLocation(cell);
		var loc = this.locationBelow(locOfCell);
		return this.atLocation(loc);
	};
	
	Grid.prototype.before = function(cell) {
		var locOfCell = this.getLocation(cell);
		var loc = this.locationBefore(locOfCell);
		return this.atLocation(loc);
	};
	
	Grid.prototype.after = function(cell) {
		var locOfCell = this.getLocation(cell);
		var loc = this.locationAfter(locOfCell);
		return this.atLocation(loc);
	};

	Grid.prototype.columns = function() {
		var cols = [];
		// no rows means nothing to do
		if(this.rows.length == 0) cols;
		
		// spin thru the columns
		for(var x = 0; x<this.rows[0].length; x++) {
			var col = [];
			// spin thru the rows
			for(var y = 0; y<this.rows.length; y++) {
				col.push(this.rows[y][x]);
			}
			cols.push(col);
		}
		return cols;
	};

	Grid.prototype.rowsDo = function(thisToUse, aFunction) {
		// spin thru the rows
		for(var y = 0; y<this.rows.length; y++) {
			var row = this.rows[y];
			// call the function for each row
			// row is an array of all the cells in that row
			aFunction.call(thisToUse, row, y);
		}
	};
	
	Grid.prototype.columnsDo = function(thisToUse, aFunction) {
		var cols = this.columns();
		// spin thru the columns
		for(var x = 0; x<cols.length; x++) {
			var col = cols[x];
			// call the function for each column
			// col is an array of all the cells in that column
			aFunction.call(thisToUse, col, x);
		}
	};
	
	Grid.prototype.cellsByRowDo = function(thisToUse, aFunction) {    
		// spin thru the rows
		for(var y = 0; y<this.rows.length; y++) {
			var row = this.rows[y];
			// spin thru the cells
			for(var x = 0; x<row.length; x++) {
				var cell = row[x];
				// call the function for each cell
				aFunction.call(thisToUse, cell, Grid.locationFrom(x,y));
			}
		}
	};
	
	Grid.prototype.cellsByColumnDo = function(thisToUse, aFunction) {
		var cols = this.columns();
		// spin thru the columns
		for(var x = 0; x<cols.length; x++) {
			var col = cols[x];
			// spin thru the rows
			for(var y = 0; y<col.length; y++) {
				var cell = col[y];
				// call the function for each cell
				aFunction.call(thisToUse, cell, Grid.locationFrom(x,y));   
			}
		}
	};

	Grid.prototype.cellsBetweenColumnsByRowDo = function(thisToUse, loc1, loc2, aFunction) {
		// spin thru the rows
		for(var y = 0; y<this.rows.length; y++) {
			if(y >= loc1.y && y <= loc2.y) {
				var row = this.rows[y];
				// spin thru the cells
				for(var x = 0; x<row.length; x++) {
					if(x >= loc1.x && x <= loc2.x) {
						var cell = row[x];
						// call the function for each cell
						aFunction.call(thisToUse, cell, Grid.locationFrom(x,y));
					}
				}
			}
		}
	};

	module.Grid = Grid;
	return module;
})(window);




