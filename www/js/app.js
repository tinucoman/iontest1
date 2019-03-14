angular.module('asogem', ['ionic', 
                          'ngStorage',
                          'ngCordova', 
                          'ngFileUpload',
                          'pascalprecht.translate',
                          'ion-gallery'])
    .config(['$httpProvider', 'appConfig',
        function ($httpProvider, appConfig) {
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};

        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';   
    }])
    .config(function ( $compileProvider) {

          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|sms|tel|mailto|coui):/);
            // whitelists non-http: protocols. specifically we need coui for coherent.

      })
    .config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

    }])
    .run(['$http', '$rootScope', '$timeout', 'appConfig','$localStorage', '$ionicModal', '$translate', '$state', '$stateParams',
        function ($http, $rootScope, $timeout, appConfig, $localStorage, $ionicModal, $translate, $state, $stateParams) {
            $rootScope.showshearch = false;

            $rootScope.benl = appConfig.benl;
            $rootScope.version = appConfig.version;
            $rootScope.apiUrl = appConfig.apiUrl;
            $rootScope.appConfig = appConfig;
            if (!angular.isDefined($rootScope.lang_id)) {
                if (!angular.isDefined($localStorage.lang_id)) {
                    $localStorage.lang_id = appConfig.lang_id;
                }
                $rootScope.lang_id = $localStorage.lang_id;
                $translate.use($localStorage.lang_id);

                $rootScope.langStyle1 = 'button-balanced';
                $rootScope.langStyle2 = 'button-balanced';

                switch($rootScope.lang_id){
                    case '1': {
                        $rootScope.langStyle1 = 'button-royal';
                    } break;
                    case '2': {
                        $rootScope.langStyle2 = 'button-royal';
                    } break;
                }
            }

            $rootScope.setLang = function(lang_id){
                $localStorage.lang_id = lang_id;
                $http.defaults.headers.common["language"] = lang_id;
                $rootScope.lang_id = lang_id;
                $translate.use(lang_id);

                $rootScope.langStyle1 = 'button-balanced';
                $rootScope.langStyle2 = 'button-balanced';

                switch($rootScope.lang_id){
                    case '1': {
                        $rootScope.langStyle1 = 'button-royal';
                    } break;
                    case '2': {
                        $rootScope.langStyle2 = 'button-royal';
                    } break;
                }
            }


            $rootScope.showSearch = function(){
                if(!$rootScope.showshearch){
                    $rootScope.showshearch = true;
                } else {
                    $rootScope.showshearch = false;
                }

            }
            $rootScope.showSearchButton = true;
            $rootScope.showSearchBtn = function(){
                $rootScope.showSearchButton = true;
            }

            // authentiffication part
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $rootScope,
                hardwareBackButtonClose: false
            }).then(function($ionicModal) {
                $rootScope.modal = $ionicModal;
            });

            $rootScope.login = function(){
                $timeout(function(){
                    $rootScope.modal.show();
                },1000)
            }

            $rootScope.logout = function(){
                $rootScope.loggedIn = false;
                $rootScope.login();
                //console.log('test logout');
                delete $localStorage.atoken;
                delete $localStorage.firstname;
                delete $localStorage.lastname;
                delete $localStorage.name;
                delete $localStorage.user_id;
                delete $localStorage.role;
                delete $localStorage.username;
                delete $localStorage.exp;
                $http.defaults.headers.common["token"] = '';
                $http.defaults.headers.common["user_id"] = '';

                $http.get($rootScope.apiUrl + 'index.php?do=-auth-tokenlogout').then(function(response){
                    if($state.current.name == 'mlist'){
                        $state.go('index', {}, {reload: true, inherit: false, notify: true});
                    }else{
                        $state.go('mlist', {}, {reload: true, inherit: false, notify: true});
                    }
                }, function(err){
                    return false;
                })
                
            }

            $rootScope.auth = function(user){
                $rootScope.validateForm = true;
                $http.post($rootScope.apiUrl + 'index.php?do=-auth-tokenlogin&lang=' + $rootScope.lang_id ,user).then(function(response){
                    //console.log(response.data.data);
                    result  = response.data.data;
                    $rootScope.allData = response;
                    if(result.errorcode){
                        $rootScope.errorcode = result.errorcode;
                    } else {
                        $localStorage.atoken = result.token;
                        $localStorage.firstname = result.firstname;
                        $localStorage.lastname = result.lastname;
                        $localStorage.name = result.name;
                        $localStorage.user_id = result.user_id;
                        $localStorage.role = result.role;
                        $localStorage.username = result.username;
                        $localStorage.exp = result.exp;

                        $rootScope.firstname = $localStorage.firstname;
                        $rootScope.lastname = $localStorage.lastname;

                        $http.defaults.headers.common["language"] = '1';
                        $http.defaults.headers.common["token"] = $localStorage.atoken;
                        $http.defaults.headers.common["user_id"] = $localStorage.user_id;
                        if($state.current.name == 'mlist'){
                            $state.go('index', {}, {reload: true, inherit: false, notify: true});
                        }else{
                            $state.go('mlist', {}, {reload: true, inherit: false, notify: true});
                        }

                        // on success
                        $timeout(function(){
                            $rootScope.modal.hide();
                        },0);
                    }
                }, function(err){
                    $rootScope.allData = err;
                    return false;
                })


            }

            
            if (($localStorage.hasOwnProperty("atoken") === true) && ($localStorage.hasOwnProperty("user_id") === true)) {
                $rootScope.loggedIn = true;
                $http.defaults.headers.common["token"] = $localStorage.atoken;
                $http.defaults.headers.common["user_id"] = $localStorage.user_id;
                $rootScope.firstname = $localStorage.firstname;
                $rootScope.lastname = $localStorage.lastname;

                // get user data if needed
            } else {
                $rootScope.loggedIn = false;
                // show the login modal
                $rootScope.login();
            }         
            
            if ($localStorage.hasOwnProperty("lang_id") === true) {
                $http.defaults.headers.common["language"] = $localStorage.lang_id;
                // get user data if needed
            } else {
                $http.defaults.headers.common["language"] = '1';
            }



            // end authentification


        }])

    .factory('helper',['$http','$q','$timeout', '$rootScope', '$ionicLoading',function ($http,$q,$timeout, $rootScope, $ionicLoading){
        var helper = {},canceler;
        helper.searchPromise= undefined;
        helper.doRequest = function(){
            // angular.element('.loading_wrap').removeClass('hidden');
            switch(arguments.length){
                case 0:
                    console.error('Missing parameters method,url,callback');
                    return false;
                    break;
                case 1:
                    console.error('Missing parameters url,callback');
                    return false;
                    break;
                case 2:
                    // console.warn('There is no callback, result won\'t be returned'); // this is not needed now that we return the result
                    var data={},method=arguments[0],url=arguments[1],params={};
                    break;
                default:
                    var data={},method=arguments[0],url=arguments[1];
                    switch(typeof(arguments[2])){
                        case 'object':
                            var params = arguments[2];
                            
                            if(arguments[3] && typeof(arguments[3]) == 'function'){
                                var callback = arguments[3];
                            }else{
                                // console.warn('There is no callback, result won\'t be returned'); // this is not needed now that we return the result
                            }
                            break;
                        case 'function':
                            var callback = arguments[2];
                            if(arguments[3] && typeof(arguments[3])=='object'){
                                var params = arguments[3];
                            }
                            break;
                        default:
                            if(arguments[3] && typeof(arguments[3]) == 'function'){
                                var callback = arguments[3];
                            }else{
                                // console.warn('There is no callback, result won\'t be returned'); // this is not needed now that we return the result
                            }
                            console.warn('Expected object or function');
                            break;
                    }
                    break;
            }
            var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
            if(method=='post'){
                data = params;
                params = {};
            }
            
            if(data.__proto__.constructor.name == 'FormData'){
                headers =  {'Content-Type': undefined } ; // when sending files with Ajax, the content type will be set automatically
            }
            
			this.data = $http({
                method:method,
                url:$rootScope.apiUrl + url, 
                params:params, 
                data:data, 
                headers: headers, 
                timeout: 20000
            }).then(function(response){
                if(callback){ callback(response.data); }
                return response.data;
            },function(response){
                console.log('Error!' + response);
                $ionicLoading.hide();
                return false;
            });
            return this.data;
        }

        helper.showAlerts = function(scope,d){
            if(!scope.alerts){ scope.alerts = []; }
            if(d.error && d.error.error){
                scope.alerts.push({type: 'danger', msg: d.error.error});
            }else if(d.error){
                for(x in d.error){
                    scope.alerts.push({type: 'danger', msg: d.error[x]});
                }
            }
            if(d.notice && d.notice.notice){
                scope.alerts.push({type: 'info', msg: d.notice.notice});
            }
            if(d.success && d.success.success){
                scope.alerts.push({type: 'success', msg: d.success.success});
            }
        }
        helper.searchIt = function(item,callback){
            if(helper.searchPromise){
                $timeout.cancel(helper.searchPromise);
            }
            helper.searchPromise = helper.doRequest('get','index.php',item,callback);
        }
        return helper;
    }])
    .factory('list',['helper', function (helper) {

        var list = {
            init: init,
            search: search
        };

        return list;

        function init(url,callback){
            var params = { 'do' : url };
            // angular.element('.loading_wrap').removeClass('hidden');
            helper.doRequest('get','index.php',params,callback);
        }
        // searching the list
        function search(url,callback){
            // angular.element('.loading_wrap').removeClass('hidden');
            helper.searchIt(url,callback);
        }

    }])

    .factory('order',['helper', '$rootScope', function (helper, $rootScope) {

        var order = {
            get: get,
            calculateTotal: calculateTotal
        };

        return order;

        function get(params,callback,method){
            method = method || 'get';
            // angular.element('.loading_wrap').removeClass('hidden');
            helper.doRequest(method, 'index.php',params,callback);
        }

        function calculateTotal(order) {
            //if($('#f_guaranty_yes').attr('checked') == true || $('#f_send').attr('checked') == false){
            if(order.f_guaranty == 1){
                angular.element('#total_notax').text('0,00');
                angular.element('#tax').text('0,00');
                angular.element('#total').text('0,00');
                return;
            }
            var total = 0;
            // de rezolvat
            angular.element('.blomberg-table tr').each(function(){
                var line_price = 0;
                var line_qty = 0;
                line_price = angular.element(this).children('td:eq(2)').text().replace(',','.').replace(' ','');
                line_qty = angular.element(this).children('td:eq(3)').text().replace(',','.').replace(' ','');
                line_discount = angular.element(this).children('td:eq(3)').text().replace(',','.').replace(' ','');
                line_qty = angular.element(this).children('td:eq(4)').text().replace(',','.').replace(' ','');
                total = total + ((1 - line_discount/100) * line_price * line_qty);
            });

            var costtype = order.PRICE800XX;
            costtype = eval(costtype.replace(',','.'));
            var discount = order.DISC800XX;
            discount = eval(discount.replace(',','.'));
            var value = order.workhours;

            var costtype1 = order.PRICE810XX;
            costtype1 = eval(costtype1.replace(',','.'));
            var discount1 = order.DISC810XX;
            discount1 = eval(discount1.replace(',','.'));

            var costtype2 = order.PRICE850F;
            costtype2 = eval(costtype2.replace(',','.'));
            var invoicing = order.invoicing;

            var extra_cost = order.PRICE999999999 ? order.PRICE999999999 : '0,00';
            extra_cost = eval(extra_cost.replace(',','.'));

            total = total + (costtype1* (1-discount1/100)) + (costtype2 *invoicing) + extra_cost + (value * costtype * (1-discount/100));

            angular.element('#total_notax').val(total.toFixed(2));
            var tax = total/100*21;
            angular.element('#tax').val(tax.toFixed(2));
            total = total+tax;
            total = total.toFixed(2);
            angular.element('#total').val(total);
        }


    }]);