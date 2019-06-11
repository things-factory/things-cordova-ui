export default function route(page) {
  switch (page) {
    case 'cordova-ui-example':
      import('./pages/cordova-ui-example-page')
      return page
  }
}
