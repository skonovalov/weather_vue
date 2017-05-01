import Vuex from "vuex";

let store = new Vuex.Store({
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

export default store;