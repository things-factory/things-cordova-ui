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

      _options: Object,
      quality: Number,
      destinationType: Number, // Camera.DestinationType.DATA_URL(0), Camera.DestinationType.FILE_URI(default)
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

    this._options = {}
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
      if (key === '_options') {
        return
      }

      this._options[key] = this[key]
    })

    if (changedProps.has('sourceType') && this.sourceType) {
      if (this.sourceType == '1') {
        // Camera.PictureSourceType.CAMERA
        this.buttonIconCls = 'material-icons'
        this.buttonIcon = 'camera'
      } else {
        // if (this.sourceType === 0) { // Camera.PictureSourceType.PHOTOLIBRARY
        this.buttonIconCls = 'material-icons'
        this.buttonIcon = 'photo'
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
      },
      {
        sourceType: this.sourceType,
        ...this._options
      }
    )
  }

  successCallback(result) {
    console.log('camera-gallery: successCallback')
    this.result = result
    this.dispatchEvent(
      new CustomEvent('get-picture-success', {
        bubbles: true,
        composed: true,
        detail: { result }
      })
    )
  }

  errorCallback(result) {
    console.log('camera-gallery: errorCallback')
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
