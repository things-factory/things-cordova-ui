import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class DeviceDiscoverButton extends connect(store)(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          --search-button-width: 40px;
          --search-button-height: 40px;
          --search-icon-color: gray;
        }
        button {
          width: var(--search-button-width);
          height: var(--search-button-height);
          background-color: var(--secondary-light-color);
        }
        button i {
          color: var(--search-icon-color);
        }
      `
    ]
  }

  static get properties() {
    return {
      buttonIconCls: String,
      buttonIcon: String
    }
  }

  // discover-button: constructor
  // discover-button: render
  // discover-button: firstUpdated  // 이 시점에 store가 undefined임.
  constructor() {
    super()

    this.buttonIconCls = 'material-icons'
    // this.buttonIcon = 'cloud'
    this.buttonIcon = 'settings_input_antenna'
  }

  render() {
    if (typeof ssdp === 'undefined') {
      return html``
    } else {
      return html`
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <button @click=${this._onClick}><i class=${this.buttonIconCls}>${this.buttonIcon}</i></button>
      `
      // return html``
    }
  }

  firstUpdated() {
  }

  updated(changedProps) {
    if (!this.available) {
      return
    }
  }

  _onClick(e) {
    if (this.searchable) {
      ssdp.search()
    }
  }

  _listenSuccessCallback(result) {
    console.log(result)
  }

  _listenErrorCallback(result) {
    console.log(result)
  }

  _searchSuccessCallback(result, response) {
    this.dispatchEvent(
      new CustomEvent('ssdp-search-success', {
        bubbles: true,
        composed: true,
        detail: { result: result }
      })
    )
  }

  _searchErrorCallback() {
    console.log('errorCallback')
    this.dispatchEvent(
      new CustomEvent('ssdp-search-error', {
        bubbles: true,
        composed: true,
        detail: { result: result }
      })
    )
  }

  stateChanged(state) {
    // state
  }
}

customElements.define('device-discover-button', DeviceDiscoverButton)
