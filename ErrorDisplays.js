/**
 * This function creates the error messages that are displayed for invalid inputs
 * @class
 * @constructor
 */
function ErrorDisplays() {
	this.text;

	/**
	 * This displays the error message
	 * @param {String} textString - This is the variable that displays what is said in the text function
	 * @param {number} x - This is the variable that determines the x coordinate of the text 
	 * @param {number} y - This is the variable that determines the y coordinate of the text; 
	 * 
	 */
	this.displayErrors = function(textString, x, y) {
		this.x = x;
		this.y = y;
		this.text = textString;
		stroke(0);
		textSize(15)
		fill(0);
		text(this.text, this.x, this.y + 50);

	}
}