// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,
 
    intentMap: {
       'AMAZON.StopIntent': 'END',
       'AMAZON.HelpIntent':'HelpIntent',

    },
 
    db: {
         FileDb: {
             pathToFile: '../db/db.json',
         }
     },
    //  i18n: {
    //     resources: {
    //         'en-US': require('./i18n/en-US'),
    //     },
    //     returnNull: false,
    //     fallbackLng: 'en-US',
    // },
      cms: {
        GoogleSheetsCMS: {
            spreadsheetId: '13jloYFwKIlNWrcQrIr6v_oZ8CJlO2hqy7ZC7uBM0NQY',
            access: 'public',
            sheets: [
                {
                    name: 'responses',
                    type: 'Responses',
                    position: 1,
                },
            ]
        }
    },

 };
 