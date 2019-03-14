angular
    .module('asogem')
    .controller('mlistCtrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$timeout',
        function ($scope, $rootScope, $http, $ionicLoading, $timeout) {
            $scope.init = function () {

                $scope.offset = 0;
                if ($rootScope.lang_id) {
                    langParam = "&lang_id=" + $rootScope.lang_id;
                } else {
                    langParam = "";
                }

                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }
                console.log('start');
                $ionicLoading.show({
                    template: 'Loading orders'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mlist' + searchParam + langParam + 'ts=' + Date.now()).then(function(response){
                    $scope.list = response.data.data.query;
                    $scope.maxRows = response.data.data.max_rows;
                    $rootScope.tbscreened = response.data.data.tbscreened;
                    $ionicLoading.hide();
                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                });
            };

            $scope.remove = function(order_id, index) {
                $http.get($rootScope.apiUrl + 'index.php?do=start-order-remove&order_id=' + order_id).then(function(response) {
                    $scope.list.splice(index, 1);
                }, function(err) {
                    console.log(err);
                    return false;
                })
            }


            $scope.loadMore = function(){
                if($scope.maxRows < $scope.offset*30){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                var offset = $scope.offset + 1;
                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }

                $ionicLoading.show({
                    template: 'Loading orders'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mlist&offset=' + offset + searchParam).then(function(response){
                    $scope.list = $scope.list.concat(response.data.data.query);
                    $scope.offset = offset;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                })

            }

            $scope.loadOrder = function(){
                $ionicLoading.show({
                    template: 'Loading Order Data'
                });
            }


            $scope.init();
        }]);

angular
    .module('asogem')
    .controller('ToBeScreenedCtrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$timeout',
        function ($scope, $rootScope, $http, $ionicLoading, $timeout) {
            $scope.init = function () {

                $scope.offset = 0;
                if ($rootScope.lang_id) {
                    langParam = "&lang_id=" + $rootScope.lang_id;
                } else {
                    langParam = "";
                }

                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }
                console.log('start');
                $ionicLoading.show({
                    template: 'Loading orders'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mtobescreened' + searchParam + langParam + 'ts=' + Date.now()).then(function(response){
                    $scope.list = response.data.data.query;
                    $scope.maxRows = response.data.data.max_rows;
                    $rootScope.tbscreened = response.data.data.tbscreened;
                    $ionicLoading.hide();
                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                });
            };

            $scope.remove = function(order_id, index) {
                $http.get($rootScope.apiUrl + 'index.php?do=start-order-remove&order_id=' + order_id).then(function(response) {
                    $scope.list.splice(index, 1);
                }, function(err) {
                    console.log(err);
                    return false;
                })
            }


            $scope.loadMore = function(){
                if($scope.maxRows < $scope.offset*30){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                var offset = $scope.offset + 1;
                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }

                $ionicLoading.show({
                    template: 'Loading orders'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mtobescreened&offset=' + offset + searchParam).then(function(response){
                    $scope.list = $scope.list.concat(response.data.data.query);
                    $scope.offset = offset;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                })

            }

            $scope.loadOrder = function(){
                $ionicLoading.show({
                    template: 'Loading Order Data'
                });
            }


            $scope.init();
        }]);

