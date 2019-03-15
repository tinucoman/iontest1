

// localhost
/*
angular
    .module('asogem')
    .constant('appConfig', {
        isPhonegap: true,
        benl: 1,
        lang_id: '1',
        version: '120',
        versionName: '1.2.0',
        apiUrl: 'http://localhost/proiecte/asogem-repair/',
        updateUrl: 'https://asogem.be/repairapk/nl/production/'
    });
*/


// Asogem NL
angular
    .module('asogem')
    .constant('appConfig', {
        isPhonegap: true,
        benl: 2,
        lang_id: '1',
        version: '120',
        versionName: '1.2.0',
        apiUrl: 'http://repair.asogem.nl/',
        updateUrl: 'https://asogem.be/repairapk/nl/production/'
        //apiUrl: 'http://repair.asogem.nl/staging/'
    });




// Asogem BE
/*
angular
    .module('asogem')
    .constant('appConfig', {
        isPhonegap: true,
        benl: 1,
        lang_id: '1',
        version: '120',
        versionName: '1.2.0',
        //apiUrl: 'http://repair.asogem.be/'
        apiUrl: 'http://repair.asogem.be/staging/',
        updateUrl: 'https://asogem.be/repairapk/be/production/'
    });
*/