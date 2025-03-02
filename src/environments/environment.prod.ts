export const environment = {
  //--output-hashing all
  //ng build --prod --env=prod --aot false
  //npm run build-prod
  //ng build --configuration "production"
  production: true,
  get autoSaveTime(): number { return 300 },
  get userSessionCheckTime(): number { return 7200 },
  get photonotavail_url(): string { return './assets/img/app/Photonotavail.png'; },
  //Test application
  //get autoSaveTime(): number { return 120 },
  //get userSessionCheckTime(): number { return 1800 },

  //Production URL
  //get api_downloadurl(): string { return 'https://fostering.starlight.inc/starlightapi/api/UploadDocuments/GetFile/'; },
  //get api_uploadurl(): string { return 'https://fostering.starlight.inc/starlightapi/api/UploadDocuments/Upload'; },
  //get api_url(): string { return 'https://fostering.starlight.inc/starlightapi'; },
  //get api_uploadeventsgalleryurl(): string { return 'https://fostering.starlight.inc/starlightapi/api/EventsGallery/Upload'; },
  
  //https://fostering.starlight.inc/starlighttestapi
  get api_downloadurl(): string { return 'https://fostering.starlight.inc/starlighttestapi/api/UploadDocuments/GetFile/'; },
  get api_uploadurl(): string { return 'https://fostering.starlight.inc/starlighttestapi/api/UploadDocuments/Upload'; },
  get api_url(): string { return 'https://fostering.starlight.inc/starlighttestapi'; },
  get api_uploadeventsgalleryurl(): string { return 'https://fostering.starlight.inc/starlighttestapi/api/EventsGallery/Upload'; },

  // get api_downloadurl(): string { return 'http://localhost:52622/api/UploadDocuments/GetFile/'; },
  // get api_uploadurl(): string { return 'http://localhost:52622/api/UploadDocuments/Upload'; },
  // get api_url(): string { return 'http://localhost:52622'; },
  //  get api_uploadeventsgalleryurl(): string { return 'http://localhost:52622/api/EventsGallery/Upload'; },

  //Local publish copy
  //get api_downloadurl(): string { return 'http://idrispc/eCarePlusAPI/api/UploadDocuments/GetFile/'; },
  //get api_uploadurl(): string { return 'http://idrispc/eCarePlusAPI/api/UploadDocuments/Upload'; },
  //get api_url(): string { return 'http://idrispc/eCarePlusAPI'; },
  //get api_uploadeventsgalleryurl(): string { return 'http://idrispc/eCarePlusAPI/api/EventsGallery/Upload'; },

  //subdomain fostering below capcha applied.
  //get captchaPublicKey(): string { return '6LeTCFkUAAAAAO1fns3ibo26sbYs3m1AGp86eYxU'; },

  //subdomain holisticfostering,newlifefostering below capcha applied.
  get captchaPublicKey(): string { return '6LdAl2cUAAAAAOY3vPbeQ0x0JwaVxQSst4pYD4cb'; },

  

};