angular
    .module('asogem')
    .controller('removedCtrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$timeout',
        function ($scope, $rootScope, $http, $ionicLoading, $timeout) {
            $scope.init = function () {

                $scope.offset = 0;

                if ($rootScope.lang_id) {
                    langParam = "&lang_id=" + $rootScope.lang_id;
                } else {
                    langParam = "";
                }

                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }
                console.log('start');
                $ionicLoading.show({
                    template: 'Loading Interventions'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mremoved' + searchParam + langParam + 'ts=' + Date.now()).then(function(response){
                    $scope.list = response.data.data.query;
                    $scope.maxRows = response.data.data.max_rows;
                    $scope.dataCanBeLoaded = true;
                    console.log($scope.maxRows);
                    $ionicLoading.hide();
                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                });
            };

            $scope.restore = function(order_id, index) {
                $http.get($rootScope.apiUrl + 'index.php?do=start-order-restore&order_id=' + order_id).then(function(response) {
                    $scope.list.splice(index, 1);
                }, function(err) {
                    console.log(err);
                    return false;
                })
            }


            $scope.loadMore = function(){
                var offset = $scope.offset + 1;
                if($scope.maxRows < offset*30){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.dataCanBeLoaded = false;
                    return false;
                }
                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }

                $ionicLoading.show({
                    template: 'Loading orders'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mremoved&offset=' + offset + searchParam).then(function(response){
                    $scope.list = $scope.list.concat(response.data.data.query);
                    $scope.offset = offset;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                })

            }

            $scope.loadOrder = function(){
                $ionicLoading.show({
                    template: 'Loading Order Data'
                });
            }


            $scope.init();
        }]);

angular
    .module('asogem')
    .controller('mfinishedCtrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$timeout',
        function ($scope, $rootScope, $http, $ionicLoading, $timeout) {
            $scope.init = function () {

                $scope.offset = 0;
                if ($rootScope.lang_id) {
                    langParam = "&lang_id=" + $rootScope.lang_id;
                } else {
                    langParam = "";
                }

                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }
                
                $ionicLoading.show({
					template: 'Loading orders'
				});
                $http.get($rootScope.apiUrl + 'index.php?do=mfinished' + searchParam + langParam).then(function(response){
                    $scope.list = response.data.data.query;
                    $scope.maxRows = response.data.data.max_rows;
                    $ionicLoading.hide();
                }, function(err){
                    $timeout(function(){
                      $ionicLoading.hide()
                    },500);
                    return false;
                })

            };

            $scope.loadMore = function(){
                if($scope.maxRows < $scope.offset*30){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                var offset = $scope.offset + 1;
                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }
                
                $ionicLoading.show({
					template: 'Loading orders'
				});
                $http.get($rootScope.apiUrl + 'index.php?do=mfinished&offset=' + offset + searchParam).then(function(response){
                    $scope.list = $scope.list.concat(response.data.data.query);
                    $scope.offset = offset;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function(err){
                    $timeout(function(){
                      $ionicLoading.hide()
                    },500);
                    return false;
                })

            }
            
            $scope.loadOrder = function(){
                $ionicLoading.show({
					template: 'Loading Order Data'
				});
            }


            $scope.init();
        }]);

angular
    .module('asogem')
    .controller('mlist2Ctrl', ['$scope', '$rootScope', '$http', '$ionicLoading', '$timeout',
        function ($scope, $rootScope, $http, $ionicLoading, $timeout) {
            $scope.init = function () {

                $scope.offset = 0;
                if ($rootScope.lang_id) {
                    langParam = "&lang_id=" + $rootScope.lang_id;
                } else {
                    langParam = "";
                }

                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }
                console.log('start');
                $ionicLoading.show({
                    template: 'Loading orders'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mlist2' + searchParam + langParam + 'ts=' + Date.now()).then(function(response){
                    $scope.list = response.data.data.query;
                    $scope.maxRows = response.data.data.max_rows;
                    $ionicLoading.hide();
                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                });

            };

            $scope.loadMore = function(){
                if($scope.maxRows < $scope.offset*30){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                var offset = $scope.offset + 1;
                if ($scope.search) {
                    searchParam = "&search=" + $scope.search;
                } else {
                    searchParam = "";
                }

                $ionicLoading.show({
                    template: 'Loading orders'
                });
                $http.get($rootScope.apiUrl + 'index.php?do=mlist2&offset=' + offset + searchParam).then(function(response){
                    $scope.list = $scope.list.concat(response.data.data.query);
                    $scope.offset = offset;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, function(err){
                    $timeout(function(){
                        $ionicLoading.hide()
                    },500);
                    return false;
                })

            }

            $scope.loadOrder = function(){
                $ionicLoading.show({
                    template: 'Loading Order Data'
                });
            }


            $scope.init();
        }]);