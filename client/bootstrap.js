import { store } from '@things-factory/shell'
import { UPDATE_PAGE } from '@things-factory/shell'

export default function bootstrap() {
  store.dispatch({
    type: UPDATE_PAGE,
    page: 'cordova-ui-example'
  })
}
