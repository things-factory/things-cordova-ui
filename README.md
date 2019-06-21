# things-cordova-ui

## things-shell에 기반하여 cordova/electron Project로 구성하기.
### 준비사항:
#### 1. Install Android SDK
#### 2. Install Cordova
#### 3. Install Electron

## things-shell에 기반하여 android apk를 build성공 시키기.
### 1. yarn install
>- dependencies를 설치한다.
### 2. yarn migration
>- things-shell에 필요한 데이터를 만든다.
### 3. yarn add:android
>- cordova에 필요한 android platform을 추가한다.
### 4. cordova-config-remote.js 파일 수정.
>- webpack output파일 main.js를 원격에서 로딩하므로 publicpath(line:81)를 serve하는 host의 ip로 바꿔줘야 한다.
### 5. node cordova-config-remote.js
>- things-shell을 android에서 맞게 수정한다. (아래 스텝에서 에러가 발생시 먼저 cordova-config-remote파일에서 기록 되어 있는지를 보고 처리 방안 대로 처리 되었는지를 확인한다.)
### 6. yarn serve:dev
>- serve static file
### 7. yarn start:android
>- apk를 build하여 연결된 기기에서 실행시킨다.

## SSDP연관프로젝트:
things-factory/cordova-plugin-ssdp
things-factory/device-discover-node