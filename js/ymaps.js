function Ymaps () {
	//var controls = new Controls();
	ymaps.ready(init);
	//controls.getControls();
		
	function init () {
		var myMap = new ymaps.Map('map', {
			center: [55.753994, 37.622093],
			zoom: 4
		});
	
		myMap.events.add('click', function (e) {
			getCountry(e.get('coords'));
		});
	}
	
	function getCountry(coords) {
		ymaps.geocode(coords).then(function (res) {
			console.log(res.geoObjects.get(0).getCountry());				
		});	
	}
	
}