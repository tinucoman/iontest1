angular
    .module('asogem')
    .controller('editCtrl', ['$scope', '$stateParams', 'order', 'helper', '$rootScope', '$ionicModal', '$http', '$ionicLoading', '$cordovaLaunchNavigator', '$cordovaVibration', '$cordovaBarcodeScanner', '$timeout',
        function ($scope, $stateParams, order, helper, $rootScope, $ionicModal, $http, $ionicLoading, $cordovaLaunchNavigator, $cordovaVibration, $cordovaBarcodeScanner, $timeout) {
            $rootScope.showSearchButton = false;
            
            var vm = this;
            vm.order_id = $stateParams.order_id;
            vm.order = {};

            vm.sparepart_id = undefined;
            vm.aantal = 1;
            vm.discount = 0;
            vm.addSpare = {order_id: $stateParams.order_id, 'do': 'xspare_list-order-manual'};
            vm.show = {
                addSpare: false
            }

            vm.myOptions = [];

// functions
            vm.renderOder = render;
            vm.calculateTotal = calculateTotal;
            vm.spareparts = getSpareParts;
            vm.renderSpareParts = renderSpare;
            vm.addSparePart = addSparePart;
            vm.resetSparePart = resetSparePart;
            vm.deleteSparePart = deleteSparePart;
            vm.spareAdd = spareAdd;
            vm.save = save;
            vm.showAlerts = showAlerts;

            
            
            $scope.init = function(){
                $ionicLoading.show({
					template: 'Loading Order Data'
				});
                var params = {'do': 'edit', 'order_id': $stateParams.order_id};
                order.get(params, vm.renderOder);
            }
    
            
            $scope.init();
            
            
            function render(d) {
                if (d && d.data) {
                    vm.order = d.data.order;
                    if(vm.order.device_date_purchase2){
                        vm.order.device_date_purchase = new Date(vm.order.device_date_purchase2*1000);
                    }

                    vm.spareparts();
                    $timeout(function(){
                      $ionicLoading.hide()
                    },1000);
                    //vm.showAlerts(d);
                }
            }


            function calculateTotal() {
                order.calculateTotal(vm.order);
            }

            function getSpareParts() {
                var params = {
                    'do': 'xspare_list',
                    order_id: $stateParams.order_id
                }
                order.get(params, vm.renderSpareParts);
            }

            function renderSpare(d) {
                if (d && d.data) {
                    vm.order.spareParts = d.data.spareParts;
                }
                vm.calculateTotal();
                vm.resetSparePart(d);
            }

            function addSparePart(data) {
                order.get(data, vm.renderSpareParts, 'post');
                vm.show.addSpare = false;
                $scope.modal.hide();
            }

            function resetSparePart(d) {
                vm.addSpare.spare_code = '';
                vm.addSpare.spare_desc = '';
                vm.addSpare.spare_price = '';
                vm.addSpare.spare_discount = '';
                vm.addSpare.pieces = '';
                vm.aantal = '1';
                vm.sparepart_id = '';
                vm.sparepart = '';
                vm.discount = '0';
                vm.price_code = '';
                vm.art_id = '';
                vm.showAlerts(d);
            }

            function deleteSparePart(item) {
                var params = {
                    'do': 'xspare_list-order-delete',
                    order_id: $stateParams.order_id,
                    sparepart_id: item.SPARE_ID
                };
                order.get(params, vm.renderSpareParts, 'post');
            }




            function spareAdd(d, item) {
                var params = {
                    'do': 'xspare_list-order-' + d,
                    'order_id': $stateParams.order_id,
                    'sparepart_id': item.sparepart_id,
                    'pieces': item.aantal,
                    'discount': item.discount,
                    'desc': item.sparepart,
                    'price_code': item.price_code,
                    'art_id': vm.order.DEVICE_CAT_NR,
                    'order_nr': vm.order.order_nr
                }
                addSparePart(params);
            }

            function save(i) {
                if (i) {
                    vm.order.f_send = '1';
                }
                vm.order.do = 'edit-order-update';
                order.get(vm.order, vm.renderOder, 'post');
            }

            function showAlerts(d) {
                // deedee
                helper.showAlerts(vm, d);
            }


            // exploded views modal
            $ionicModal.fromTemplateUrl('templates/modal2.html', {
                scope: $scope
            }).then(function($ionicModal) {
                $scope.modal2 = $ionicModal;
            });

            $scope.openModal2 = function(art_id) {
                $scope.modal2.show();
                $scope.apiExplodedViews = [];
                $scope.loadModal2Data(art_id);
            };


            $scope.loadModal2Data = function(art_id){

                //var dataSP = { 'do': 'explodedViews', art_id: art_id };
                $http.get('http://www.asogem.be/api/index.php?do=explodedViews&art_id=' + art_id).then(function(d){
                    $scope.apiExplodedViews = d.data.data;
                });
            }



            // spare parts modal
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function($ionicModal) {
                $scope.modal = $ionicModal;
            });

            $scope.openModal = function(art_id) {
                $ionicLoading.show({
					template: 'Loading spare parts...'
				});
                vm.searchTerm = '';
                $scope.modal.show();
                $scope.apiSpareParts = [];
                $scope.offset = 0;
                $scope.loadModeData = true;
                $scope.loadModalData(art_id);
            };

            $scope.searchSparePart = function(art_id){
                $scope.apiSpareParts = [];
                $scope.offset = 0;
                $scope.loadModeData = true;
                $scope.loadModalData(art_id);
            }

            $scope.loadModalData = function(art_id){

                //var dataSP = { 'do': 'splist', art_id: art_id, offset: $scope.offset, search: vm.searchTerm };
                $http.get('http://www.asogem.be/api/index.php?do=splist&art_id=' + art_id + '&offset=' + $scope.offset + '&search=' + vm.searchTerm).then(function(d){
                    $scope.apiSpareParts = $scope.apiSpareParts.concat(d.data.data);
                    if(d.data.data.length < 30){
                        $scope.loadModeData = false;
                    }
                    $ionicLoading.hide();
                    console.log($scope.apiSpareParts.length);
                    $scope.offset++;
                });
            }

            $scope.loadMore = function(art_id){
                if(!$scope.loadModeData){
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                $ionicLoading.show({
					template: 'Loading spare parts...'
				});
                $scope.loadModalData(art_id);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            //close modal on back button
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                if($scope.modal.isShown()){
                    //event.preventDefault();
                    $scope.modal.hide();
                }
                if($scope.modal2.isShown()){
                    //event.preventDefault();
                    $scope.modal2.hide();
                }
                
                $scope.modal2.hide();
            });
            
            // drive to function
            $scope.driveTo = function (address) {
                //console.log(address);
                //return false;
                $cordovaVibration.vibrate(100);
                $cordovaLaunchNavigator.navigate(address).then(function () {
                    console.log("Navigator launched");
                }, function (err) {
                    console.error(err);
                });
            }
            
            
            // barcode scanner function
            $scope.barcodeScan = function (art_id) {
                //console.log('func start');
                $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                    // Success! Barcode data is here
                    //console.log(barcodeData);
                    searchTerm = barcodeData.text;
                    //console.log(searchTerm);
                    vm.searchTerm = searchTerm;
                    $scope.searchSparePart(art_id);
                }, function(error) {
                    console.log('error' + error);
                    // An error occurred
                });

            }
            //accordion functions
            // tutorial: http://loring-dodge.azurewebsites.net/ionic-item-expand/
            $scope.shownGroup = null;
            $scope.toggleGroup = function(group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }
            };
            $scope.isGroupShown = function(group) {
                return $scope.shownGroup === group;
            };
            
            // function for exploded views
            $scope.exploded_view = function (url) {
            if (ionic.Platform.isAndroid()) {
                        url = 'https://docs.google.com/viewer?url=' + encodeURIComponent(url);
            }
                console.log(url);
            var ref = window.open(url, '_blank', 'location=no');
        }
			
        }]);