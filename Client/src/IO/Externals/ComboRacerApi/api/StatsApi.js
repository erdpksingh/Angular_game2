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
    define(['ApiClient', 'model/UserStatistics'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/UserStatistics'));
  } else {
    // Browser globals (root is window)
    if (!root.ComboRacerApi) {
      root.ComboRacerApi = {};
    }
    root.ComboRacerApi.StatsApi = factory(root.ComboRacerApi.ApiClient, root.ComboRacerApi.UserStatistics);
  }
}(this, function(ApiClient, UserStatistics) {
  'use strict';

  /**
   * Stats service.
   * @module api/StatsApi
   * @version 1.0.0
   */

  /**
   * Constructs a new StatsApi. 
   * @alias module:api/StatsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the statsGet operation.
     * @callback module:api/StatsApi~statsGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserStatistics} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the user statistics
     * @param {String} userId User ID to get the highscore entries for
     * @param {Number} contentId Content ID of the game
     * @param {Object} opts Optional parameters
     * @param {Number} opts.groupId Group (optional)
     * @param {module:api/StatsApi~statsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserStatistics}
     */
    this.statsGet = function(userId, contentId, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'userId' is set
      if (userId === undefined || userId === null) {
        throw new Error("Missing the required parameter 'userId' when calling statsGet");
      }

      // verify the required parameter 'contentId' is set
      if (contentId === undefined || contentId === null) {
        throw new Error("Missing the required parameter 'contentId' when calling statsGet");
      }


      var pathParams = {
      };
      var queryParams = {
        'user_id': userId,
        'content_id': contentId,
        'group_id': opts['groupId'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['api_key'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = UserStatistics;

      return this.apiClient.callApi(
        '/stats', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));
