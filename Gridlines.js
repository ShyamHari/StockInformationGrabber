/**
 * This object creates Gridlines with a low alpha value to simulate a graph
 * @class
 * @constructor
 */
function Gridlines() {
	colorMode(RGB, 255, 255, 255, 255);
	this.strokeLine = color(0, 0, 0, 20);
	this.showLines = true;

	/**
	 * Display function that summons the grid on the screen
	 */
	this.showGrid = function() {
		//gives the ability for the user to turn off the grid lines
		if (this.showLines === true) {
			for (var i = 0; i < width; i += width / 30) {
				for (var g = 0; g < height; g += height / 20) {
					strokeWeight(0.2);
					stroke(this.strokeLine);
					line(0, g, width, g);
					line(i, 0, i, height);
				}
			}
		}
	}
}