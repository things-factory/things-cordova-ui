import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class GlobalTts extends connect(store)(LitElement) {
  static get styles() {
    return [css``]
  }

  static get properties() {
    return {
      successCallback: Object
    }
  }

  constructor() {
    super()

    window.THTTS = this
    window.TTS_TEXTS = []
  }

  render() {
    return html``
  }

  updated(changedProps) {}

  speakImmediate(text, locale = 'en-US', rate = 0.75) {
    if (!TTS) {
      return
    }

    TTS.speak(
      {
        text: text,
        locale: locale /* a string like 'en-US', 'zh-CN', etc */,
        rate: rate /** speed rate, 0 ~ 1 */
      },
      result => {
        if (typeof this.successCallback === 'string') {
          eval(this.successCallback).call(this, result)
        } else {
          this.successCallback.call(this, result)
        }
      },
      error => {
        if (typeof this.errorCallback === 'string') {
          eval(this.errorCallback).call(this, result)
        } else {
          this.errorCallback.call(this, error)
        }
      }
    )
  }

  speak(text, locale = 'en-US', rate = 0.75) {
    if (!TTS) {
      return
    }

    TTS_TEXTS.push({
      text: text,
      locale: locale /* a string like 'en-US', 'zh-CN', etc */,
      rate: rate /** speed rate, 0 ~ 1 */
    })

    if (this._isReading) {
      return
    }

    this._recursiveSpeak()
  }

  _recursiveSpeak() {
    var obj = TTS_TEXTS.shift()
    if (!obj) {
      this._isReading = false
      return
    }

    this._isReading = true
    TTS.speak(
      obj,
      result => {
        if (typeof this.successCallback === 'string') {
          eval(this.successCallback).call(this, result)
        } else {
          this.successCallback.call(this, result)
        }
      },
      error => {
        if (typeof this.errorCallback === 'string') {
          eval(this.errorCallback).call(this, result)
        } else {
          this.errorCallback.call(this, error)
        }
      }
    )
  }

  successCallback(result) {
    this._recursiveSpeak()
    console.log('tts: successCallback')
    this.result = result
    this.dispatchEvent(
      new CustomEvent('tts-success', {
        bubbles: true,
        composed: true,
        detail: { result }
      })
    )
  }

  _errorCallback(result) {
    this._recursiveSpeak()
    console.log('tts: _errorCallback')
    this.dispatchEvent(
      new CustomEvent('tts-error', {
        bubbles: true,
        composed: true,
        detail: { result }
      })
    )
  }
}

customElements.define('global-tts', GlobalTts)



// // TODO queue

// // Array.prototype.shift()
// TTS.speak({
//   text: 'hello, world!',
//   locale: 'en-GB',
//   rate: 0.75
// }).then(
//   () => {
//     alert('success')
//   },
//   (reason) => {
//     alert(reason)
//   }
// )
