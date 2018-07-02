/**
 * This function sorts a list of numbers from lowest to highest using bubble sort
 * @class
 * @constructor
 */
function BubbleSort() {
	this.sortArrayData;
	this.swap;
	this.sortArrayData;
	this.timeTaken;
	this.endTime;
	this.temp;

	/**
	 * This function does the sorting for the object
	 * @param {array} sortArrayData - This array contains the list of numbers to be sorted
	 * @returns {array} It returns a sorted array of stock prices from highest to lowest 
	 */
	this.sortingBubble = function(sortArrayData) {
		this.sortArrayData = sortArrayData;
		this.startTime = millis();
		do {
			this.swap = false
				//bubbleSort
			for (var i = 0; i < this.sortArrayData.length - 1; i++) {
				if (this.sortArrayData[i] < this.sortArrayData[i + 1]) {
					this.temp = this.sortArrayData[i];
					this.sortArrayData[i] = this.sortArrayData[i + 1];
					this.sortArrayData[i + 1] = this.temp;
					this.swap = true;
				}
			}
		} while (this.swap);
		//initialize the endTime
		this.endTime = millis();
		this.timeTaken = this.endTime - this.startTime;
		//0.03499999999985448 milliseconds to finish it sorted
		return this.sortArrayData; //Worst case complexity is O(n^2)
	}
}