var Service, Characteristic;
var superagent = require('superagent');
var jsonapify = require('superagent-jsonapify');
jsonapify(superagent)

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-ninjablock-alarmstatedevice", "NinjaBlock-AlarmStateDevice", HttpAccessory);
}

function HttpAccessory(log, config) {
	this.log = log;
	this.url = config["statedevice_url"];
	this.service = config["service"];
	this.name = config["name"];
}

HttpAccessory.prototype = {
  	getState: function(callback) {
    console.log(this.name, " triggered");
    superagent.get(this.url).then(function(response){
		const body = response.body;
		// console.log("body", body);
		const sensordata = body.data.last_data.DA;
		console.log(this.name, " data: ", sensordata);
		callback(null,sensordata);
	});
  },

  identify: function(callback) {
		this.log("Security System: Identify requested!");
		callback();
	},

	getServices: function() {
		var informationService = new Service.AccessoryInformation();
		    informationService
      			.setCharacteristic(Characteristic.Manufacturer, "NinjaBlocks")
				.setCharacteristic(Characteristic.Model, "NinjaBlock")
				.setCharacteristic(Characteristic.SerialNumber, "n/a")
		if (this.service == "Security System") {
      			Service = new Service.SecuritySystem(this.name);
				Service
			        .getCharacteristic(Characteristic.SecuritySystemCurrentState)
			        .on('get', this.getState.bind(this));

	return [informationService, Service];
		}
	}
};
