import {
  HTTP
} from '../../../utils/http.js'

class IndexModel extends HTTP {

  // 获取系统所有模块
  getAllModule(callback) {
    var params = {
      url: '/api/auth/modules',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 设置关联模块
  setSelfModule(param, callback) {
    var params = {
      url: '/api/ser/index/setModule',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 获取业务列表
  getWorkList(param, callback) {
    var params = {
      url: '/api/ser/work/lists',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 业务详情
  getBusinessDetail(key, id, type, callback) {
    var params = {
      url: '/api/ser/work/info',
      type: 'GET',
      auth: true,
      data: {
        key: key,
        id: id,
        type: type
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 获取增值服务信息
  getAddedInfo(param, callback) {
    var params = {
      url: '/api/added/' + param.id + '/info',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 系统中所有增值服务列表
  getAllAddedList(callback) {
    var params = {
      url: '/api/auth/classify',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 增值服务包使用详情
  getPackDetails(param, callback) {
    var params = {
      url: '/api/auth/order',
      type: 'GET',
      data: param,
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 获取疾病任务记录
  getSickRecordList(param, callback) {
    var params = {
      url: '/api/sick/task/'+ param.id + '/record',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 获取车物任务记录
  getVehicleRecordList(param, callback) {
    var params = {
      url: '/api/traffic/task/' + param.id + '/record',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 评价二维码生成
  // generateQrCode(id, callback) {
  //   var params = {
  //     url: '/api/ser/work/QRCode',
  //     type: 'GET',
  //     auth: true,
  //     data: {
  //       id: id
  //     },
  //     sCallback: callback
  //   }
  //   this.request(params)
  // }

  // 获取保险公司
  getInsurance(callback) {
    var params = {
      url: '/api/auth/insurance',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 增加业务
  addBusiness(param, callback) {
    var params = {
      url: '/api/ser/work/increase',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 编辑业务
  editBusiness(param, callback) {
    var params = {
      url: '/api/ser/work/edit',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 业务---》接单
  businessReceipt(id, key, callback) {
    var params = {
      url: '/api/ser/work/accept',
      type: 'GET',
      auth: true,
      data: {
        id: id,
        key: key
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 分配作业员
  assignmentTask(param, callback) {
    var params = {
      url: '/api/ser/work/allot',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 到达现场
  toScene(param, callback) {
    var params = {
      url: '/api/ser/work/arrive',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 完成结案
  finishCase(param, callback) {
    var params = {
      url: '/api/ser/work/finish',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 查勘定损---》添加明细
  addDetailed(param, callback) {
    var params = {
      url: '/api/ser/work/schedule',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 删除业务
  delBusiness(param, callback) {
    var params = {
      url: '/api/ser/work/remove',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // (疾病、车物)调查相关资料
  getRelatedData(param, callback) {
    var params = {
      url: '/api/work/' + param.listId + '/data/' + param.type,
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 车物调查添加任务
  addTask(param, callback) {
    var params = {
      url: '/api/traffic/task/insert',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 添加车物调查案件资料
  addRelatedInfo(param, callback) {
    var params = {
      url: '/api/auth/data',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 车物调查提交调查结论
  submitConclusion(param, callback) {
    var params = {
      url: '/api/work/audit',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 获取各模块下的联盟成员（公司）
  getModuleUnion(param, callback) {
    var params = {
      url: '/api/ser/work/league',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 转单
  toTransferOrder(param, callback) {
    var params = {
      url: '/api/ser/work/turn',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 退单
  backOrder(param, callback) {
    var params = {
      url: '/api/ser/work/back',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 转单详情
  getTransferOrderDetail(param, callback) {
    var params = {
      url: '/api/ser/turn/' + param.id + '/info',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 审核
  // examineCase(param, callback) {
  //   var params = {
  //     url: '/api/ser/work/audit',
  //     type: 'POST',
  //     auth: true,
  //     data: param,
  //     sCallback: callback
  //   }
  //   this.request(params)
  // }

  // 任务退回
  taskCaseReturn(param, callback) {
    var params = {
      url: '/api/ser/work/reject',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // --------------------------------------------
  // 新的模块

  // 添加模块
  addModule(param, callback) {
    var params = {
      url: '/api/ser/module/create',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 编辑模块
  editModule(param, callback) {
    var params = {
      url: '/api/ser/module/modify',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 删除模块
  delModule(param, callback) {
    var params = {
      url: '/api/ser/module/' + param.id + '/delete',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 新模块案件列表
  getTaskflowList(param, callback) {
    var params = {
      url: '/api/ser/case',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 新模块案件详情
  getTaskflowDetail(param, callback) {
    var params = {
      url: '/api/ser/case/' + param.id,
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 新模块添加案件
  addTaskflow(param, callback) {
    var params = {
      url: '/api/ser/case/create',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // 新模块案件删除
  delTaskflow(param, callback) {
    var params = {
      url: '/api/ser/case/' + param.id + '/delete',
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 获取添加模块字段
  getModuleField(param, callback) {
    var params = {
      url: '/api/ser/module/'+ param.id,
      type: 'GET',
      auth: true,
      sCallback: callback
    }
    this.request(params)
  }

  // 管理审批
  toApproval(param, callback) {
    var params = {
      url: '/api/ser/case/approval',
      type: 'POST',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

  // ----新模块统计-----
   // 首页数据统计
   dataStatistics(param, callback) {
    var params = {
      url: '/api/work/total',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }
  // 整体统计(统计详情)
  getAllStatistics(param, callback) {
    var params = {
      url: '/api/work/detail',
      type: 'GET',
      auth: true,
      data: param,
      sCallback: callback
    }
    this.request(params)
  }

}
export {
  IndexModel
}