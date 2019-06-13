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
      discoverType: String, // M(mobile), D(desktop)
      buttonIconCls: String,
      buttonIcon: String,
      devices: Object
    }
  }

  // discover-button: constructor
  // discover-button: render
  // discover-button: firstUpdated  // 이 시점에 store가 undefined임.
  constructor() {
    super()

    this.buttonIconCls = 'material-icons'
    this.buttonIcon = 'settings_input_antenna'
  }

  render() {
    if (typeof ssdp != 'undefined') {
      this.discoverType = 'M'
    } else if (!this.electron) {
      let electron = require('electron')
      if (electron) {
        this.discoverType = 'D'
        let ipcRenderer = electron.ipcRenderer
        ipcRenderer.on('search-success-callback', this._searchSuccessCallback)
        ipcRenderer.on('search-error-callback', this._searchErrorCallback)

        this.electron = electron
      }
    }

    if (this.discoverType) {
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
    if (this.discoverType === 'M') {
      ssdp.search()  
    } else if (this.discoverType === 'D') {
      const ipcRenderer = this.electron.ipcRenderer
      if (ipcRenderer) {
        ipcRenderer.send('search-device', 'urn:things-factory:device:all:all')
      }
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
