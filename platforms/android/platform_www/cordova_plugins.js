cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-ssdp.ssdp",
    "file": "plugins/cordova-plugin-ssdp/www/ssdp.js",
    "pluginId": "cordova-plugin-ssdp",
    "clobbers": [
      "ssdp"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-ssdp": "0.0.1"
};
// BOTTOM OF METADATA
});