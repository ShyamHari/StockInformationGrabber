/** 
 * This function creates a graph that is controlled by perlinNoise and moves with a small offset.
 * @class
 * @constructor
 * @param {number} colourVal       - Determines the Hue value of the vertex that creates a line
 * @param {number} strokeThickness - Determines the stroke thickness of the vertex that creates the line
 * @param {number} alphaVal        - Determines the visibility and opacity of the vertex and the line that it forms
 * @param {number} incrementVal    - Determines the offset in the y direction and makes the graph looked less clumped or more clumped based on number value
 */
function NoiseWaveGraph(colourVal, strokeThickness, alphaVal, incrementVal) {
	colorMode(HSB, 360, 255, 255, 255);
	this.startPoint = 0;
	this.xoff = 0;
	this.increment = incrementVal;
	this.strokeThick = strokeThickness;
	this.alpha_ = alphaVal;
	this.hueVal = colourVal;
	this.showWaveLine = true;
	this.yPos = 0;

	/**
	 * This function creates the perlin noise wave and displays it
	 */
	this.showAndMoveWave = function() {
			//gives user the option to turn off the line
			if (this.showWaveLine) {
				beginShape();
				noFill();
				this.xoff = this.startPoint;
				for (var f = 0; f < width; f += 7 / 8) {
					//creates a changing x position
					this.yPos = noise(this.xoff) * height;
					vertex(f - width / 4, this.yPos);
					this.xoff += this.increment;
				}
				this.startPoint += this.increment;
				endShape();
			}
		}
		/**
		 * This function does specific modifications to the wave depending on keyboard input
		 */
	this.modWave = function() {
		stroke(this.hueVal % 360, 255, 255, this.alpha_);
		strokeWeight(this.strokeThick);

		if (keyIsPressed === true && keyCode == UP_ARROW) {
			this.hueVal += 4;
		}
	}
}