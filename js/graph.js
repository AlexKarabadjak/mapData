function Graph() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var graphIsDraw;
	
	function compareNumeric(a, b) {
		if (a > b) return 1;
		if (a < b) return -1;
	}

	this.draw = function(data){
			//разбираем датасет		
			var values = [];
			var years = [];
			var valueArray = data.dataSets["0"].series["0:0:0:0"].observations;
			var yearsArray = data.structure.dimensions.observation[0];
			var dataLength = Object.keys(valueArray).length;//years и values имееют одинаковую длину, так как однозначно соответствуют	
			var measureIndex = data.structure.attributes.series[2].values["0"].name +" "+ data.structure.attributes.series[1].values["0"].name;
			console.log(measureIndex);
			//проверка на наличие данных
			if(dataLength == 0) {
				alert("No data");
				return;
			}
			else if (dataLength==1){
				alert(values[0] +" in " + years[0] + " year");
				return;
			}
				
			for(var i =0; i<dataLength;i++){
				years[i] = yearsArray.values[i].name;
				values[i] = valueArray[i][0];
			}
			
			var canvasZeroXCoord = 50;//начало координат графика
			var canvasZeroYCoord = 50;
			var margin = 5;//рамка 	
			var numHorizLines = 25;
			
			var valMin = (values.sort(compareNumeric)[0]).toFixed(4);//мин значение сетки
			var valMax = (values.sort(compareNumeric)[dataLength-1]+0.01).toFixed(4);//макс значение сетки
			var xScale = ((canvas.width-margin)-(margin+canvasZeroXCoord))/(dataLength-1);//коэффицент перевода между индексом массива с годами и пикселями
			var yScale = ((canvas.height-(margin+canvasZeroYCoord)) -margin)/(valMax - valMin);//коэффицент между значениями и пикселями
			
			context.lineWidth = 1;
			context.strokeStyle = "red";
			context.font = "1 pt Verdana";
			
			//затираем предыдущий график
			if(graphIsDraw) {
				context.translate(-(canvasZeroXCoord+margin),canvas.height-(canvasZeroYCoord+margin));
				context.scale(1,-1);
				context.clearRect(0,0,canvas.width,canvas.height);
				graphIsDraw = false;
			}
			
			//рисуем сетку
			//вертикальные линии
			context.beginPath();
			var horizontTextMargin;//отступы разбивают осевые значения в 2 ряда для читаемости
			for(var x = 0;x<dataLength;x++){
				context.moveTo(canvasZeroXCoord+margin + xScale*x, canvas.height-(canvasZeroYCoord+margin));
				horizontTextMargin = (x%2)?10:0;
				context.fillText(years[x],canvasZeroXCoord+margin +xScale*x - xScale*2/3,canvas.height-(canvasZeroYCoord/2+margin-horizontTextMargin));
				context.lineTo(canvasZeroXCoord+margin + xScale*x, margin);
			}
			context.stroke();
			
			//горизонатльные линии
			context.beginPath();
			for (var y =0;y<=valMax-valMin;y+=(valMax-valMin)/numHorizLines){
				context.moveTo(canvasZeroXCoord+margin,canvas.height-(canvasZeroYCoord+margin) - y*yScale);
				context.fillText((parseFloat(valMin)+parseFloat(y)).toFixed(4),margin,canvas.height-(canvasZeroYCoord+margin-10) - y*yScale);
				context.lineTo(canvas.width-margin,canvas.height-(canvasZeroYCoord+margin) - y*yScale);
			}
			context.stroke();
			
			//единицы измерений
			context.beginPath();
			context.fillText(measureIndex,canvasZeroXCoord/2,canvas.height-margin);
			context.stroke();
			
			//переносим начало координат канваса в начало координат графика
			context.translate(0,canvas.height);
			context.scale(1,-1);
			context.translate(canvasZeroXCoord+margin,canvasZeroYCoord+margin);
			
			//отрисовка ломаной
			plotData(values,xScale,yScale);
			graphIsDraw = true;
	}

	function plotData(dataSet,xScale,yScale) {	
		dataSet = dataSet.sort(compareNumeric);
		context.strokeStyle = "green";
		context.lineWidth = 3;
		
		context.beginPath();			
		context.moveTo(0,0);
		for (var count=1;count<dataSet.length;count++) {
			context.lineTo(count*xScale,(dataSet[count]-dataSet[0])*yScale);
		}
		context.stroke();
		
	}
		
}
