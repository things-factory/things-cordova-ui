const fs = require('fs')
const util = require('util')
// const exec = require('child_process').exec
const exec = util.promisify(require('child_process').exec)

// 0. make directory & make file
//检测文件或者文件夹存在 nodeJS
const fsExistSync = path => {
  try {
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}

if (!fsExistSync('./www')) {
  exec('mkdir www')
}

// 1. check config.xml
if (!fsExistSync('./config.xml')) {
  console.warn('"config.xml" file not found!!!')
  return;
}

if (!fsExistSync('./platforms/android')) {
  exec('cordova plugins add android')
}

// 2. copy codrova.js to www/
exec('cp -a platforms/android/platform_www/cordova.js www')

const insertLine = require('insert-line')
const appendContent = (filepath, content, line) => {
  var context = fs.readFileSync(filepath, 'utf8')
  if (context.indexOf(content) < 0) {
    insertLine(filepath)
      .content(content)
      .at(line)
      .then(err => {
        if (err) {
          console.log(err)
        }
      })
  }
}

// 3. add cordova reference to index.html
const indexpath = './node_modules/@things-factory/shell/_index.html'
const cordovajs = '    <script type="text/javascript" src="./cordova.js"></script>'
appendContent(indexpath, cordovajs, 96) // FIXME: line

// 4. add gradle: for cordova-plugin-ssdp
const gradledepends = "    compile group: 'com.google.code.gson', name: 'gson', version: '2.8.5'"
const gradlepath = './platforms/android/app/build.gradle'
appendContent(gradlepath, gradledepends, 269)  // FIXME: line

const appendLine = (filepath, content) => {
  var context = fs.readFileSync(filepath, 'utf8')
  if (context.indexOf(content) < 0) {
    insertLine(filepath).appendSync(content)
  }
}

// 5. git ignore
const gitignorepath = './.gitignore'
appendLine(gitignorepath, 'platforms/')
appendLine(gitignorepath, 'plugins/')
appendLine(gitignorepath, 'www/')


const fixfile = (filepath, target, replacement) => {
  var context = fs.readFileSync(filepath, 'utf8')
  var result = context.replace(target, replacement)
  fs.writeFileSync(filepath, result, 'utf8')
}

// 6. fix @things-factory/shell's config public path
const webpackconfigdevpath = './node_modules/@things-factory/shell/webpack.config.dev.js'
fixfile(webpackconfigdevpath, "publicPath: '/'", "publicPath: './'")

// 7. fix @things-factory/shell's js src
fixfile(indexpath, '<base href="/" />', '<base href="./" />')
// const indexpath = './node_modules/@things-factory/shell/_index.html'
// fixfile(
//   indexpath,
//   '<script src="node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>',
// )

fixfile(
  './node_modules/@things-factory/i18n-base/client/i18next-config.js',
  "loadPath: '/assets/locales/{lng}.json'",
  "loadPath: './assets/locales/{lng}.json'"
)

// Fetch API cannot load file://authcheck/. URL scheme must be "http" or "https" for CORS request.
fixfile(
  './node_modules/@things-factory/shell/client/reducers/app.js',
  'baseUrl: location.origin,',
  "baseUrl: localStorage.getItem('things-factory.shell.BASE_URL'),"
)

// Fetch API cannot load file:///graphql. URL scheme "file" is not supported.
fixfile(
  './node_modules/@things-factory/shell/client/graphql-client.js',
  'GRAPHQL_URI,',
  "uri: localStorage.getItem('things-factory.shell.BASE_URL'),"
)

// static html file: ex: find <setting>
appendContent(
  './node_modules/@things-factory/shell/client/actions/route.js',
  "if (path.indexOf('/android_asset/www/') >= 0) { path = path.replace('/android_asset/www/', './') }",
  10
)

// append ssdp discover
appendContent(
  './node_modules/@things-factory/shell/client/index.js',
  "import '../../../../descover'",
  3
)