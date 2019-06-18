import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'
import '../device-discover-button'
import '../camera-gallery-button'
import '../global-tts'

class HybridUiExamplePage extends connect(store)(PageView) {
  static get styles() {
    return [
      css`
        .tabbed > input {
          display: none;
        }
        .tabbed > input:not(:checked) + section > div {
          display: none;
        }
        .tabbed > section > h1 {
          float: left;
        }
        .tabbed > section > div {
          float: right;
          width: 100%;
          margin: 2.5em 0 0 -100%;
        }
        .tabbed {
          float: left;
          width: 100%;
        }
        .tabbed > section > h1 > label {
          cursor: pointer;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-select: none;
        }
        .tabbed > section > div {
          box-sizing: border-box;
          padding: 0.5em 0.75em;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.0625);
          background: #fff;
        }
        .tabbed > section > h1 {
          box-sizing: border-box;
          margin: 0;
          padding: 0.5em 0.5em 0;
          overflow: hidden;
          font-size: 1em;
          font-weight: normal;
        }
        .tabbed > section > h1 > label {
          display: block;
          padding: 0.25em 0.75em;
          border: 1px solid #ddd;
          border-bottom: none;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.0625);
          background: #fff;
        }
        .tabbed > input:first-child + section > h1 {
          padding-left: 1em;
        }
        .tabbed > section > div {
          position: relative;
          z-index: 1;
          width: 100%;
        }
        .tabbed > input:checked + section > h1 {
          position: relative;
          z-index: 2;
        }
      `
    ]
  }

  static get properties() {
    return {
      HybridUi: String,
      devices: String,
      cameraImage: String,
      galleryImage: String
    }
  }

  constructor() {
    super()

    this.ttsTextImm = 'Hello World, Hello Korea, Hello HatioLab~~~~~ '
    this.ttsText = `Egypt has one of the longest histories of any country, 
      tracing its heritage back to the 6th–4th millennia BCE. Considered a cradle of civilisation`
  }

  render() {
    var cameraTemp = html`
      ${this.cameraImage
        ? html`
            <img style="height:80%;width:90%" src=${this.cameraImage} alt="Camera Test" />
          `
        : html`
            <p>camera</p>
          `}
    `

    var galleryTemp = html`
      ${this.galleryImage
        ? html`
            <img style="height:80%;width:90%" src=${this.cameraImage} alt="Camera Test" />
          `
        : html`
            <p>gallery</p>
          `}
    `

    return html`
      <div class="tabbed">
        <!-- first panel -->
        <input name="tabbed" id="tabbed1" type="radio" checked />
        <section>
          <h1>
            <label for="tabbed1">camera</label>
          </h1>
          <div>
            <camera-gallery-button
              sourceType="1"
              .result="${this.cameraImage}"
              @get-picture-success="${this._onGetPictureSuccess}"
              @get-picture-error="${this._onGetPictureError}"
            >
            </camera-gallery-button>
            ${cameraTemp}
          </div>
        </section>

        <!-- second panel -->
        <input name="tabbed" id="tabbed2" type="radio" />
        <section>
          <h1>
            <label for="tabbed2">gallery</label>
          </h1>
          <div>
            <camera-gallery-button
              sourceType="1"
              @get-picture-success="${this._onGetPictureSuccess}"
              @get-picture-error="${this._onGetPictureError}"
            >
            ${galleryTemp}
          </div>
        </section>

        <input name="tabbed" id="tabbed3" type="radio" />
        <section>
          <h1>
            <label for="tabbed3">devices</label>
          </h1>
          <div>
            <device-discover-button @device-discovered="${this._onDeviceDiscovered}"></device-discover-button>
            <ul></ul>
          </div>
        </section>

        <input name="tabbed" id="tabbed4" type="radio" />
        <section>
          <global-tts></global-tts>
          <h1>
            <label for="tabbed4">TTS</label>
          </h1>
          <div>
            <input value="${this.ttsText}"></input>
            <button @click="${this._onSpeak}">SPEAK</button>
            <input value="${this.ttsTextImm}"></input>
            <button @click="${this._onSpeakImmediate}">SPEAK IMMEDIATE</button>
          </div>
        </section>

        <!--<input name="tabbed" id="tabbed5" type="radio" />
        <section>
          <h1>
            <label for="tabbed5">OCR</label>
          </h1>
          <div>
            
          </div>
        </section>

        <input name="tabbed" id="tabbed6" type="radio" />
        <section>
          <h1>
            <label for="tabbed6">BARCODE-SCANNER</label>
          </h1>
          <div>
            
          </div>
        </section>-->
      </div>
    `
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, key) => {
      console.log(`changedProps: ${key}: ${this[key]}`)
    })
  }

  _onGetPictureSuccess(e) {
    var result = e.detail.result
    // this.cameraImage = result
    console.log(result)
  }

  _onGetPictureError(e) {
    console.log(e.detail.result)
  }

  _onDeviceDiscovered(e) {
    console.log(e.detail.result)
  }

  _onSpeak(e) {
    THTTS.speak(this.ttsText)
  }

  _onSpeakImmediate(e) {
    THTTS.speakImmediate(this.ttsTextImm)
  }
}

// <!-- dom-repeat -->
// ${this.devices.map(
//   i =>
//     html`
//       <li>${i}</li>
//     `
// )}

window.customElements.define('hybrid-ui-example-page', HybridUiExamplePage)
