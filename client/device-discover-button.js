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
      st: String,
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

    this.st = 'urn:things-factory:device:all:all' // FIXME
  }

  render() {
    if (typeof ssdp != 'undefined') {
      this.discoverType = 'M'
    } else if (!this.electron) {
      let electron = require('electron')
      if (electron) {
        this.discoverType = 'D'
        let ipcRenderer = electron.ipcRenderer
        ipcRenderer.on('discovered-device', (e, response) => {
          this._discoverDeviceCallback.call(this, response)
        })

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

  firstUpdated() {}

  updated(changedProps) {}

  _onClick(e) {
    if (this.discoverType === 'M') {
      ssdp.search(
        this.st,
        response => {
          this._searchSuccessCallback.call(this, response)
        },
        error => {
          this._searchErrorCallback.call(this, error)
        }
      )
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

  _discoverDeviceCallback(response) {
    console.log(response)

    try {
      var info = JSON.parse(response)
    } catch (e) {
      console.warn(e)
    }

    if (!info || !info.loaction) {
      return
    }

    this.dispatchEvent(
      new CustomEvent('device-discovered', {
        bubbles: true,
        composed: true,
        detail: { response: response }
      })
    )
  }

  _searchSuccessCallback(result) {
    if (!result) {
      return
    }

    this.dispatchEvent(
      new CustomEvent('ssdp-search-success', {
        bubbles: true,
        composed: true,
        detail: { result: result }
      })
    )
  }

  _searchErrorCallback(result) {
    if (!result) {
      return
    }

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
