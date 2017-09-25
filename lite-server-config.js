const localIp = require('get-my-local-ip')
console.log('localip:', localIp)
module.exports = {
  files: ['./src/**/*.{html,htm,css,js,less}'],
  server: {
    baseDir: './src',
    routes: {
      "/node_modules": "node_modules"
    }
  },
  open: 'external',
  host: localIp.address, //需要搭配 open:'external' 才会生效
  port: 3005,
  startPath: "/index.html",
  reloadDebounce: 10,
  notify: false
}
