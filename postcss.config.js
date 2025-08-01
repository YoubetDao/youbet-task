module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // 避免 ie 兼容警告
      overrideBrowserslist: ['defaults', 'not ie 11', 'not dead'],
      grid: false,
    },
  },
}
