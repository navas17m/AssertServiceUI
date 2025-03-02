// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
//Ang 15 version 1.

export const environment = {
  production: false,

  get photonotavail_url(): string { return './assets/img/app/Photonotavail.png'; },
  get api_downloadurl(): string { return 'https://localhost:7065/api/UploadDocuments/GetFile/'; },
  get api_uploadurl(): string { return 'https://localhost:7065/api/UploadDocuments/Upload'; },
  get api_url(): string { return 'https://localhost:7065'; },
  get api_uploadeventsgalleryurl(): string { return 'https://localhost:7065/api/EventsGallery/Upload'; },

  // //https://fostering.starlight.inc/starlighttestapi
  //get api_downloadurl(): string { return 'https://fostering.starlight.inc/starlighttestapi/api/UploadDocuments/GetFile/'; },
  //get api_uploadurl(): string { return 'https://fostering.starlight.inc/starlighttestapi/api/UploadDocuments/Upload'; },
  //get api_url(): string { return 'https://fostering.starlight.inc/starlighttestapi'; },
  //get api_uploadeventsgalleryurl(): string { return 'https://fostering.starlight.inc/starlighttestapi/api/EventsGallery/Upload'; },
  //get photonotavail_url(): string { return 'http://localhost:52622'; },

  //To connect the application through other device
  //get api_downloadurl(): string { return 'http://idrispc/eCarePlusAPI/api/UploadDocuments/GetFile/'; },
  //get api_uploadurl(): string { return 'http://idrispc/eCarePlusAPI/api/UploadDocuments/Upload'; },
  //get api_url(): string { return 'http://idrispc/eCarePlusAPI'; },

  //get api_downloadurl(): string { return 'http://localhost/eCarePlusAPI/api/UploadDocuments/GetFile/'; },
  //get api_uploadurl(): string { return 'http://localhost/eCarePlusAPI/api/UploadDocuments/Upload'; },
  //get api_url(): string { return 'http://localhost/eCarePlusAPI'; },

  get captchaPublicKey(): string { return '6Lda2DgUAAAAAHX6RS6q5qDiTEOe99_r1SbxX28B'; },
  get autoSaveTime(): number { return 300 },
  
  get userSessionCheckTime(): number { return 1800 },
};
