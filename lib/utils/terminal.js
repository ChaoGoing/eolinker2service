const inquirer = require('inquirer')

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

module.exports = {
  getModeByTerminal
}
