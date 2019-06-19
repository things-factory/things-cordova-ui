import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class BarcodeScanner extends connect(store)(LitElement) {
  static get styles() {
    return [
      css``

      // css`
      //   :host {
      //     --cam-button-width: 40px;
      //     --cam-button-height: 40px;
      //     --cam-icon-color: gray;
      //   }
      //   button {
      //     width: var(--cam-button-width);
      //     height: var(--cam-button-height);
      //     background-color: var(--secondary-light-color);
      //   }
      //   button i {
      //     color: var(--cam-icon-color);
      //   }
      // `
    ]
  }

  static get properties() {
    return {
      _options: Object,
      preferFrontCamera: Boolean, // iOS and Android
      showFlipCameraButton: Boolean, // iOS and Android
      showTorchButton: Boolean, // iOS and Android
      torchOn: Boolean, // Android, launch with the torch switched on (if available)
      saveHistory: Boolean, // Android, save scan history (default false)
      prompt: String, // Android
      resultDisplayDuration: Number, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats: String, // default: all but PDF_417 and RSS_EXPANDED
      orientation: String, // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: Boolean, // iOS
      disableSuccessBeep: Boolean // iOS and Android
    }
  }

  constructor() {
    super()

    this._options = {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: true, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: true, // Android, launch with the torch switched on (if available)
      saveHistory: false, // Android, save scan history (default false)
      prompt: 'Place a barcode inside the scan area', // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats: 'all', // default: all but PDF_417 and RSS_EXPANDED
      orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: false // iOS and Android
    }

    window.SCANNER = this
  }

  render() {
    return html``

    // if (typeof cordova === 'undefined') {
    //   return html``
    // } else {
    //   return html`
    //     <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    //     <button @click=${this._onClick}><i class=${this.buttonIconCls}>${this.buttonIcon}</i></button>
    //   `
    // }
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, key) => {
      if (key === '_options') {
        return
      }

      this._options[key] = this[key]
    })
  }

  scan(successCallback, errorCallback) {
    if (typeof cordova == 'undefined' || typeof cordova.plugins == 'undefined') {
      console.warn('cordova undefined')
      return
    }

    if (cordova.plugins.barcodeScanner == 'undefined') {
      console.warn('barcodeScanner undefined')
      return
    }

    cordova.plugins.barcodeScanner.scan(
      result => {
        successCallback.call(this, result)
      },
      error => {
          errorCallback.call(this, error)
      },
      this._options
    )

    // cordova.plugins.barcodeScanner.scan(
    //   result => {
    //     if (typeof this.successCallback === 'string') {
    //       eval(this.successCallback).call(this, result)
    //     } else {
    //       this.successCallback.call(this, result)
    //     }
    //   },
    //   error => {
    //     if (typeof this.errorCallback === 'string') {
    //       eval(this.errorCallback).call(this, result)
    //     } else {
    //       this.errorCallback.call(this, error)
    //     }
    //   },
    //   this._options
    // )
  }

  // successCallback(result) {
  //   console.log('barcode-scan: successCallback')
  //   this.result = result
  //   this.dispatchEvent(
  //     new CustomEvent('barcode-scan-success', {
  //       bubbles: true,
  //       composed: true,
  //       detail: { result }
  //     })
  //   )
  // }

  // errorCallback(result) {
  //   console.log('barcode-scan: errorCallback')
  //   this.dispatchEvent(
  //     new CustomEvent('barcode-scan-error', {
  //       bubbles: true,
  //       composed: true,
  //       detail: { result }
  //     })
  //   )
  // }
}

customElements.define('barcode-scanner', BarcodeScanner)
