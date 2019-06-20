import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class BarcodeScanner extends connect(store)(LitElement) {
  static get styles() {
    return [
      css``
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

    if (typeof cordova.plugins.barcodeScanner == 'undefined') {
      console.warn('barcodeScanner undefined')
      return
    }

    cordova.plugins.barcodeScanner.scan(
      result => {
        successCallback && successCallback.call(this, result)
      },
      error => {
        errorCallback && errorCallback.call(this, error)
      },
      this._options
    )
  }
}

customElements.define('barcode-scanner', BarcodeScanner)
