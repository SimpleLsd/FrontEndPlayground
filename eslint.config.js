import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  rules: {
    'vue/block-order': ['error', {
      order: [['script', 'template'], 'style'],
    }],
  },
})
