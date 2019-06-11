import { html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'
import '../device-discover-button'

class CordovaUiExamplePage extends connect(store)(PageView) {
  static get properties() {
    return {
      thingsCordovaUi: String
    }
  }
  render() {
    return html`
      <section>
        <h2>ThingsCordovaUi</h2>
        <img src=${logo}></img>
      </section>

      <device-discover-button></device-discover-button>
    `
  }

  stateChanged(state) {}
}

window.customElements.define('cordova-ui-example-page', CordovaUiExamplePage)
