module.exports = {
  onPreBuild: async ({ utils: { run } }) => {
    await run.command('rm -rf node_modules')
    await run.command('yarn cache clean')
    await run.command('yarn install --check-files')
  },
}
