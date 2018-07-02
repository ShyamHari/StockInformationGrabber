/**
 * @author Shyam Hari <shyamu.hari@gmail.com>
 * Date: Friday January 19th
 * @version: 10.0 A working program of the final Culminating
 * @description: This program fetches data from several APIs and allows the user to check up on current stock quotes. The program will display this to the user in Canadian Dollars and USD.
 * This program has a background screen that serves as a loading screen just to let the user know when the program crashes.
 * This program has a sorter and a searcher that will order inputted stocks from lowest to highest.
 * This program can run multiple times, and serves its purpose as being a quick way to check on current financial stocks.
 */

//variables dealing with the single stock input
var inputForSingleStock;
var buttonForSingleStock;
var urlPathForSingleStock;
var api_pathForSingleStock = 'https://www.alphavantage.co/query?function=';
var typeSingleStock = 'TIME_SERIES_INTRADAY';
var apiFillSingleStock = '&symbol=';
var apiStuffSingleStock = '&interval=';
var intervalSingleStock = '1min';
var singleStockArray;
var apiKey = '&apikey=EJ1UAVNLGQPO7JIA';

//variables dealing with currency exchange between USD and CAD
var currencyExchange = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CAD&apikey=EJ1UAVNLGQPO7JIA';
var currencyExchangeVariable;
var exchangeRateObject;
var canadianConvertedClosePrice;

//boolean for an invalid API Call
var invalidAPICall;

//variables for singleStock that get initialized
var lastRefreshedSingleStock;
var volumeSingleStock;
var closeSingleStock;
var symbolOfStock;

//variables for bundleStock Calls
var invalidAPICallBundle;
var bundleStockArray;
var inputForBundleStock;
var buttonForBundleStock;
var urlPathForBundleStock;
var indivValue;
var pricesOfStock = [];
var namesOfStock = [];
var canadianConvertedBundle = [];
var roundedCanadianConvertedBundle = [];

//variables for timing
var timeTaken;

//variables for sorting
var sortedCanadianBundle = [];
var arraySlots = [];
var sortedUSDStock;

//moving things around
var sortedNamesArray = [];

//objects
var noiseWaveObject;
var gridLineObject;
var errorDisplayObject;
var displayButtonObject;
var bubbleSortObject;

function setup() {
	bubbleSortObject = new BubbleSort();
	errorDisplayObject = new ErrorDisplays();
	gridLineObject = new Gridlines();
	noiseWaveObject = new NoiseWaveGraph(110, 1, 150, 0.02);
	createCanvas(windowWidth, windowHeight);
	//loads the DOM stuff for single stocks
	singleStockDOM();
	//loads the DOM stuff for bundled stocks
	bundleStockDOM();
	//loads the currency JSON
	currencyExchangeVariable = loadJSON(currencyExchange);
	exchangeRateObject = new ExchangeRateConversion(currencyExchangeVariable);
	displayButtonObject = new DisplayButtonText();
}

/**
 * Loads bundle stock DOM for buttons and input fields
 */
function bundleStockDOM() {
	inputForBundleStock = createInput();
	inputForBundleStock.position(width / 1.5, height / 10);
	buttonForBundleStock = createButton('submit');
	buttonForBundleStock.position(inputForBundleStock.x + 135, inputForBundleStock.y);
	buttonForBundleStock.mousePressed(getInfoBundle);
}

/**
 * This function that encapsulates all the DOM functions for the single stock API
 */
function singleStockDOM() {
	inputForSingleStock = createInput();
	inputForSingleStock.position(width / 50, height / 10);
	buttonForSingleStock = createButton('submit');
	buttonForSingleStock.position(inputForSingleStock.x + 135, inputForSingleStock.y);
	buttonForSingleStock.mousePressed(getInfo);
}

