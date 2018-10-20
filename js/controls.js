function Controls(){
	var graph = new Graph();
	const rootURL = 'https://stats.oecd.org/sdmx-json/data/NAT_RES/';
	const url ='https://stats.oecd.org/sdmx-json/data/NAT_RES/AUS+CAN+MEX+NLD+NOR+GBR+USA.CRUDE+NATGAS+HARD+BROWN+IRON+BAUXITE+COPPER+TIN+ZINC+LEAD+NICKEL+GOLD+SILVER+PHOSPHATE.OPENING+ADDITIONS+DISCOVERIES+UP+TOTAL_AD+REDUCTIONS+EXTRACTIONS+DOWN+TOTAL_RED+CLOSING+DISCREPANCY.A+B+C+AB+BC/all?startTime=2000&endTime=2016';
	
	this.getControls = async function(){
		var data = await getData(url);
		var parentElement = document.getElementById("params");
		var params = data.structure.dimensions.series;	
		for (var item = 0; item<params.length;item++){
			var newSelect = document.createElement("select");		
			newSelect.id = params[item].id;
			parentElement.appendChild(newSelect);
			parentElement.appendChild(document.createElement("br"));
				
			for(var a =0;a<params[item].values.length;a++){
				var option = document.createElement("option");
				option.text = params[item].values[a].name;
				option.value = params[item].values[a].id;
				newSelect.appendChild(option);			
			}
		}
		
		var button = document.createElement("input");
		button.type = "button";
		button.value = "Draw Graph";
		button.onclick = function(){viewData();};	
		button.id = "but";
		document.getElementById("params").appendChild(button);
	}
	
	async function getData(url){
		var data = await $.get(url);
		return data;
	}
	

	function getParams(){
		var params = [];
		$("#params").each(function() {
			$(this).children("select").each(
				function(){
					params.push(this.value);
				});
		});
		return params;
	}
	async function getDataByParams(params){
		//URL constructor
		var urlParams = rootURL;
		for (var k=0;k<params.length;k++){
			if(k<params.length-1)
				urlParams += params[k] + ".";
			else 
				urlParams += params[k];
		}
		urlParams += '?startTime=2000&endTime=2016';
		console.log(urlParams);
		var dataByParams = await getData(urlParams);
		return dataByParams;
	}
	async function viewData(){
		var graphData = await getDataByParams(getParams());		
		graph.draw(graphData);
	}
}