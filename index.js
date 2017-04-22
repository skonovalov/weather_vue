console.time('loading');
var store = new Vuex.Store({
	state: {
		currentCity: '',
		currentTemp: '',
		options: [{
			text: 'Choose city or add new',
			value: ''
		}]
	},
	mutations: {
		setCurrentCity: function(state, payload) {
			state.currentCity = payload.value;
		},
		setCurrentTemp: function(state, payload) {
			state.currentTemp = Math.round(payload.value);
		},
		addCity: function(state, payload) {
			state.options.push({
				text: payload.text,
				value: payload.value
			});
		}
	}
});

var vm = new Vue({
	el: '#main',
	store: store,
	data: {
		searchCity: '',
		select: ''
	},
	computed: {
		currentCity: function() {
			return store.state.currentCity;
		},
		currentTemp: function() {
			return store.state.currentTemp;
		},
		options: function() {
			return store.state.options;
		}
	},
	methods: {
		getlocation: function() {
			var cities;

			if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(this.getWeather);
			}

			if (localStorage.cities) {
				cities = JSON.parse(localStorage.cities);

				for (var prop in cities) {
					store.commit('addCity', {
						text: cities[prop].text,
						value: cities[prop].value
					});
				}
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
			store.commit('setCurrentCity', {value: res.name});
			store.commit('setCurrentTemp', {value: res.main.temp});

			var script = document.getElementById('cbGetWeather');
			document.head.removeChild(script);
		},
		addCity: function() {
			var exists = false;
			var that   = this;

			store.state.options.filter(function(item, index) {
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
			store.commit('addCity', {
						text: res.name,
						value: res.coord.lat + "&" + res.coord.lon
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
console.timeEnd('loading');