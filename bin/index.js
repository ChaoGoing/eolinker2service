#!/usr/bin/env node

const fs = require('fs')
const { login } = require('../lib/utils/request')
const { addApi, addModule } = require('../lib/modules')
const { getModeByTerminal } = require('../lib/utils/terminal')

const modules = {
  addApi,
  addModule
}

~(async function () {
  await login()

  const command = await getModeByTerminal()
  let module
  if ((module = modules[command])) {
    module()
  }
})()