function draw() {
	background(255);
	//Background stuff to add aesthetic and to show if program has crashed or not
	gridLineObject.showGrid();
	noiseWaveObject.modWave();
	noiseWaveObject.showAndMoveWave();
	//If the API gets an improper entry, it will return an error display
	if (invalidAPICall === true) {
		errorDisplayObject.displayErrors('INVALID API CALL', inputForSingleStock.x, inputForSingleStock.y);
		//If the API gets a proper display, the program will run as per usual
	} else if (invalidAPICall === false) {
		singleStockInitializer();
		showSingleStocks();
	}
	if (invalidAPICallBundle === true) {
		//display an error if the API call did not work
		errorDisplayObject.displayErrors('INVALID API CALL', inputForBundleStock.x, inputForBundleStock.y);
	} else if (invalidAPICallBundle === false) {
		//initialize bundle stocks if everything works properly
		bundleStockInitializer();
		showBundleStock();
	}
	//display the buttons using an object
	displayButtonObject.textDisplay('Input Field for Single Stock Symbols - Only 1 and Only Symbols in Capital Letters', inputForSingleStock.x, inputForSingleStock.y - 10);
	displayButtonObject.textDisplay('Input Field for Bundle Stock Symbols - Do not put spaces after commas and only Symbols in Capital Letters', inputForBundleStock.x - 100, inputForBundleStock.y - 10);
}

/**
 * This function is loads the JSON for the bundle stocks entered by the user
 */
function getInfoBundle() {
	urlPathForBundleStock = 'https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=' + inputForBundleStock.value() + apiKey;
	loadJSON(urlPathForBundleStock, bundleStockLoader);
}


/**
 * This function loads the bundle stock data into a global variable and checks if the input is legitimate
 *  @param {object} bundleStockData - This is the data that loads from many stocks
 */
function bundleStockLoader(bundleStockData) {
	bundleStockArray = bundleStockData;
	//if the error message displays then do make the user notified of the API not receiving the request or, if it is working then check if it is and continue to run program
	if (bundleStockArray["Error Message"] == 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for BATCH_STOCK_QUOTES.') {
		invalidAPICallBundle = true;
	} else if (bundleStockArray["Meta Data"]["1. Information"] == 'Batch Stock Market Quotes') {
		invalidAPICallBundle = false;
	}
}

/**
 * This function is triggered by a button that loads the API for one specific stock that is entered in the input field, and loads it to another function
 */
function getInfo() {
	urlPathForSingleStock = api_pathForSingleStock + typeSingleStock + apiFillSingleStock + inputForSingleStock.value() + apiStuffSingleStock + intervalSingleStock + apiKey;
	loadJSON(urlPathForSingleStock, singleStockLoader);
}

/**
 * This function loads a single stocks data into an array variable, and also tests if the data was proper or not, triggering a boolean
 * @param {object} singleStockData  - Receives an object from the API that has data updated by the second. It has the information of a singular stock.
 */
function singleStockLoader(singleStockData) {
	singleStockArray = singleStockData;
	if (singleStockArray["Error Message"] == 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_INTRADAY.') {
		invalidAPICall = true;
	} else if (singleStockArray["Meta Data"]["4. Interval"] == '1min') { //If it reads that a stock has been loaded, then the error will not display
		invalidAPICall = false;
	}
}

/**
 * This function loads all the important numerical values of a single stock into variables that can be worked with
 */
function singleStockInitializer() {
	//gets the symbol of the stock
	symbolOfStock = singleStockArray["Meta Data"]["2. Symbol"];
	// gets the last refreshed time
	lastRefreshedSingleStock = singleStockArray["Meta Data"]["3. Last Refreshed"];
	// gets the volume of shares
	volumeSingleStock = singleStockArray["Time Series (1min)"][lastRefreshedSingleStock]["5. volume"];
	//gets the stocks closing price
	closeSingleStock = Math.round(singleStockArray["Time Series (1min)"][lastRefreshedSingleStock]["4. close"] * 100) / 100;
}

/**
 * This function intializes the important aspects of the bundle stock input into their arrays
 */
function bundleStockInitializer() {
	indivValue = inputForBundleStock.value().split(',');
	for (var i = 0; i <= indivValue.length - 1; i++) {
		//prevent commas from breaking program
		if (indivValue[i]) {
			//initialize the prices and names of stock from bundle
			pricesOfStock[i] = Math.round(bundleStockArray["Stock Quotes"][i]["2. price"] * 100) / 100;
			namesOfStock[i] = bundleStockArray["Stock Quotes"][i]["1. symbol"];
		}
	}
}

