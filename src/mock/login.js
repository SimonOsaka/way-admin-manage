// import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: '40ea1605f376771837e8e9787687e8f9',
    userLoginId: 8,
    introduction: '我是超级管理员',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar:
      'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const resultModel = {
  code: 200,
  msg: ''
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    resultModel['data'] = userMap[username]
    return resultModel
  },
  getUserInfo: config => {
    // const { token } = param2Obj(config.url)
    if (userMap['admin']) {
      resultModel['data'] = userMap['admin']
      return resultModel
    } else {
      return false
    }
  },
  logout: () => {
    resultModel['data'] = 'success'
    return resultModel
  }
}
