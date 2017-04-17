var store = new Vuex.Store({
	state: {
		currentCity: '',
		currentTemp: '',
		searchCity: '',
		select: '',
	},
	mutations: {}
});

var vm = new Vue({
	el: '#main',
	store: store,
	data: {
		currentCity: '',
		currentTemp: '',
		searchCity: '',
		select: '',
		options: [{
			text: 'Добавьте или выберите город',
			value: ''
		}]
	},
	methods: {
		setCurrentCity: function(val) {
			this.currentCity = val;
		},
		setCurrentTemp: function(val) {
			this.currentTemp = Math.round(val);
		},
		getlocation: function() {
			console.log(this.$store.state.currentCity);
			if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(this.getWeather);
			}

			if (localStorage.cities) {
				this.options = JSON.parse(localStorage.cities);
			} 
		},
		getWeather: function(position) {
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;

			var script = document.createElement('script');
			script.src="http://api.openweathermap.org/data/2.5/weather?appid=d7f7b34f3a9398e8e3bb85cefb767ab1&lat="+ lat +"&lon="+ lon +"&lang=ru&units=metric&callback=vm.cb";
			script.setAttribute('id', 'cbGetWeather');
			document.head.appendChild(script);
		},
		cb: function(res) {
			this.setCurrentCity(res.name);
			this.setCurrentTemp(res.main.temp);
			var script = document.getElementById('cbGetWeather');
			document.head.removeChild(script);
		},
		addCity: function() {
			var exists = false;
			var that   = this;

			this.options.filter(function(item, index) {
				if (item.text.toLowerCase() === that.searchCity.toLowerCase()) exists = true;
			});

			if (! exists) {
				var script = document.createElement('script');
				script.src="http://api.openweathermap.org/data/2.5/weather?appid=d7f7b34f3a9398e8e3bb85cefb767ab1&q="+ this.searchCity +"&lang=ru&units=metric&callback=vm.getCity";
				script.setAttribute('id', 'cbAddCity');
				document.head.appendChild(script);
			}
		},
		getCity: function(res) {
			this.options.push({
				text: res.name, 
				value: res.coord.lat + "&" + res.coord.lon,
			});
			this.searchCity = '';
			
			localStorage.setItem('cities', JSON.stringify(this.options));
			var script = document.getElementById('cbAddCity');
			document.head.removeChild(script);
		},
		getCoords: function(e) {
			var position = {};
			position.coords = {};

			var coords = this.select.split('&');
			position.coords.latitude = coords[0];
			position.coords.longitude = coords[1];

			this.getWeather(position);
		}
	}
});

window.onload = vm.getlocation();