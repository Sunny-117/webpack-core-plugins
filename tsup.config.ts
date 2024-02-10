import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'tsup'

const sourceFolder = 'src/templates'
const targetFolder = 'dist/templates'

/*
 * https://github.com/egoist/tsup/issues/369
 * https://github.com/egoist/tsup/pull/403
 */
export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['cjs', 'esm'],
  target: 'node18',
  splitting: true,
  cjsInterop: true,
  clean: true,
  dts: true,
  platform: 'node',
  sourcemap: true,
  async onSuccess() {
    console.log('Build successful-------')
    copyFolderSync(sourceFolder, targetFolder)
  },
})

function copyFolderSync(source, target) {
  if (!fs.existsSync(target))
    fs.mkdirSync(target)

  const files = fs.readdirSync(source)

  files.forEach((file) => {
    const currentPath = path.join(source, file)
    const targetPath = path.join(target, file)

    if (fs.lstatSync(currentPath).isDirectory())
      copyFolderSync(currentPath, targetPath)
    else
      fs.copyFileSync(currentPath, targetPath)
  })
}
