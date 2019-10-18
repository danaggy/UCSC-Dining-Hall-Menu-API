const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();

//Key:Dinning hall name, val: todays url
var URLMap = new Map();
URLMap.set("Rachel Carson Oakes","https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=30&locationName=Rachel+Carson+Oakes+Dining+Hall&naFlag=1");
URLMap.set("Colleges Nine and Ten","https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=Colleges+Nine+%26+Ten+Dining+Hall&naFlag=1");
URLMap.set("Cowell Stevenson", "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=05&locationName=Cowell+Stevenson+Dining+Hall&naFlag=1");
URLMap.set("Crown Merrill", "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=20&locationName=Crown+Merrill+Dining+Hall&naFlag=1");
URLMap.set("Porter Kresge", "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=25&locationName=Porter+Kresge+Dining+Hall&naFlag=1");

app.get('/', function(req, res){
    let location = req.query.location;
    let meal = req.query.meal;
    //must be mm/dd/yyyy
    let date = req.query.date;
    var reqUrl = URLMap.get(location);
    //catch misspelled location names
    if(reqUrl == null){
    	var json = {
      		menuItems: "Bad Location"
      	}
      	res.send(json)
    }
    //append date to url if other than today
    if(date != "today"){
    	reqUrl += "&WeeksMenus=UCSC+-+This+Week%27s+Menus&myaction=read&dtdate=" + date
    }
    var options = {
	url : reqUrl,
	headers: {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        'Cookie': 'PS_DEVICEFEATURES=width:1280 height:720 pixelratio:2.5 touch:0 geolocation:1 websockets:1 webworkers:1 datepicker:1 dtpicker:1 timepicker:1 dnd:1 sessionstorage:1 localstorage:1 history:1 canvas:1 svg:1 postmessage:1 hc:0 maf:0; SavedAllergens=; SavedWebCodes=; WebInaCartDates=; WebInaCartMeals=; WebInaCartRecipes=; WebInaCartQtys=; WebInaCartLocation=40'
    }
};
// The structure of our request call
// The first parameter is our URL
// The callback function takes 3 parameters, an error, response status code and the html
request(options, function(error, response, body) {
	// First we'll check to make sure no errors occurred when making the request
	if (!error) {
      	//use cheerio to give jQuery functionality
      	const $ = cheerio.load(body, {decodeEntities: true});
      	var menuTable;
      	switch(meal){
      		case "Breakfest":
      			menuTable = $('body > table:nth-child(4) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td > table > tbody');
      			break;
      		case "Lunch":
      			menuTable = $('body > table:nth-child(4) > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td > table > tbody');
      			break;
      		case "Dinner":
      			menuTable = $('body > table:nth-child(4) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table > tbody');
      			break;
      		case "Late Night":
      			menuTable = $('body > table:nth-child(4) > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(2) > td > table > tbody');
      			break;
      		//catches bad/mispelled meals
      		default:
      			var json = {
      				menuItems: "Bad meal"
      			}
      			res.send(json);
      			break;

      	}
      	var text = [];
      	// select all tbody's that are children of a table, gets the whole row
      	var rows = $('table> tbody', menuTable).toArray();
      	for(var i = 0; i < rows.length; i++){
      		//get the recipe name from each row
      		var menuItem = $('span', rows[i]).text().trim();
      		text.push(menuItem);
      	}
      	//will escape quotes 
      	//text = JSON.stringify(text);
      	var json = {
      		menuItems: text
      	}
      	res.send(json);
	}
});
});

app.listen('8080');
console.log('API is running on http://localhost:8080');
module.exports = app;