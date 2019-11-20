# UCSC-Dining-Hall-Menu-API

A Node.js program to scrape menu items from https://nutrition.sa.ucsc.edu/  
Parameters:<ul>
	<li>Required, location: "Rachel Carson Oakes" || "Colleges Nine and Ten" || "Cowell Stevenson" || "Crown Merrill" || "Porter Kresge"</li>
	<li>Required, meal: "Breakfest" || "Lunch" || "Dinner" || "Late Night"  </li>
	<li>Optional, date: "today" || "mm/dd/yyyy"  </li>
	<li>Optional, allergens: comma seperated list of allergens to filter menu items. Possible allergens are soy, eggs, milk, vegan, gluten, pork, veggie, fish, shellfish, nuts, treenut, halal, and beef </li>
</ul>

example call: http://localhost:8080/?location=Colleges Nine and Ten&meal=Late Night&date=12/1/2019&allergens=milk, eggs
