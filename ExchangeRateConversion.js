/**
 * This function gets the exchangeRateData and converts any number using the conversion factor from US to Canadian
 * @param {number} exchangeRateData - The multiplier from US to Canadian dollars 
 * 
 */
function ExchangeRateConversion(exchangeRateData) {
	this.exchangeData = exchangeRateData;
	this.exchangeDataRounded;

	/**
	 * This function returns US dollars rounded by a Canadian multiplier 
	 * @param {number} price - This is the price of the stock entered into this function that is to be converted
	 * @returns {number} The exchange rate multiplied stock value
	 */
	this.calculateExchange = function(price) {
		this.priceRounded = Math.round(price * 100) / 100
		this.exchangeDataRounded = Math.round(this.exchangeData['Realtime Currency Exchange Rate']['5. Exchange Rate'] * 100) / 100;
		return this.priceRounded * this.exchangeDataRounded;
	}

}