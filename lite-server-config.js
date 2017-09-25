module.exports = {
  files: ['./src/**/*.{html,htm,css,js,less}'],
  server: {
    baseDir: './src',
    routes: {
      "/node_modules": "node_modules"
  }
  },
  port: 3005,
  startPath: "/index.html",
  reloadDebounce: 10,
}
