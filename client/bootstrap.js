import { html } from 'lit-html'
import { store } from '@things-factory/shell'
import { UPDATE_PAGE } from '@things-factory/shell'
import { ADD_SETTING } from '@things-factory/setting-base'

export default function bootstrap() {
  store.dispatch({
    type: ADD_SETTING,
    setting: {
      seq: 10,
      template: html`
        <a href="./hybrid-ui-example">HybridUiExample</a>
      `
    }
  })
}