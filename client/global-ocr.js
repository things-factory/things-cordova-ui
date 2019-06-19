import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class GlobalOcr extends connect(store)(LitElement) {
  static get styles() {
    return [css``]
  }

  static get properties() {
    return {
      buttonIconCls: String,
      buttonIcon: String,
      result: {
        type: String,
        reflect: true
      }
    }
  }

  constructor() {
    super()
    window.OCR = this
  }

  render() {
    return html``
  }

  updated(changedProps) {}

  recText(successCallback, errorCallback, imageInfo, sourceType = 0) {
    if (typeof textocr === 'undefined') {
      return
    }

    textocr.recText(
      sourceType, // sourceType: NORMFILEURI(0), BASE64(4)
      imageInfo, // uriOrBase: uri or base64
      result => {
        successCallback.call(this, result)
      },
      error => {
        errorCallback.call(this, error)
      }
    )

    // textocr.recText(
    //   0, // sourceType: NORMFILEURI(0), BASE64(4)
    //   imageInfo, // uriOrBase: uri or base64
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
    //   }
    // )
  }

  // successCallback(result) {
  //   console.log('text-recognized: successCallback')
  //   this.result = result
  //   this.dispatchEvent(
  //     new CustomEvent('text-recognized-success', {
  //       bubbles: true,
  //       composed: true,
  //       detail: { result }
  //     })
  //   )
  // }

  // errorCallback(result) {
  //   console.log('text-recognized: errorCallback')
  //   this.dispatchEvent(
  //     new CustomEvent('text-recognized-error', {
  //       bubbles: true,
  //       composed: true,
  //       detail: { result }
  //     })
  //   )
  // }
}

customElements.define('global-ocr', GlobalOcr)
