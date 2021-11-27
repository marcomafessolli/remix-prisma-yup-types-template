const fs = require('fs')
const path = require('path')

const modelDirectory = path.join(__dirname, '../app/models')

const models = fs
  .readdirSync(modelDirectory, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dir) => `'${dir.name}'`)
  .join(',')

const fileTemplate = `const MODELS = [${models}] as const

export type APP_MODELS = typeof MODELS[number]
`

fs.writeFileSync(path.join(modelDirectory, '/models.ts'), fileTemplate)
