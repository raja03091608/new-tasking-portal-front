// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const ip_to_config = {
  IP_ADDRESS_TO_CHANGE:'192.168.1.145'
}
export const environment = {
  production: true,
  appVersion: 'v8.1.3',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  //apiUrl: 'api',
  BaseUrl: '',
  API_URL : "https://tasking-api.ilizienprojects.com/",
  MEDIA_URL : "https://tasking-api.ilizienprojects.com/",
  WISH_URL : "https://wish.ilizienprojects.com/",
  //WISH_URL :'http://'+ip_to_config.IP_ADDRESS_TO_CHANGE+':8002/',
  //API_URL :'http://192.168.1.96:8001/',
  //API_URL :'http://'+ip_to_config.IP_ADDRESS_TO_CHANGE+':8001/',
  //MEDIA_URL :'http://'+ip_to_config.IP_ADDRESS_TO_CHANGE+'/',
  CRYPTO_KEY:'wHLHsHeTcFvW11LBjnE4tE6sz',
  SECRET_KEY:'V1VWTVRFOVhJRk5WUWsxQlVrbE9SUT09LFRrOUNUMFJaSUZkSlRFd2dTMDVQVnc9PQ==',
  DEFAULT_LANG: 'en',
  SUCCESS_CODE: 1,
  ERROR_CODE : 2,
  DATE_FORMAT:'DD/MM/YYYY',
  DATE_FORMAT_REVERSE:'YYYY-MM-DD',
  DATETIME_FORMAT:'DD/MM/YYYY hh:mm:ss',

  appThemeName: 'Metronic',
  appPurchaseUrl: 'https://1.envato.market/EA4JP',
  appHTMLIntegration: 'https://preview.keenthemes.com/metronic8/demo4/documentation/base/helpers/flex-layouts.html',
  appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/demo4/',
  appPreviewAngularUrl: 'https://preview.keenthemes.com/metronic8/angular/demo4',
  appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
  appPreviewChangelogUrl: 'https://preview.keenthemes.com/metronic8/angular/docs/changelog',
  appDemos: {
    'demo1': {
      'title': 'Demo 1',
      'description': 'Default Dashboard',
      'published': true,
      'thumbnail': './assets/media/demos/demo1.png'
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
