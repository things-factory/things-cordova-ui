import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class CameraGalleryButton extends connect(store)(LitElement) {
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
      buttonIconCls: String,
      buttonIcon: String,
      result: {
        type: String,
        reflect: true
      },

      options: Object,
      quality: Number,
      destinationType: Number, // Camera.DestinationType.DATA_URL, Camera.DestinationType.FILE_URI, Camera.DestinationType.NATIVE_URI
      sourceType: Number, // Camera.PictureSourceType.CAMERA(1), Camera.PictureSourceType.PHOTOLIBRARY(0)
      allowEdit: Boolean,
      encodingType: Number,
      // targetWidth: ,
      // targetHeight: ,
      // VIDEO(Allow selection of video only, ONLY RETURNS URL), ALLMEDIA(Allow selection from all media types)
      mediaType: Number, // Camera.MediaType.PICTURE, Camera.MediaType.VIDEO, Camera.MediaType.ALLMEDIA
      correctOrientation: Boolean,
      saveToPhotoAlbum: Boolean,
      // popoverOptions: Camera.CameraPopoverOptions. // iOS-only options that specify popover location in iPad.
      cameraDirection: Number // Camera.Direction.BACK, Camera.Direction.FRONT
    }
  }

  constructor() {
    super()
  }

  render() {
    if (typeof cordova === 'undefined') {
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

    if (changedProps.has('sourceType') && this.sourceType) {
      if (this.sourceType === Camera.PictureSourceType.CAMERA) {
        this.buttonIconCls = 'material-icons'
        this.buttonIcon = 'camera'
        this.options = {}
      } else if (this.sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        this.buttonIconCls = 'material-icons'
        this.buttonIcon = 'photo'
        this.options = {}
      }
    }
  }

  _onClick(e) {
    this.openCamera()
  }

  openCamera() {
    if (typeof camera === 'undefined') {
      window.camera = navigator.camera
    }

    camera.getPicture(
      result => {
        this.result = result
        this._successCallback.call(this, result)
      },
      result => {
        this._errorCallback.call(this, result)
      },
      {
        sourceType: this.sourceType,
        ...this.options
      }
    )
  }

  _successCallback(result) {
    console.log('camera-gallery: _successCallback')
    this.result = result
    this.dispatchEvent(
      new CustomEvent('get-picture-success', {
        bubbles: true,
        composed: true,
        detail: { result }
      })
    )
  }

  _errorCallback(result) {
    console.log('camera-gallery: _errorCallback')
    this.dispatchEvent(
      new CustomEvent('get-picture-error', {
        bubbles: true,
        composed: true,
        detail: { result }
      })
    )
  }
}

customElements.define('camera-gallery-button', CameraGalleryButton)
