import {
  HTTP
} from '../../../utils/http.js'

class UnionModel extends HTTP {

  // 创建联盟
  createUnion(param, callback) {
    var params = {
      url: '/api/ser/league/store',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 编辑联盟
  editUnion(param, callback) {
    var params = {
      url: '/api/ser/league/edit',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 联盟列表
  getUnionList(param, callback) {
    var params = {
      url: '/api/ser/league/list',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 获取联盟成员列表
  getMemberList(param, callback) {
    var params = {
      url: '/api/ser/league/' + param + '/user',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 申请加入联盟
  applyJoinUnion(param, callback) {
    var params = {
      url: '/api/ser/league/apply',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 申请通知
  applyNotice(callback) {
    var params = {
      url: '/api/ser/league/notice',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 踢人或主动退出联盟
  signOutUnion(param, callback) {
    var params = {
      url: '/api/ser/league/quit',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 同意/拒绝申请
  handleApply(param, callback) {
    var params = {
      url: '/api/ser/league/audit',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }
}
export {
  UnionModel
}