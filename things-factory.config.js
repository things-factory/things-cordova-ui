import route from './client/route'
import bootstrap from './client/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'cordova-ui-example-page',
      page: 'cordova-ui-example'
    }
  ],
  bootstrap
}
