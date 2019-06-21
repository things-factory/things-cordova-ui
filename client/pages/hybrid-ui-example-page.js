import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'
import '../camera-gallery-button'
import '../global-dd'
import '../global-tts'
import '../global-ocr'
import '../global-dd'
import '../barcode-scanner'

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

        .full {
          width: 100%;
          height: 100%;
        }
      `
    ]
  }

  static get properties() {
    return {
      HybridUi: String,
      devices: Object,
      cameraImage: String,
      galleryImage1: String,
      galleryImage2: String,
      barcodeText: String
    }
  }

  constructor() {
    super()

    this.ttsTextImm = 'Hello World, Hello HatioLab~~~~~ '
    this.ttsText1 = `Korea is a region in East Asia,[3] divided between two distinct sovereign states, North Korea and South Korea since 1948. `
    this.ttsText2 = `China (Chinese: 中国; pinyin: Zhōngguó; lit. "middle country"), officially the People's Republic of China (PRC), is a country in East Asia and the world's most populous country, with a population of around 1.404 billion`
    this.ttsText3 = `Egypt has one of the longest histories of any country, 
      tracing its heritage back to the 6th–4th millennia BCE. Considered a cradle of civilisation`
    this.devices = []
    this.dummyCallback = result => {
      console.log(`dummyCallback: ${result}`)
    }
  }

  render() {
    var cameraTemp = html`
      ${this.cameraImage
        ? html`
            <img style="height:80%;width:90%" src=${this.cameraImage} alt="Camera Test" />
          `
        : html``}
    `

    var galleryTemp1 = html`
      ${this.galleryImage1
        ? html`
            <img style="height:80%;width:90%" src=${this.galleryImage1} alt="Camera Test" />
          `
        : html``}
    `

    var galleryTemp2 = html`
      ${this.galleryImage2
        ? html`
            <img style="height:80%;width:90%" src=${this.galleryImage2} alt="Camera Test" />
          `
        : html``}
    `

    return html`
      <global-tts></global-tts>
      <global-ocr></global-ocr>
      <global-dd></global-dd>
      <barcode-scanner></barcode-scanner>
      <!--<global-tts successCallBack="${this.dummyCallback}"></global-tts>-->

      <div class="tabbed">
        <!-- first panel -->
        <input name="tabbed" id="tabbed1" type="radio" checked />
        <section>
          <h1>
            <label for="tabbed1">camera</label>
          </h1>
          <div class="full">
            <camera-gallery-button
              sourceType=1
              @get-picture-success="${this._onGetPictureCameraSuccess}"
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
          <div class="full">
            <camera-gallery-button
              sourceType=0
              destinationType=0
              @get-picture-success="${this._onGetPictureGallerySuccess}"
              @get-picture-error="${this._onGetPictureError}"
            >
            </camera-gallery-button>
            ${galleryTemp1}
          </div>
        </section>

        <!-- third panel -->
        <input name="tabbed" id="tabbed3" type="radio" />
        <section>
          <h1>
            <label for="tabbed3">DEVICES</label>
          </h1>
          <div class="full">
            <button @click="${this._onDeviceSearch}">DISCOVER</button>
            <button @click="${this._onDeviceClear}">CLEAR</button>
            ${this.devices.map(
              i =>
                html`
                  <li>${i}</li>
                `
            )}
          </div>
        </section>

        
        <input name="tabbed" id="tabbed4" type="radio" />
        <section>
          <h1>
            <label for="tabbed4">TTS</label>
          </h1>
          <div class="full">
            <div>
              <input style="width: 80%" value="${this.ttsText1}"></input>
              <button @click="${this._onSpeak1}">SPEAK</button>
            </div>
            <div>
              <input style="width: 80%" value="${this.ttsText2}"></input>
              <button @click="${this._onSpeak2}">SPEAK</button>
            </div>
            <div>
              <input style="width: 80%" value="${this.ttsText3}"></input>
              <button @click="${this._onSpeak3}">SPEAK</button>
            </div>
            <div>
              <input style="width: 80%" value="${this.ttsTextImm}"></input>
              <button @click="${this._onSpeakImmediate}">SPEAK IMMEDIATE</button>
            </div>
          </div>
        </section>

        <input name="tabbed" id="tabbed5" type="radio" />
        <section>
          <h1>
            <label for="tabbed5">OCR</label>
          </h1>
          <div class="full">
            <div>cordova-plugin-mobile-ocr: 동작안됨.</div>
            <camera-gallery-button
              sourceType=0
              destinationType=0
              @get-picture-success="${this._onGetPictureForOcrSuccess}"
              @get-picture-error="${this._onGetPictureError}"
            >
            </camera-gallery-button>
            ${galleryTemp2}
          <input style="width: 80%" value="${this.ocrText}"></input>
          </div>
        </section>

        <input name="tabbed" id="tabbed6" type="radio" />
        <section>
          <h1>
            <label for="tabbed6">BARCODE</label>
          </h1>
          <div class="full">
            <input style="width: 80%" value="${this.barcodeText}"></input>
            <button @click="${this._onScanBarcode}">scan</button>
          </div>
        </section>

        <input name="tabbed" id="tabbed7" type="radio" />
        <section>
          <h1>
            <label for="tabbed7">NFC</label>
          </h1>
          <div class="full">
          </div>
        </section>

        <input name="tabbed" id="tabbed8" type="radio" />
        <section>
          <h1>
            <label for="tabbed8">FP</label>
          </h1>
          <div class="full">
          </div>
        </section>
      </div>
    `
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, key) => {
      // console.log(`changedProps: ${key}: ${this[key]}`)
    })
  }

  // not effect
  // dummyCallback(result) {
  //   console.log(`dummyCallback: ${result}`)
  // }

  _onGetPictureCameraSuccess(e) {
    if (!e.detail) {
      return
    }

    var result = e.detail.result
    this.cameraImage = result
    console.log(result)
  }

  _onGetPictureGallerySuccess(e) {
    if (!e.detail) {
      return
    }

    var result = e.detail.result
    this.galleryImage1 = 'data:image/jpeg;base64,' + result
    console.log(e.detail.result)
  }

  _onGetPictureError(e) {
    if (!e.detail) {
      return
    }

    var result = e.detail.result
    console.warn(result)
  }

  _onDeviceSearch(e) {
    DD.search(
      null,
      response => {
        var result = response
        this.devices = [...this.devices, result]
      },
      error => {
        console.warn(error)
      }
    )
  }

  _onDeviceClear(e) {
    this.devices = []
  }

  _onSpeak1(e) {
    THTTS.speak(this.ttsText1)
  }

  _onSpeak2(e) {
    THTTS.speak(this.ttsText2)
  }

  _onSpeak3(e) {
    THTTS.speak(this.ttsText3)
  }

  _onSpeakImmediate(e) {
    THTTS.speakImmediate(this.ttsTextImm)
  }

  _onBarcodeRead(e) {
    var result = e.detail.result
    this.barcode = result
  }

  _onGetPictureForOcrSuccess(e) {
    var result = 'data:image/jpeg;base64,' + e.detail.result
    this.galleryImage2 = result

    OCR.recText(
      result => {
        console.log(result)
        this.ocrText = result
      },
      error => {
        console.log(error)
      },
      result,
      4
    )
  }

  _onScanBarcode() {
    SCANNER.scan(
      result => {
        // {text: "91250728", format: "EAN_8", cancelled: false}
        this.barcodeText = result.text
      },
      error => {
        console.log(error)
      }
    )
  }
}

window.customElements.define('hybrid-ui-example-page', HybridUiExamplePage)
