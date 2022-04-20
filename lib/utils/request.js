const qs = require('qs')
const axios = require('axios')
const { getConfigSync } = require('./resolveConfig')

const __config__ = getConfigSync()
console.log('__config__: ', __config__)

const http = axios.create({
  headers: {
    Cookie: 'PHPSESSID=gf6bohf0ed444spjdan1l0kvt5',
    Host: __config__.domain.replace('https://', ''),
    Origin: __config__.domain,
    'Content-Type': 'application/x-www-form-urlencoded'
    //go_admin_session: '', // 会自动添加
  }
})

http.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    // console.log(response.request)
    let res = response.data
    // console.log(res);
    // 提前判断
    return res
  },
  async error => {
    let response = error.response
    console.log(response)
    return Promise.reject(response.data)
  }
)

const login = async () => {
  try {
    const res = await http.post(
      `${__config__.domain}/server/index.php?g=Web&c=Guest&o=login`,
      qs.stringify({
        loginName: __config__.username,
        loginPassword: __config__.password
      })
    )
    if (res.userID) {
      console.log('登录成功')
      return res
    }
    throw new Error('get no userId from login res')
  } catch (e) {
    console.error('登录失败', e)
  }
}

// 获取项目列表
const getProjectList = async () => {
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Project&o=getProjectList`,
    qs.stringify({
      projectType: -1
    })
  )
  return res.projectList
}

// 获取模块列表
const getGroupList = async projectID => {
  console.log('获取模块列表中，有时候很快，有时候可能需要两分钟，耐心等一下就好')
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Group&o=getGroupList`,
    qs.stringify({
      projectID,
      groupID: -1,
      childGroupID: -1
    })
  )
  if (!res.groupList) {
    console.error('列表获取有问题，可能是用户账号和密码错误，也可能是项目id不正确')
    return []
  } else {
    console.log('获取模块列表成功')
    return res.groupList
  }
}

// 获取api列表
const getApiList = async ({ projectId, groupId }) => {
  console.log('获取api列表中')
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Api&o=getApiList`,
    qs.stringify({
      projectID: projectId,
      groupID: groupId,
      orderBy: 1,
      asc: 1
    })
  )
  console.log('获取api列表成功')
  return res.apiList
}

const loginout = async () => {
  // 退出登录
  return await http.post(`${__config__.domain}/server/index.php?g=Web&c=User&o=logout`)
}

const getApi = async ({ projectId, api }) => {
  const res = await http.post(
    `${__config__.domain}/server/index.php?g=Web&c=Api&o=getApi`,
    qs.stringify({
      projectID: projectId,
      groupID: api.groupID,
      apiID: api.apiID
    })
  )
  return res
}

module.exports = {
  login,
  getProjectList,
  getGroupList,
  getApiList,
  loginout,
  getApi
}
