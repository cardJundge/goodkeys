import {
  HTTP
} from '../../../../utils/http.js'
var app = getApp()

class StatisticsModel extends HTTP {
  getAllStatistics(param, callback) {
      var params = {
        url: '/api/ser/module/stats',
        type: 'GET',
        auth: true,
        data: param,
        sCallback: callback
      }
      this.request(params)
    }
  
}

export {
  StatisticsModel
}