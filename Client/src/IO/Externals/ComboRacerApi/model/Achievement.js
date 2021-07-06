/**
 * Combo Racer API
 * This is the swagger documentation for Combo Racer API
 *
 * OpenAPI spec version: 1.0.0
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.5
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.ComboRacerApi) {
      root.ComboRacerApi = {};
    }
    root.ComboRacerApi.Achievement = factory(root.ComboRacerApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Achievement model module.
   * @module model/Achievement
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>Achievement</code>.
   * @alias module:model/Achievement
   * @class
   * @param achievementId {Number} 
   */
  var exports = function(achievementId) {
    var _this = this;

    _this['achievement_id'] = achievementId;


  };

  /**
   * Constructs a <code>Achievement</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Achievement} obj Optional instance to populate.
   * @return {module:model/Achievement} The populated <code>Achievement</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('achievement_id')) {
        obj['achievement_id'] = ApiClient.convertToType(data['achievement_id'], 'Number');
      }
      if (data.hasOwnProperty('unlocked')) {
        obj['unlocked'] = ApiClient.convertToType(data['unlocked'], 'Boolean');
      }
      if (data.hasOwnProperty('timestamp')) {
        obj['timestamp'] = ApiClient.convertToType(data['timestamp'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {Number} achievement_id
   */
  exports.prototype['achievement_id'] = undefined;
  /**
   * @member {Boolean} unlocked
   */
  exports.prototype['unlocked'] = undefined;
  /**
   * Timestamp when the achievement was unlocked
   * @member {Date} timestamp
   */
  exports.prototype['timestamp'] = undefined;



  return exports;
}));


