export default function route(page) {
  switch (page) {
    case 'hybrid-ui-example':
      import('./pages/hybrid-ui-example-page')
      return page
  }
}
