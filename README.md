# homebridge-ninjablock-alarmstatedevice
[NinjaBlock](https://developers.ninja/legacy/index.html) plugin for [HomeBridge](https://github.com/nfarina/homebridge)

# Installation


1. Install homebridge using: npm install -g homebridge
2. Install this plugin using: npm install -g homebridge-ninjablock-alarmstatedevice
3. Update your configuration file. See sample config.json snippet below. 

# Configuration of the NinjaBlock Cloud

Enable the States Service in Settings: Services if you haven't already.
You'll see a new Widget on your Dashboard, called 'Generic State Device'.
Use the cog (Widget Menu) and add a new Custom State. Name it 'stay armed'.
Do this again, name the state 'disarmed'. Other states supported: 'alarm triggered', 'away armed' and 'night armed'

# Configuration of the plugin

Configuration sample:

 ```
 {
"accessory": "NinjaBlock-AlarmStateDevice",
"statedevice_url" : "<YOUR URL GOES HERE>",
"service" : "Security System",
"name" : "NinjaBlock Security System"
 }
```

Fields: 
* "accessory": Must always be "NinjaBlock-AlarmStateDevice" (required)
* "statedevice_url": Get the API Endpoint URL from the [NinjaBlocks Dashboard](https://a.ninja.is/home), add "?user_access_token=" and add your [API Access Token](https://a.ninja.is/hacking).
*   Example: https://a.ninja.is/rest/v0/device/4412BB000300_0101_0_30?user_access_token=abc123"
* "service": Must always be "Security System" (required)
* "name": Can be anything but is required and will be picked by SIRI as the name of your accessory.
