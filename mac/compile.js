const { compile } = require('nexe')

if(!process.env.binFolder) {
  console.log(JSON.stringify(process.env));
  process.exit(1);
}

compile({ 
  build: true,
  make: [ '-j4' ],
  input: '../index.js',
  output: (process.env.binFolder || "..") + '/bin/mac/picgo',
  name: "picgo-cli",
  resources: ["node_modules/**/*", "!node_modules/nexe/*"],
  patches: [
    (x, next) => {
      x.code = () => [x.shims.join(''), x.input].join(';')
      return next()
    },
   async (compiler, next) => {
      await compiler.setFileContentsAsync(
        'lib/_third_party_main.js',
        compiler.code()
      )
      compiler.options.empty = true // <-- ADDED THIS (hack)
      return next()
    }
  ]
}).then(() => {
  process.exit(0);
});