/**
 * This function shows the stocks on the screen when it is called
 */
function showSingleStocks() {
	//convert stocks to Canadian dollars
	canadianConvertedClosePrice = exchangeRateObject.calculateExchange(closeSingleStock); //returns the converted Canadian stock price
	push();
	fill(0);
	textSize(20);
	stroke(0);
	//loads the text for showing to user
	text(symbolOfStock, inputForSingleStock.x, inputForSingleStock.y + 50);
	text(closeSingleStock + " " + "USD", inputForSingleStock.x, inputForSingleStock.y + 80);
	text(Math.round(canadianConvertedClosePrice * 100) / 100 + " " + "CAD", inputForSingleStock.x, inputForSingleStock.y + 110);
	text(volumeSingleStock + " " + "Volume", inputForSingleStock.x, inputForSingleStock.y + 140);
	pop();
}

/**
 * This function shows the stocks from the bundle stock input and uses text.
 * This function also contains the use of the sorting algorithm
 */
function showBundleStock() {
	push();
	fill(0);
	textSize(15);
	stroke(0);
	//loads text for showing to user
	for (var j = 0; j <= indivValue.length - 1; j++) {
		//load the stocks which are converted to CAD
		canadianConvertedBundle[j] = exchangeRateObject.calculateExchange(pricesOfStock[j]);
		//round the stocks so they can display properly
		roundedCanadianConvertedBundle[j] = Math.round(canadianConvertedBundle[j] * 100) / 100;
		text(pricesOfStock[j] + " " + "USD", width / 1.5, namesOfStock.length * 60 - j * 31);
		text(namesOfStock[j], width / 1.7, namesOfStock.length * 60 - j * 31);
		text(Math.round(canadianConvertedBundle[j] * 100) / 100 + " " + "CAD", width / 1.3, namesOfStock.length * 60 - j * 31);
	}
	//bubbleSort
	sortedUSDStock = bubbleSortObject.sortingBubble(pricesOfStock);
	//bubble sort
	sortedCanadianBundle = bubbleSortObject.sortingBubble(roundedCanadianConvertedBundle);
	linearSearch();
	//displaying the sorted stocks
	for (var f = indivValue.length - 1; f >= 0; f--) {
		text(sortedCanadianBundle[f] + " " + "CAD", width / 1.15, namesOfStock.length * 60 - f * 31);
		text(sortedNamesArray[f], width / 1.05, namesOfStock.length * 60 - f * 31);
	}
	text('Sorted from low to high', width / 1.15, height / 6);
	pop();
}

/**
 * This function loads the unsorted names of stocks into a sorted array with sorted prices and uses searching to find values
 */
function linearSearch() {
	var startTime = millis();
	for (var i = 0; i <= sortedCanadianBundle.length - 1; i++) {
		for (var j = 0; j <= canadianConvertedBundle.length - 1; j++) {
			//compares the two arrays and searches the slots for the new names and fills it into a new array so that the names are in the same order as the sorted stocks
			if (sortedCanadianBundle[i] == Math.round(canadianConvertedBundle[j] * 100) / 100) {
				sortedNamesArray[i] = namesOfStock[j];
			}
		}
	}
	var endTime = millis();
	var timeTaken2 = endTime - startTime;
	//0.004999999997380655 milliseconds with worst case complexity of O(n);
	console.log(timeTaken);
}



/**
 * This function sorts an array from lowest to highest using the in built sort
 * @param {array} sortArrayData - This array contains a list of numbers to be sorted
 */
/*function sorter(sortArrayData) {
    var startTime = millis(); //initialize start time
    sort(sortArrayData);
    var endTime = millis();
    timeTaken = endTime - startTime;
    console.log(sortArrayData); //Worst case complexity is O(nlogn);
    console.log(timeTaken); //time taken 1.3150000000023283 seconds
    return sortArrayData;
}
*/
