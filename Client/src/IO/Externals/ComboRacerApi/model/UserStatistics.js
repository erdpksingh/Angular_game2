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
    define(['ApiClient', 'model/Achievement', 'model/Team', 'model/UserID', 'model/UserScores'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Achievement'), require('./Team'), require('./UserID'), require('./UserScores'));
  } else {
    // Browser globals (root is window)
    if (!root.ComboRacerApi) {
      root.ComboRacerApi = {};
    }
    root.ComboRacerApi.UserStatistics = factory(root.ComboRacerApi.ApiClient, root.ComboRacerApi.Achievement, root.ComboRacerApi.Team, root.ComboRacerApi.UserID, root.ComboRacerApi.UserScores);
  }
}(this, function(ApiClient, Achievement, Team, UserID, UserScores) {
  'use strict';




  /**
   * The UserStatistics model module.
   * @module model/UserStatistics
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>UserStatistics</code>.
   * Statistics for user
   * @alias module:model/UserStatistics
   * @class
   * @param userId {module:model/UserID} 
   */
  var exports = function(userId) {
    var _this = this;

    _this['user_id'] = userId;




  };

  /**
   * Constructs a <code>UserStatistics</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UserStatistics} obj Optional instance to populate.
   * @return {module:model/UserStatistics} The populated <code>UserStatistics</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('user_id')) {
        obj['user_id'] = UserID.constructFromObject(data['user_id']);
      }
      if (data.hasOwnProperty('team_id')) {
        obj['team_id'] = Team.constructFromObject(data['team_id']);
      }
      if (data.hasOwnProperty('group_id')) {
        obj['group_id'] = ApiClient.convertToType(data['group_id'], 'Number');
      }
      if (data.hasOwnProperty('user_scores')) {
        obj['user_scores'] = UserScores.constructFromObject(data['user_scores']);
      }
      if (data.hasOwnProperty('achievements')) {
        obj['achievements'] = ApiClient.convertToType(data['achievements'], [Achievement]);
      }
    }
    return obj;
  }

  /**
   * @member {module:model/UserID} user_id
   */
  exports.prototype['user_id'] = undefined;
  /**
   * @member {module:model/Team} team_id
   */
  exports.prototype['team_id'] = undefined;
  /**
   * @member {Number} group_id
   */
  exports.prototype['group_id'] = undefined;
  /**
   * @member {module:model/UserScores} user_scores
   */
  exports.prototype['user_scores'] = undefined;
  /**
   * @member {Array.<module:model/Achievement>} achievements
   */
  exports.prototype['achievements'] = undefined;



  return exports;
}));


