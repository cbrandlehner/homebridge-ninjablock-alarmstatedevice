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

/*
// The value property of SecuritySystemCurrentState must be one of the following:
Characteristic.SecuritySystemCurrentState.STAY_ARM = 0;
Characteristic.SecuritySystemCurrentState.AWAY_ARM = 1;
Characteristic.SecuritySystemCurrentState.NIGHT_ARM = 2;
Characteristic.SecuritySystemCurrentState.DISARMED = 3;
Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED = 4;
// The value property of SecuritySystemTargetState must be one of the following:
Characteristic.SecuritySystemTargetState.STAY_ARM = 0;
Characteristic.SecuritySystemTargetState.AWAY_ARM = 1;
Characteristic.SecuritySystemTargetState.NIGHT_ARM = 2;
Characteristic.SecuritySystemTargetState.DISARM = 3;
*/

HttpAccessory.prototype = {
  	getState: function(callback) {
    	console.log(this.name, "getState triggered");
    	superagent.get(this.url).then(function(response){
			const body = response.body;
			// console.log("body", body);
			const sensordata = body.data.last_data.DA;
			console.log("Security System getState data:", sensordata);
			// callback(null,sensordata);
			if (sensordata == 'stay armed'){
				console.log("Security System stay armed");
				callback(null,0)
				} else if(sensordata == 'away armed')
				{
				console.log("Security System away armed");
				callback(null,1)	
				}else if(sensordata == 'night armed')
				{
				console.log("Security System night armed");
				callback(null,2)	
				}else if(sensordata == 'disarmed')
				{
				console.log("Security System disarmed");
				callback(null,3)	
				} else {
				console.log("Security System alarm triggered");
				callback(null,4)	
				} 

		});
	},
	setState: function(state, callback) {
		console.log(this.name, "setState triggered with", state);
		var SecuritySystemTargetState;
		if (state=='0'){
			SecuritySystemTargetState = '{"DA":"stay armed"}'
		} else if (state=='1'){
			SecuritySystemTargetState = '{"DA":"away armed"}'
		} else if (state=='2'){
			SecuritySystemTargetState = '{"DA":"night armed"}'
		} else {
			SecuritySystemTargetState = '{"DA":"disarmed"}'
		}
		console.log('setting state device to:',SecuritySystemTargetState);
		superagent
    		.put(this.url)
    			.set('Content-Type', 'application/json')
    			.send(SecuritySystemTargetState)
    			.then(function(response){
					const body = response.body;
					console.log("setState server response:", body);
					callback(null,null);
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
				.setCharacteristic(Characteristic.SerialNumber, "0.1.7")
		  	SecurityService = new Service.SecuritySystem(this.name);
			SecurityService
			    .getCharacteristic(Characteristic.SecuritySystemCurrentState)
			    .on('get', this.getState.bind(this));

			SecurityService
    			.getCharacteristic(Characteristic.SecuritySystemTargetState)
    			.on('get', this.getState.bind(this))
    			.on('set', this.setState.bind(this));

		return [informationService, SecurityService];
	}
};
