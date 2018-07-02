/**
 * This function displays text above buttons that are created
 */
function DisplayButtonText() {
	this.text;

	/**
	 * This function displays the text
	 * @param {String} textButton - The text of the label going above the button
	 * @param {number} x - The x coordinate of the text
	 * @param {number} y - The y coordinate of the text 
	 */
	this.textDisplay = function(textButton, x, y) {
		this.x = x;
		this.y = y;
		this.text = textButton;
		textSize(15);
		stroke(0);
		text(this.text, this.x, this.y - 10)
	}
}