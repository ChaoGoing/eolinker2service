const { getApi, getApiList } = require('./utils/request')
const { getProjectListByTerminal, getGroupListByTerminal, getApiListByTerminal } = require('./utils/terminal')

function gerenateApiTSText(moduleName, data) {
  let result = `declare namespace ${moduleName} {`
  // 生成类型文件
  const {
    apiInfo: { requestInfo, resultInfo },
  } = await getApi({ projectId, api });
  console.log('apiInfo: ', requestInfo, resultInfo);

  
}

exports.addApi = async function () {
  const projectID = await getProjectListByTerminal()
  const groupID = await getGroupListByTerminal(projectID)
  const apiID = await getApiListByTerminal(projectID, groupID)

  const apiInfo = getApi({ projectId, api: apiID })
  const apiText = gerenateApiTSText(apiInfo)
}

exports.addModule = async function () {
  const projectId = await getProjectListByTerminal()
  const groupId = await getGroupListByTerminal(projectID)
  const apiList = getApiList({ projectId, groupId })
  const moduleName = 'API'

  gerenateApiTSText()

}
