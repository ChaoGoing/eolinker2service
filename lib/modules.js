const { getApi } = require('./utils/request')
const { getProjectListByTerminal, getGroupListByTerminal, getApiListByTerminal } = require('./utils/terminal')

function gerenateApiTSText(apiInfo) {
  let result = ''
  // 生成类型文件
  

  
}

exports.addApi = async function () {
  const projectID = await getProjectListByTerminal()
  const groupID = await getGroupListByTerminal(projectID)
  const apiID = await getApiListByTerminal(projectID, groupID)
  console.log('apiID: ', apiID)
  const apiInfo = getApi({ projectId, api: apiID })
  const apiText = gerenateApiTSText(apiInfo)
}

exports.addModule = async function () {
  const projectID = await getProjectListByTerminal()
  const groupID = await getGroupListByTerminal(projectID)
}
