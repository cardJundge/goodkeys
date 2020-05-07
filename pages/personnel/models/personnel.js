import {
  HTTP
} from '../../../utils/http.js'

class PersonnelModel extends HTTP {

  // 获取作业员列表
  getTaskList(param, callback) {
    var params = {
      url: '/api/ser/user/task',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 添加人员
  addTask(param, callback) {
    var params = {
      url: '/api/ser/user/increase',
      type: 'POST',
      auth: true,
      data: {
        nickname: param.nickName,
        mobile: param.mobile,
        job_no: param.jobNo,
        org: param.org,
        password: param.password,
        module: param.module,
        type: param.type,
        group_id: param.groupId,
        service_id: param.serviceId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 获取分组
  getGroupList(callback) {
    var params = {
      url: '/api/ser/user/group',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 编辑分组
  editGroupList(param, callback) {
    var params = {
      url: '/api/ser/group/edit',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 删除分组
  delGroupList(id, callback) {
    var params = {
      url: '/api/ser/group/'+ id + '/delete',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 编辑人员
  editTask(param, callback) {
    var params = {
      url: '/api/ser/user/store',
      type: 'POST',
      auth: true,
      data: {
        nickname: param.nickName,
        mobile: param.mobile,
        job_no: param.jobNo,
        password: param.password,
        module: param.module,
        org: param.org,
        type: param.type,
        group_id: param.groupId,
        id: param.id,
        service_id: param.serviceId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 删除作业员
  delTask(id, callback) {
    var params = {
      url: '/api/ser/user/remove/' + id,
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 获取服务商拥有的模块
  getModule(callback) {
    var params = {
      url: '/api/ser/user/module',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 增加分组
  addGroup(param, callback) {
    var params = {
      url: '/api/ser/group/add',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

}
export {
  PersonnelModel
}