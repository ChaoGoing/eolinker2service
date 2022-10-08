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

const getFileFromDirCatalog = async (dirname) => {
  const infos = fs.readdirSync(dirname);
  const promptList = [
    {
      type: "list",
      name: "file",
      message: "请选择文件/文件夹",
      choices: infos.map((item) => {
        return {
          name: item,
          value: item,
        };
      }),
    },
  ];
  const { file } = await inquirer.prompt(promptList);
  return {
    file,
    pathname: path.join(dirname, file)
  }
}

const getSelectedFileByTerminal = async () => {
  async function loopGetFile(dirname) {
    const { pathname } = await getFileFromDirCatalog(dirname)
    const state = fs.statSync(pathname)
    if(!state.isFile()) {
      return loopGetFile(pathname)
    }
    return pathname
  }

  const selectFilePathName = await loopGetFile(__dirname)
  const fileInfo = fs.readFileSync(selectFilePathName, 'utf8')
  console.log('fileInfo: ', fileInfo);
}

module.exports = {
  getModeByTerminal
}
