import antfu from '@antfu/eslint-config'

export default {
  ...antfu(),
  overrides: [
    {
      files: ['**/excluded-folder/**'], // 在这里替换为您要排除的文件夹路径
      rules: {
        // 在这里可以定义规则为 "off" 以禁用检查
      },
    },
  ],
}
