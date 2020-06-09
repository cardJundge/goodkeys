import {
  HTTP
} from '../../../utils/http.js'

class ClockInModel extends HTTP {
  // 获取请假审批列表
  getLeaveList(param, callback) {
    var params = {
      url: '/api/ser/leave',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 请假拒绝
  leaveRefuse(param, callback) {
    var params = {
      url: '/api/ser/leave/refuse',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 请假同意
  leaveAgree(param, callback) {
    var params = {
      url: '/api/ser/leave/' + param.id + '/agree',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 判断之前是否已设置
  judgeTempAttendance(callback) {
    var params = {
      url: '/api/ser/clock/setup',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 临时考勤设置
  tempAttendance(param, callback) {
    var params = {
      url: '/api/ser/clock/setup',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 打卡列表
  getClockList(param, callback) {
    var params = {
      url: '/api/ser/clock',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 每日考勤详情
  getClockDetails(param, callback) {
    var params = {
      url: '/api/clock/month/info',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 每日打卡详情
  getDayClockDetails(param, callback) {
    var params = {
      url: '/api/clock/get',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 周、月考勤统计
  getClockStatistics(param, callback) {
    var params = {
      url: '/api/clock/month',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

}

export {
  ClockInModel
}