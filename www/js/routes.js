angular
    .module('asogem')
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, appConfig) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'views/mlist.html',
                cache: false,
                controller: 'mlistCtrl'
            })
            .state('edit', {
                url: '/edit/:order_id',
                templateUrl: 'views/edit.html',
                controller: 'editCtrl',
                controllerAs: 'vm'
            })
            .state('finished', {
                url: '/finished/:order_id',
                templateUrl: 'views/editFinished.html',
                controller: 'editCtrl',
                controllerAs: 'vm'
            })
            .state('images', {
                url: '/images/:order_id',
                templateUrl: 'views/images.html',
                controller: 'imagesCtrl',
                controllerAs: 'vm'
            })
            .state('sign', {
                url: '/sign/:order_id',
                templateUrl: 'views/sign.html',
                controller: 'signCtrl',
                controllerAs: 'vm'
            })
            .state('mlist', {
                url: '/mlist',
                cache: false,
                templateUrl: 'views/mlist.html',
                controller: 'mlistCtrl'
            })
            .state('tobescreened', {
                url: '/tobescreened',
                cache: false,
                templateUrl: 'views/tobescreened.html',
                controller: 'ToBeScreenedCtrl'
            })
            .state('mlist2', {
                url: '/mlist2',
                cache: false,
                templateUrl: 'views/mlist2.html',
                controller: 'mlist2Ctrl'
            })
            .state('removed', {
                url: '/removed',
                cache: false,
                templateUrl: 'views/removed.html',
                controller: 'removedCtrl'
            })
            .state('mfinished', {
                url: '/mfinished',
                cache: false,
                templateUrl: 'views/mfinished.html',
                controller: 'mfinishedCtrl'
            });

        $urlRouterProvider.otherwise("/");
        $ionicConfigProvider.backButton.previousTitleText(false);
        //$ionicConfigProvider.backButton.icon('ion-chevron-left');
        $ionicConfigProvider.backButton.text('');

    });