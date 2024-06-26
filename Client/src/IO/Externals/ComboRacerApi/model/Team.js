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
    root.ComboRacerApi.Team = factory(root.ComboRacerApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';


  /**
   * Enum class Team.
   * @enum {}
   * @readonly
   */
  var exports = {
    /**
     * value: 0
     * @const
     */
    "0": 0,
    /**
     * value: 1
     * @const
     */
    "1": 1,
    /**
     * value: 2
     * @const
     */
    "2": 2  };

  /**
   * Returns a <code>Team</code> enum value from a Javascript object name.
   * @param {Object} data The plain JavaScript object containing the name of the enum value.
   * @return {module:model/Team} The enum <code>Team</code> value.
   */
  exports.constructFromObject = function(object) {
    return object;
  }

  return exports;
}));


