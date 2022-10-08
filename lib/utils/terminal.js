const inquirer = require('inquirer')
const { getProjectList, getGroupList, getApiList } = require('./request')

const getModeByTerminal = async () => {
  const promptList = [
    {
      type: 'list',
      name: 'mode',
      message: '请选择引入方式',
      choices: [
        {
          name: '新增模块',
          value: 'addModule'
        },
        {
          name: '新增接口',
          value: 'addApi'
        }
      ]
    }
  ]

  const { mode } = await inquirer.prompt(promptList)
  return mode
}

const getProjectListByTerminal = async () => {
  const projectList = await getProjectList()

  if (!projectList?.length) {
    return console.error('无可用的项目')
  }
  const promptList = [
    {
      type: 'list',
      name: 'projectID',
      message: '请选择引入方式',
      choices: projectList.map(({ projectName, projectID }) => ({
        name: projectName,
        value: projectID
      }))
    }
  ]

  const { projectID } = await inquirer.prompt(promptList)

  return projectID
}

const getGroupListByTerminal = async projectID => {
  const groupList = await getGroupList(projectID)

  if (!groupList?.length) {
    return console.error('无可用的模块')
  }
  const promptList = [
    {
      type: 'list',
      name: 'groupID',
      message: '请选择引入方式',
      choices: groupList.map(({ groupName, groupID }) => ({
        name: groupName,
        value: groupID
      }))
    }
  ]

  const { groupID } = await inquirer.prompt(promptList)

  return groupID
}

const getApiListByTerminal = async (projectId, groupId) => {
  const apiList = await getApiList({ projectId, groupId })
  console.log('apiList: ', apiList)

  if (!apiList?.length) {
    return console.error('无可用的接口')
  }
  const promptList = [
    {
      type: 'list',
      name: 'apiID',
      message: '请选择引入方式',
      choices: apiList.map(({ apiName, apiID }) => ({
        name: apiName,
        value: apiID
      }))
    }
  ]

  const { apiID } = await inquirer.prompt(promptList)

  return apiID
}

module.exports = {
  getModeByTerminal,
  getProjectListByTerminal,
  getGroupListByTerminal,
  getApiListByTerminal
}
