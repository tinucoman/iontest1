angular
    .module('asogem')
    .controller('editCtrl', ['$scope', '$stateParams', '$state', 'order', 'helper', '$rootScope', '$ionicModal', '$http', '$ionicLoading', '$cordovaLaunchNavigator', '$cordovaVibration', '$cordovaBarcodeScanner', '$timeout', '$ionicPopup', '$ionicTabsDelegate',
        function($scope, $stateParams, $state, order, helper, $rootScope, $ionicModal, $http, $ionicLoading, $cordovaLaunchNavigator, $cordovaVibration, $cordovaBarcodeScanner, $timeout, $ionicPopup, $ionicTabsDelegate) {
            $rootScope.showSearchButton = false;

            var vm = this;
            vm.showRecommended = true;
            vm.order_id = $stateParams.order_id;
            vm.order = {};
            vm.notShowNext = 15;
            vm.arrive_values = ['15 min', '30 min', '45 min', '1h', '1h 30 min', '2h', '2h 30 min', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h'];
            vm.arrive = '15 min';

            vm.sparepart_id = undefined;
            vm.aantal = 1;
            vm.discount = 0;
            vm.addSpare = {
                order_id: $stateParams.order_id,
                'do': 'xspare_list-order-manual'
            };
            vm.show = {
                addSpare: false
            }

            vm.myOptions = [];

            // functions
            vm.saveOrderedSpareParts = saveOrderedSpareParts;
            vm.statusUpdate = statusUpdate;
            vm.renderOder = render;
            vm.calculateTotal = calculateTotal;
            vm.spareparts = getSpareParts;
            vm.renderSpareParts = renderSpare;
            vm.addSparePart = addSparePart;
            vm.resetSparePart = resetSparePart;
            vm.deleteSparePart = deleteSparePart;
            vm.deleteOrderSparePart = deleteOrderSparePart;
            vm.spareAdd = spareAdd;
            vm.save = save;
            vm.showAlerts = showAlerts;
            vm.change805 = change805;

            $scope.init = function() {
                $ionicLoading.show({
                    template: 'Loading Order Data...'
                });
                var params = {
                    'do': 'edit',
                    'order_id': $stateParams.order_id
                };
                order.get(params, vm.renderOder);
                vm.calculateTotal();
            }

            $scope.init();

            $scope.autosave = function() {
                save();
            };

            function render(d) {
                if (d && d.data) {
                    vm.order = d.data.order;
                    vm.order.email_language = 'nl';
                    vm.order.sms_language = $rootScope.lang_id;
                    vm.order.problem_code_category = '';
                    if(vm.order.invoicing805 == '1'){
                        vm.order.DISC810XX = '100,00';
                        vm.order.DISC800XX = '100,00';
                        vm.discount = '100';

                    }

                    vm.order.tmpStatus = 0;
                    vm.order.initialStatus = vm.order.repair_status;
                    vm.order.problem_code_show = vm.order.PROBLEM_CODE_DD;
                    if (vm.order.device_date_purchase2) {
                        vm.order.device_date_purchase = new Date(vm.order.device_date_purchase2 * 1000);
                    }
                    if (vm.order.date_repair3) {
                        vm.order.date_repair = new Date(vm.order.date_repair3 * 1000);
                    }

                    vm.spareparts();

                    $http.get('http://repair.asogem.be/index.php?do=spare_parts_r&lang=' + $rootScope.lang_id + '&art_id=' + vm.order.DEVICE_CAT_NR + '&order=' + vm.order.order_nr).then(function(d) {
                        if (d.data.data.length > 0) {
                            vm.showRecommended = true;
                        } else {
                            vm.showRecommended = false;
                        }

                        console.log(vm.showRecommended);
                    });

                    $timeout(function() {
                        $ionicLoading.hide()
                    }, 1000);
                    //vm.showAlerts(d);
                }
            }

            function change805(){
                if(vm.order.invoicing805 == '1'){
                    vm.order.DISC810XX = '100,00';
                    vm.order.DISC800XX = '100,00';
                    vm.discount = '100';

                } else {
                    vm.order.DISC810XX = '0,00';
                    vm.order.DISC800XX = '0,00';
                    vm.discount = '0';
                }
                calculateTotal();
            }

            function calculateTotal() {
                if (vm.order.f_guaranty == 1) {
                    vm.order.total_notax = '0,00';
                    vm.order.total_tax = '0,00';
                    vm.order.total = '0,00';
                    return true;
                }
                var total = 0;



                angular.forEach(vm.order.spareParts, function(item, key) {
                    var line_price = 0;
                    var line_qty = 0;
                    line_price = item.PRICE;
                    line_qty = item.PIECES;
                    line_discount = item.DISCOUNT;
                    line_discount = eval(line_discount.replace(',', '.'));

                    total = total + ((1 - line_discount / 100) * line_price * line_qty);
                });
                //console.log(total);
                var costtype = vm.order.PRICE800XX;
                if (angular.isDefined(costtype)) {
                    costtype = eval(costtype.replace(',', '.'));
                }


                var discount = vm.order.DISC800XX;
                if (angular.isDefined(discount)) {
                    discount = eval(discount.replace(',', '.'));
                    if(!angular.isNumber(discount)){
                        discount = '0';
                    }
                } else {
                    discount = 0;
                }

                var value = vm.order.workhours;

                var costtype1 = vm.order.PRICE810XX;
                if (angular.isDefined(costtype1)) {
                    costtype1 = eval(costtype1.replace(',', '.'));
                } else {
                    costtype1 = 0;
                }

                var discount1 = vm.order.DISC810XX;
                if (angular.isDefined(discount1)) {
                    discount1 = eval(discount1.replace(',', '.'));
                    if(!angular.isNumber(discount1)){
                        discount1 = '0';
                    }
                } else {
                    discount1 = 0;
                }
                

                var costtype2 = vm.order.PRICE850F;
                if (angular.isDefined(costtype2)) {
                    costtype2 = eval(costtype2.replace(',', '.'));
                }

                if($rootScope.benl == '1'){
                    var costtype3 = vm.order.PRICE_805;
                    if (angular.isDefined(costtype3)) {
                        costtype3 = eval(costtype3.replace(',', '.'));
                    }
                } else {
                    costtype3 = 0;
                }

                var invoicing = vm.order.invoicing;
                var invoicing805 = vm.order.invoicing805;
                var invoicing810 = vm.order.invoicing810;

                var extra_cost = vm.order.PRICE999999999 ? vm.order.PRICE999999999 : '0,00';
                extra_cost = eval(extra_cost.replace(',', '.'));
                
                total = total + ((costtype1 * (1 - discount1 / 100)) * invoicing810) + (costtype2 * invoicing) + (costtype3 * invoicing805) + extra_cost + (value * costtype * (1 - discount / 100));
                vm.order.total_notax = total.toFixed(2);

                var tax = total / 100 * 21;
                vm.order.total_tax = tax.toFixed(2);

                total = total + tax;
                vm.order.total = total.toFixed(2);
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
                    vm.order.orderSpareParts = d.data.orderSpareParts;

                    if(vm.order.orderSpareParts.length > 0){
                        if(vm.order.repair_status == '0'){
                            vm.notSaved = 1;
                            vm.order.repair_status = '1';
                            vm.order.tmpStatus = 1;
                        }

                    } else {
                        if(vm.order.repair_status == '1'){
                            vm.order.repair_status = '0';
                        }
                        vm.order.tmpStatus = 0;
                    }

                }
                vm.calculateTotal();
                vm.resetSparePart(d);
            }

            function saveOrderedSpareParts(){
                var params = {
                    'do': 'xspare_list-order-save_ordered',
                    'order_id': $stateParams.order_id,
                    'order_nr': vm.order.ORDER_NR
                }
                vm.order.repair_status = 1;
                order.get(params, vm.renderSpareParts, 'post');
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

            function deleteOrderSparePart(item) {
                var params = {
                    'do': 'xspare_list-order-delete2',
                    order_id: $stateParams.order_id,
                    sparepart_id: item.SPARE_ID
                };
                order.get(params, vm.renderSpareParts, 'post');
                vm.order.repair_status = '1';
                vm.order.tmpStatus = 1;
                vm.notSaved = 1;
                showPopupSaveSend(1);
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
                    'price': item.price,
                    'art_id': vm.order.DEVICE_CAT_NR,
                    'order_nr': vm.order.order_nr
                }
                if(d == 'order'){
                    if(!vm.order.prod_code1 && vm.order.screened == '1'){
                        if($rootScope.lang_id == 1) {
                            var errM = 'Product Code is verplicht';
                        }
                        if($rootScope.lang_id == 2) {
                            var errM = 'Product Code est obligatoire';
                        }
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: errM
                        });
                        return false;
                    }



                    vm.order.repair_status = '1';
                    vm.order.tmpStatus = 1;
                    //vm.order.screened = '1';
                    showPopupSaveSend(1);
                }
                addSparePart(params);
            }

            function statusUpdate(status){
                vm.order.oldStatus = vm.order.repair_status;
                if(status == '1' && vm.order.repair_status != '1'){
                    return false;
                }

                // start validation stuff
                if($rootScope.lang_id == 1) {
                    var errMsg1 = 'Serienummer is verplicht';
                    var errMsg3 = 'Pannecode is verplicht';
                    var errMsg2 = 'Aankoopdatum is verplicht';
                    var errMsg4 = 'Datum uitvoering is verplicht';
                }
                if($rootScope.lang_id == 2) {
                    var errMsg1 = 'Le Numéro de série est obligatoire';
                    var errMsg2 = 'La Date d\'achat est obligatoire';
                    var errMsg3 = 'Le Code Panne est obligatoire';
                    var errMsg4 = 'La Date d\'intervention est obligatoire';
                }
                // validate main fields
                var errorMsg = "";
                var hasError = false;
                if (!vm.order.device_serial || vm.order.device_serial == 'NIET GEKEND') {
                    errorMsg = errorMsg + errMsg1 + "<br>";
                    hasError = true;

                }
                if (!vm.order.device_date_purchase || vm.order.device_date_purchase == "") {
                    errorMsg = errorMsg +  errMsg2 + "<br>";
                    hasError = true;
                }
                if (!vm.order.date_repair || vm.order.date_repair == "") {
                    errorMsg = errorMsg +  errMsg2 + "<br>";
                    hasError = true;
                }
                if (!vm.order.problem_code_id || vm.order.problem_code_id == "") {
                    errorMsg = errorMsg +  errMsg3 + "<br>";
                    hasError = true;

                }

                if (hasError) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: errorMsg
                    });
                    alertPopup.then(function(res) {
                        console.log('you need to fix things');
                        return false;
                    });
                    return false;
                }
                // end validation stuff

                vm.notSaved = 1;
                if(vm.order.repair_status != status){
                    vm.order.repair_status = status;
                } else {
                    vm.order.repair_status = '0';
                    vm.order.tmpStatus = 0;
                }
                vm.order.tmpStatus = 1;

                console.log(vm.notShowNext, status);
                if(vm.notShowNext != status){
                    showPopupSaveSend(status);
                } else {
                    // reset it
                    vm.notShowNext = 15;
                }

            }

            function showPopupSaveSend(status) {

                console.log(vm.notShowNext, status);
                if($rootScope.lang_id == 1){
                    // NL Language
                    var title = "Opslaan en verzenden";
                    var subtitle = 'Wilt u uw wijzigingen opslaan en verzenden?';
                    var saveBtn = "Ja";
                    var laterBtn = "Later";
                }

                if($rootScope.lang_id == 2){
                    // fr Language
                    var title = "Sauver et Envoyer";
                    var subtitle = 'Voulez-vous sauver et envoyer vos changements?';
                    var saveBtn = "Sauver";
                    var laterBtn = "Plus tard";
                }



                // Custom popup
                var myPopup = $ionicPopup.show({
                    template: '',
                    title: title,
                    subTitle: subtitle,
                    scope: $scope,

                    buttons: [
                        {
                            text: "Cancel",
                            type: 'button-small',
                            onTap: function(e) {
                                vm.order.repair_status = vm.order.oldStatus;
                            }
                        },
                        {
                            text: laterBtn,
                            type: 'button-small',
                            onTap: function(e) {
                                vm.notShowNext = status;
                            }
                        },
                        {
                            text: '<b>' + saveBtn + '</b>',
                            type: 'button-positive button-small',
                            onTap: function(e) {

                                // saving skip validation
                                vm.order.f_send = '1';
                                vm.notSaved = 0;
                                saveOrder();
                            }
                        }
                    ]
                });

            };

            function save(i) {

                if(!i){
                    saveOrder();
                    return false;
                }

                if (vm.order.initialStatus != vm.order.repair_status) {
                    // if status changed
                    showPopupSaveSend(vm.order.repair_status);
                    return true;
                } else {
                    if (vm.order.initialStatus == '1') {
                        showPopupSaveSend(vm.order.repair_status);
                        return true;
                    }
                }
                if($rootScope.lang_id == 1) {
                    var title1 = 'Deze interventie zal worden gesloten';
                    var subtitle1 = 'Deze status is definitief. Bevestig alstublieft:';
                    var yes1 = 'Sluiten'
                    var no1 = 'Nee'
                }
                if($rootScope.lang_id == 2) {
                    var title1 = 'Cette intervention va être fermée';
                    var subtitle1 = 'Ce statut est definitif. Merci de confirmer:';
                    var yes1 = 'Fermer'
                    var no1 = 'Non'
                }

                var cancelPopup = $ionicPopup.show({
                    template: '',
                    title: title1,
                    subTitle: subtitle1,
                    scope: $scope,

                    buttons: [
                        {
                            text: no1,
                            onTap: function(e) {
                                cancelThis = true;
                            }
                        },
                        {
                            text: '<b>' + yes1 + '</b>',
                            type: 'button-positive',
                            onTap: function(e) {

                                if($rootScope.lang_id == 1) {
                                    var errMsg1 = 'Serienummer is verplicht';
                                    var errMsg2 = 'Aankoopdatum is verplicht';
                                    var errMsg3 = 'Pannecode is verplicht';
                                    var errMsg4 = 'Datum uitvoering is verplicht';
                                }
                                if($rootScope.lang_id == 2) {
                                    var errMsg1 = 'Le Numéro de série est obligatoire';
                                    var errMsg2 = 'La Date d\'achat est obligatoire';
                                    var errMsg3 = 'Le Code Panne est obligatoire';
                                    var errMsg4 = 'La Date d\'intervention est obligatoire';
                                }

                                // validate main fields
                                var errorMsg = "";
                                var hasError = false;
                                if (!vm.order.device_serial || vm.order.device_serial == 'NIET GEKEND') {
                                    if (i) {
                                        errorMsg = errorMsg + errMsg1 + "<br>";
                                        hasError = true;
                                    }
                                }
                                if (!vm.order.device_date_purchase || vm.order.device_date_purchase == "") {
                                    if (i) {
                                        errorMsg = errorMsg +  errMsg2 + "<br>";
                                        hasError = true;
                                    }
                                }
                                if (!vm.order.date_repair || vm.order.date_repair == "") {
                                    errorMsg = errorMsg +  errMsg4 + "<br>";
                                    hasError = true;
                                }
                                if (!vm.order.problem_code_id || vm.order.problem_code_id == "") {
                                    if (i) {
                                        errorMsg = errorMsg +  errMsg3 + "<br>";
                                        hasError = true;
                                    }
                                }

                                if (hasError) {
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Error',
                                        template: errorMsg
                                    });
                                    alertPopup.then(function(res) {
                                        console.log('you need to fix things');
                                        return false;
                                    });

                                } else {
                                    if (i) {
                                        if (!vm.order.CLIENT_EMAIL) {
                                            var confirmPopup = $ionicPopup.confirm({
                                                title: 'Customer Email',
                                                template: 'Customer email is not provided. <br>Are you sure you want to proceed?'
                                            });

                                            confirmPopup.then(function(res) {
                                                if (res) {
                                                    // save and close
                                                    vm.order.f_send = '1';
                                                    saveOrder();
                                                } else {
                                                    // cancel
                                                    return false;
                                                    //vm.order.f_send = '0';
                                                }
                                            });
                                        } else {
                                            // save and close
                                            vm.order.f_send = '1';
                                            vm.notSaved = 0;
                                            saveOrder();
                                        }

                                    } else {
                                        saveOrder();
                                    }

                                }

                            }
                        }
                    ]
                });


            }

            function saveOrder() {
                vm.order.do = 'edit-order-update';
                $ionicLoading.show({
                    template: 'Saving...'
                });
                vm.order.lang_id = $rootScope.lang_id;
                order.get(vm.order, function() {
                    vm.renderOder();
                    vm.order.initialStatus = vm.order.repair_status;
                    $timeout(function() {
                        $ionicLoading.hide()
                    }, 500);
                }, 'post');
            }

            function showAlerts(d) {
                // deedee
                helper.showAlerts(vm, d);
            }


            $scope.showCode = function() {
                if (vm.order.problem_code_category == '') {
                    vm.order.problem_code_show = vm.order.PROBLEM_CODE_DD;
                } else {
                    vm.order.problem_code_id = '';
                    vm.order.problem_code_show = [];
                    vm.order.PROBLEM_CODE_DD.forEach(function(item) {
                        var code = item.id.substr(0, 1);
                        if (code == vm.order.problem_code_category) {
                            vm.order.problem_code_show.push(item);
                        }
                    });
                }


                return false;
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


            $scope.loadModal2Data = function(art_id) {

                //var dataSP = { 'do': 'explodedViews', art_id: art_id };
                $http.get('https://www.asogem.be/api/index.php?do=explodedViews&art_id=' + art_id).then(function(d) {
                    $scope.apiExplodedViews = d.data.data;


                });
            }


            // spare parts modal
            $ionicModal.fromTemplateUrl('templates/modal.html', {
                scope: $scope
            }).then(function($ionicModal) {
                $scope.modal = $ionicModal;
            });

            $scope.openModal = function(art_id, order_id) {
                $ionicLoading.show({
                    template: 'Loading spare parts...'
                });
                vm.searchTerm = '';
                $scope.modal.show();
                if(!vm.showRecommended){
                    $ionicTabsDelegate .select(1, false);
                }

                $scope.apiSpareParts = [];
                $scope.apiSparePartsR = [];
                $scope.offset = 0;
                $scope.loadModeData = true;
                $scope.loadModeDataR = true;
                $scope.loadModalData(art_id, order_id);
            };

            $scope.searchSparePart = function(art_id) {
                if(vm.searchTerm.length < 3){
                    return false;
                }
                $scope.apiSpareParts = [];
                $scope.apiSparePartsR = [];
                $scope.offset = 0;
                $scope.loadModeData = true;
                $scope.loadModeDataR = true;
                $scope.loadModalData(art_id);
            }



            $scope.loadModalData = function(art_id, order_id) {
if(!order_id){
    $http.get('http://repair.asogem.be/index.php?do=spare_parts&lang=' + $rootScope.lang_id + '&art_id=' + art_id + '&offset=' + $scope.offset + '&search=' + vm.searchTerm).then(function(d) {
        $scope.apiSpareParts = $scope.apiSpareParts.concat(d.data.data);
        $scope.apiSparePartsR = $scope.apiSparePartsR.concat(d.data.data);
        if(vm.order.invoicing805 == '1'){
            angular.forEach($scope.apiSpareParts, function(value, key){
                value.discount = '100';
            });
        }
        if(vm.order.invoicing805 == '1'){
            angular.forEach($scope.apiSparePartsR, function(value, key){
                value.discount = '100';
            });
        }

        if (d.data.data.length < 100) {
            $scope.loadModeData = false;
        }
        $ionicLoading.hide();
        //console.log($scope.apiSpareParts.length);
        $scope.offset++;
        return true;
    });
}
                //var dataSP = { 'do': 'splist', art_id: art_id, offset: $scope.offset, search: vm.searchTerm };
                $http.get('http://repair.asogem.be/index.php?do=spare_parts_r&lang=' + $rootScope.lang_id + '&art_id=' + art_id + '&order=' + order_id + '&offset=' + $scope.offset + '&search=' + vm.searchTerm).then(function(d) {
                    $scope.apiSparePartsR = $scope.apiSparePartsR.concat(d.data.data);
                    if(vm.order.invoicing805 == '1'){
                        angular.forEach($scope.apiSparePartsR, function(value, key){
                            value.discount = '100';
                        });
                    }

                    if (d.data.data.length < 100) {
                        $scope.loadModeDataR = false;
                    }

                    $ionicLoading.hide();
                    $scope.offset++;
                });

                $http.get('http://repair.asogem.be/index.php?do=spare_parts&lang=' + $rootScope.lang_id + '&art_id=' + art_id + '&offset=' + $scope.offset + '&search=' + vm.searchTerm).then(function(d) {
                    $scope.apiSpareParts = $scope.apiSpareParts.concat(d.data.data);
                    if(vm.order.invoicing805 == '1'){
                        angular.forEach($scope.apiSpareParts, function(value, key){
                            value.discount = '100';
                        });
                    }

                    if (d.data.data.length < 100) {
                        $scope.loadModeData = false;
                    }
                    $ionicLoading.hide();
                    //console.log($scope.apiSpareParts.length);
                    $scope.offset++;
                });
                $http.get('https://www.asogem.be/api/index.php?do=explodedViews&art_id=' + art_id).then(function(d) {
                    $scope.apiExplodedViews = d.data.data;
                });
            }

            $scope.loadMore = function(art_id) {
                if (!$scope.loadModeData) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                $ionicLoading.show({
                    template: 'Loading spare parts...'
                });
                $scope.loadModalData(art_id);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }

            $scope.loadMoreR = function(art_id) {
                if (!$scope.loadModeDataR) {
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
                if ($scope.modal.isShown()) {
                    //event.preventDefault();
                    $scope.modal.hide();
                }
                if ($scope.modal2.isShown()) {
                    //event.preventDefault();
                    $scope.modal2.hide();
                }

                $scope.modal2.hide();
            });

            // drive to function
            $scope.driveTo = function(address) {
                //console.log(address);
                //return false;
                $cordovaLaunchNavigator.navigate(address).then(function() {
                    console.log("Navigator launched");
                }, function(err) {
                    console.error(err);
                });
            }


            // barcode scanner functions
            $scope.barcodeScanDeviceSerial = function(art_id) {
                $cordovaBarcodeScanner.scan().then(function(barcodeData) {
                    vm.order.device_serial = barcodeData.text;
                }, function(error) {
                    console.log('error' + error);
                    // An error occurred
                });

            }

            $scope.barcodeScan = function(art_id) {
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

            $scope.shownGroup2 = null;
            $scope.toggleGroup2 = function(group) {
                if ($scope.isGroupShown2(group)) {
                    $scope.shownGroup2 = null;
                } else {
                    $scope.shownGroup2 = group;
                }
            };
            $scope.isGroupShown2 = function(group) {
                return $scope.shownGroup2 === group;
            };


            // function for exploded views
            $scope.exploded_view = function(url,type) {
                if(type=='noicon'){
                    $scope.url_image=url;
                    $scope.gifmodal.show();


                }else{
                    if (ionic.Platform.isAndroid()) {
                        url = 'https://docs.google.com/viewer?url=' + encodeURIComponent(url);
                    }

                    var ref = window.open(url, '_blank', 'location=no');

                }


            }

            $ionicModal.fromTemplateUrl('templates/gifmodal.html', {
                scope: $scope,

            }).then(function($ionicModal) {
                $scope.gifmodal = $ionicModal;
            });

        }
    ]);