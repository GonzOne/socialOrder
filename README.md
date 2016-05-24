# Social Order
This project was generated with Generator-M-Ionic v1.5.0.
The sole author of this code is M. Gonzalez.

# Generator-M-Ionic v1.5.0

Development:

### What you need to build this app.

<p align="center">
  <a href="http://yeoman.io/" target="_blank" alt="yeoman" title="yeoman">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/6041228/c1f91cac-ac7a-11e4-9c85-1a5298e29067.png">
  </a>
  <a href="http://gulpjs.com/" target="_blank" alt="gulp" title="gulp">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/9409728/c5332474-481c-11e5-9a6e-74641a0f1782.png">
  </a>
  <a href="http://bower.io/" target="_blank" alt="bower" title="bower">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/6041250/ef9a78b8-ac7a-11e4-9586-7e7e894e201e.png">
  </a>
  <a href="https://angularjs.org/" target="_blank" alt="angular" title="angular">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/6041199/5978cb96-ac7a-11e4-9568-829e2ea4312f.png">
  </a>
  <a href="http://ionicframework.com/" target="_blank" alt="ionic" title="ionic">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/6041296/59c5717a-ac7b-11e4-9d5d-9c5232aace64.png">
  </a>
  <a href="http://cordova.apache.org/" target="_blank" alt="cordova" title="cordova">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/6041269/20ed1196-ac7b-11e4-8707-68fa331f1aeb.png">
  </a>
  <br>
  <br>
  <a href="http://sass-lang.com/" target="_blank" alt="sass" title="sass">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/9410121/c330a3de-481e-11e5-8a69-ca0c56f6cabc.png">
  </a>
  <a href="http://karma-runner.github.io/" target="_blank" alt="karma" title="karma">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/9410216/44fef8fc-481f-11e5-8037-2f7f03678f4c.png">
  </a>
  <a href="http://jasmine.github.io/" target="_blank" alt="jasmine" title="jasmine">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/9410153/ebd46a00-481e-11e5-9864-f00fa8427d17.png">
  </a>
  <a href="https://angular.github.io/protractor/#/" target="_blank" alt="protractor" title="protractor">
    <img height="100" src="https://cloud.githubusercontent.com/assets/1370779/9410114/b99aaa9a-481e-11e5-8655-ebc1e324200d.png">
  </a>
</p>


## Installation and Prerequisites

Besides simply installing everything, I recommend having or obtaining a **fair knowledge** of the technologies, so you can understand what you are doing.

## Start
In order to compile and install the app on a device you need the following dependencies, please install before proceeding.
## Dependencies
- node & npm - http://nodejs.org/download/
  - gulp: `npm install --global gulp` - http://gulpjs.com/
  - bower: `npm install --global bower` - http://bower.io/
  
##Code base
```bash
git clone --depth 1 https://github.com/GonzOne/angular2-sensor-app.git
cd sensor-app
npm install # install node packages
bower install # install bower packages
gulp --cordova 'prepare' # install Cordova platforms and plugins
```

## Run the application locally
```sh
gulp watch
# add --no-open to avoid browser opening
gulp
```

#### Build, run on the device/emulators

```sh
# both implicitly run gulp build which builds the Ionic app into www/
gulp --cordova 'run ios --device'
gulp --cordova 'emulate ios'
# run the version currently in the www/ folder, without a new build
gulp --cordova 'run ios --device' --no-build
# build Options
gulp --cordova 'run ios --device' --minify --force-build
# Use specific target (e.g. iPhone-6)
gulp --cordova 'emulate ios --target=iPhone-6'
# to list available targets on your machine, run:
`./platforms/ios/cordova/lib/list-emulator-images`
# these will need to be installed in Xcode before ready to use
```



## Platform SDKs
In order to run the app on a device, you'll need **Platform SDKs** for the platforms and the versions you are developing for. If you just want to develop in the browser for now, no SDKs are needed. Head over to Cordova Documentation: [Platform Guides](http://cordova.apache.org/docs/en/dev/guide/platforms/index.html) or Cordova CLI: [Requirements](https://github.com/apache/cordova-cli/#requirements) for further instructions.
#### Note
You don't have to install the **Cordova CLI**. It's provided with the generator. The installer installs the Cordova CLI locally (not globally).

## Currently used Cordova plugins
<ul>
<li><a href="http://ngcordova.com/docs/plugins/dialogs/">cordova-plugin-dialogs</a></li>
<li><a href="http://ngcordova.com/docs/plugins/inAppBrowser/">cordova-plugin-inappbrowser</a></li>
<li><a href="http://ngcordova.com/docs/plugins/keyboard/">com.ionic.keyboard</a></li>
<li><a href="http://ngcordova.com/docs/plugins/network/">cordova-plugin-network-information</a></li>
<li><a href="http://ngcordova.com/docs/plugins/splashscreen/">cordova-plugin-splashscreen</a></li>
<li><a href="http://ngcordova.com/docs/plugins/statusbar/">cordova-plugin-statusbar</a></li>
<li><a href="http://ngcordova.com/docs/plugins/vibration/">cordova-plugin-vibration</a></li>
<li><a href="http://ngcordova.com/docs/plugins/camera/">cordova-plugin-camera</a></li>
<li><a href="http://ngcordova.com/docs/plugins/contacts/">cordova-plugin-contacts</a></li>
<li><a href="http://ngcordova.com/docs/plugins/sms/">com.cordova.plugins.sms</a></li>
<li><a href="http://ngcordova.com/docs/plugins/imagePicker/">com.synconset.imagepicker</a></li>
<li><a href="http://ngcordova.com/docs/plugins/file/">cordova-plugin-file</a></li>
<li><a href="http://ngcordova.com/docs/plugins/fileTransfer/">cordova-plugin-file-transfer</a></li>
<li><a href="http://ngcordova.com/docs/plugins/geolocation/">cordova-plugin-geolocation</li></a>
<li><a href="http://ngcordova.com/docs/plugins/badge/">de.appplant.cordova.plugin.badge</a></li>
<li><a href="http://ngcordova.com/docs/plugins/nativeAudio/">cordova-plugin-nativeaudio</a></li>
<li><a href="http://ngcordova.com/docs/plugins/localNotification/">cordova-plugin-app-event</a></li>
</ul>

## Generator
Everything else you need will be installed using:
```sh
npm install --global generator-m-ionic

## Questions?
Contact Manuel Gonzalez @ design@stheory.com.

## Running into issues?
Do the following:
 1. check out the [FAQ](https://github.com/mwaylabs/generator-m-ionic/tree/master/docs/contribute/faq.md) and [issues](https://github.com/mwaylabs/generator-m-ionic/issues) see if there already is a solution or answer to that matter.
 
## License
Code licensed under MIT. Docs under Apache 2. PhoneGap is a trademark of Adobe.
