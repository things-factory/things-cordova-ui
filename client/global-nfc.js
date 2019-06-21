import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class GlobalNfc extends connect(store)(LitElement) {
  static get styles() {
    return []
  }

  static get properties() {
  },

  constructor() {
    super()

    window.NFC = this
  }

  render() {
  }

  nfcAddListener(ndefCallback, successCallback, errorCallback)) {
    nfc && nfc.addNdefListener(ndefCallback, successCallback, errorCallback);
  }

  nfcRemoveListener(ndefCallback, successCallback, errorCallback) {
    nfc && nfc.removeNdefListener(ndefCallback, successCallback, errorCallback);
  }

  writeNfcData (values, successCallback, errorCallback) {
    try {
        values = JSON.stringify(values);
    } catch (e) {
        console.warn(e)
    }

    // var record = ndef.mimeMediaRecord('text/plain', nfc.stringToBytes(value));
    var record = ndef.textRecord(values);

    nfc.write([record], result => {
      console.log('NFC write success!');
      successCallback && successCallback.call(this, result)
    }, error => {
      errorCallback && errorCallback.call(this, error)
    });
  }
}

customElements.define('global-nfc', GlobalNfc)