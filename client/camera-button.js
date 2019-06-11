import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class CameraButton extends connect(store)(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          --cam-button-width: 40px;
          --cam-button-height: 40px;
          --cam-icon-color: gray;
        }
        button {
          width: var(--cam-button-width);
          height: var(--cam-button-height);
          background-color: var(--secondary-light-color);
        }
        button i {
          color: var(--cam-icon-color);
        }
      `
    ]
  }

  static get properties() {
    return {
      available: Boolean,
      hidden: Boolean,
      buttonIconCls: String,
      buttonIcon: String,
      result: String,

      options: Object,
      quality: Number,
      destinationType: Number,
      sourceType: Number,
      allowEdit: Boolean,
      encodingType: Number,
      // targetWidth: ,
      // targetHeight: ,
      // VIDEO(Allow selection of video only, ONLY RETURNS URL), ALLMEDIA(Allow selection from all media types)
      mediaType: Number,
      correctOrientation: Boolean,
      saveToPhotoAlbum: Boolean,
      // popoverOptions: Camera.CameraPopoverOptions. // iOS-only options that specify popover location in iPad.
      cameraDirection: Number
    }
  }

  constructor() {
    super()

    this.available = false
    this.hidden = true
    this.buttonIconCls = 'material-icons'
    this.buttonIcon = 'camera'
    this.options = {}
  }

  render() {
    if (typeof ssdp === 'undefined') {
      return html``
    } else {
      return html`
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <button @click=${this._onClick}><i class=${this.buttonIconCls}>${this.buttonIcon}</i></button>
      `
    }
  }

  updated(changedProps) {
    changedProps.forEach((oldValue, key) => {
      if (key === 'options') {
        return
      }

      Object.assign(this.options, { key: this[key] })
    })
  }

  _onClick(e) {
    this.openCamera()
  }

  openCamera() {
    if (typeof camera === 'undefined') {
      return
    }

    camera.getPicture(
      this._successCallback,
      this._errorCallback,
      Object.assign(
        {
          sourceType: Camera.PictureSourceType.CAMERA
        },
        this.options
      )
    )
  }

  _successCallback(result) {
    dispatch({
      type: UPDATE_CAMERA_RESULT,
      result: result
    })

    this.dispatchEvent(
      new CustomEvent('camera-success', {
        bubbles: true,
        composed: true,
        detail: { result: result }
      })
    )
  }

  _errorCallback() {
    console.log('errorCallback')
    this.dispatchEvent(
      new CustomEvent('camera-error', {
        bubbles: true,
        composed: true,
        detail: { result: result }
      })
    )
  }

  stateChanged(state) {
    if (state.camera) {
      this.hidden = state.camera.hidden
    }
  }
}

customElements.define('camera-button', CameraButton)
