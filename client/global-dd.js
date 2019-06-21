import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '@things-factory/shell'

class GlobalDd extends connect(store)(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          --search-button-width: 40px;
          --search-button-height: 40px;
          --search-icon-color: gray;
        }
        button {
          width: var(--search-button-width);
          height: var(--search-button-height);
          background-color: var(--secondary-light-color);
        }
        button i {
          color: var(--search-icon-color);
        }
      `
    ]
  }

  static get properties() {
    return {
      // buttonIconCls: String,
      // buttonIcon: String,
      discoverType: String, // M(mobile), D(desktop)
      st: String,
      selfSt: String,
      devices: Array
    }
  }

  // discover-button: constructor
  // discover-button: render
  // discover-button: firstUpdated  // 이 시점에 store가 undefined임.
  constructor() {
    super()

    this.buttonIconCls = 'material-icons'
    this.buttonIcon = 'settings_input_antenna'

    this.st = 'urn:things-factory:device:all:all' // FIXME

    window.DD = this
  }

  render() {
    if (typeof ssdp != 'undefined') {
      this.discoverType = 'M'
    } else if (!this.electron) {
      try {
        let electron = require('electron')
        if (electron) {
          this.discoverType = 'D'
          this.electron = electron
        }
      } catch (e) {
        console.log("It's not electron environment")
      }
    }

    if (this.discoverType) {
      // return html`
      //   <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      //   <button @click=${this._onClick}><i class=${this.buttonIconCls}>${this.buttonIcon}</i></button>
      // `
      return html``
    }
  }

  // _onClick(e) {
  //   this.search()
  // }

  listen(st) {
    st = st ? st : null

    if (this.discoverType === 'M') {
      ssdp.listen(
        null, // FIXME 모바일 파일에서 읽어 와야 함.
        message => {
          console.log('listen success:', message)
        },
        error => {
          console.warn('listen error:', error)
        }
      )
    } else if (this.discoverType === 'D') {
      // nodejs에서 linten()
    }
  }

  search(st, successCallback, errorCallback) {
    st = st ? st : this.st

    if (this.discoverType === 'M') {
      ssdp.search(
        st,
        result => {
          // console.log(result)
          // if (typeof this.successCallback === 'string') {
          //   eval(this.successCallback).call(this, result)
          // } else {
          //   this.successCallback.call(this, result)
          // }
          successCallback && successCallback.call(this, json)
        },
        error => {
          // if (typeof this.errorCallback === 'string') {
          //   eval(this.errorCallback).call(this, error)
          // } else {
          //   this.errorCallback.call(this, error)
          // }
          errorCallback && errorCallback.call(this, error)
        }
      )
    } else if (this.discoverType === 'D') {
      const ipcRenderer = this.electron.ipcRenderer
      
      if (ipcRenderer._events && !ipcRenderer._events['discovered-device']) {
        ipcRenderer.on('discovered-device', (e, result) => {
          let json = this.toJson(result)
          successCallback.call(this, JSON.stringify(json))
        })
      }

      if (ipcRenderer) {
        ipcRenderer.send('search-device', st) // ui -> node
      }
    }
  }

  toJson(text) {
    text = text.replace('"', '').trim()
    var lines = text.split('\r\n')
    var jsonStr = '{\r\n'
    lines.forEach((l, i) => {
      let parts = l.trim().split(':')
      if (parts.length > 2) {
        let s = l.indexOf(':')
        parts = [ l.substring(0, s), l.substring(s+1) ]
      } else if (parts.length < 2) {
        return
      }

      let temp = ''
      parts.forEach((part, j) => {
        temp += '"'
        temp += part.trim()
        temp += '"'
      
        if (j % 2 == 0) {
          temp += ': '
        }
      })

      if (i < lines.length - 1) {
        temp += ','
      } else {
        temp += '\r\n'
      }

      jsonStr += temp
    })
    jsonStr += '}'

    try {
      console.log(jsonStr)
      var json = JSON.parse(jsonStr)
    } catch(e) {
      console.warn(e)
    }

    return json
  }

  stateChanged(state) {
    // state
  }
}

customElements.define('global-dd', GlobalDd)
