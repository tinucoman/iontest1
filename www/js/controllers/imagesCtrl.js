angular
    .module('asogem') 
    .controller('imagesCtrl', ['$scope', '$rootScope', '$http', '$stateParams', '$timeout', 'Upload', '$ionicModal', '$ionicLoading', '$cordovaCamera', '$cordovaFileTransfer', '$ionicPopup',
        function ($scope, $rootScope, $http, $stateParams, $timeout, Upload, $ionicModal, $ionicLoading, $cordovaCamera, $cordovaFileTransfer, $ionicPopup) {
            $scope.run = function () {
                if(!angular.isDefined($scope.order)) {
                    $scope.order = {};
                }
                $rootScope.showSearchButton = false;
                $scope.photos = [];

                if ($stateParams.order_id){
                    $http.get($rootScope.apiUrl + 'index.php?do=morder_photos&xget=images&order_id=' + $stateParams.order_id).then(function (response) {
                        $scope.photos = response.data.data.photos;
                        $timeout(function(){
                                $('.modal-gallery').swipebox();
                            },500);                  
                    }, function (err) {
                        console.log(err);
                        return false;
                    })
                } 
            };
            
            $scope.showConfirm = function(photo_id) {
               var confirmPopup = $ionicPopup.confirm({
                 title: 'Delete Photo',
                 template: 'Are you sure you want to delete this photo?'
               });

               confirmPopup.then(function(res) {
                 if(res) {
                   $scope.photoDelete(photo_id);
                 } else {
                   console.log(photo_id);
                 }
               });
             };
            
            $scope.photoDelete = function(photo_id){
                var params = {
                    'do': 'morder_photos-order-photo_delete', 
                    'xget': 'images',
                    'order_id': $stateParams.order_id,
                    'photo_id': photo_id
                };
                $http.post($rootScope.apiUrl + 'index.php', params).then(function(response){
                    $scope.photos = response.data.data.photos;
                    $timeout(function(){
                                $('.modal-gallery').swipebox();
                            },500); 
                }, function(err){
                    console.log(err);
                    return false;
                })
            }
            
            $scope.takePhoto = function () {
                  var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        
                        var url = $rootScope.apiUrl + 'index.php?do=order_photos-order-photo_add&order_id=' + $stateParams.order_id;

                        //target path may be local or url
                        var targetPath = $scope.imgURI;
                        var milliseconds = new Date().getTime();
                        //var filename = targetPath.split("/").pop();
                        var filename = 'orderimg_' + milliseconds + '.jpg';
                        var options = {
                            fileKey: "file",
                            fileName: filename,
                            chunkedMode: false,
                            mimeType: "image/jpg"
                        };


                        $ionicLoading.show({
                            template: 'Uploading...'
                        });

                        $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                            $ionicLoading.hide();
                            $scope.run();

                            //alert("success");
                        }, function(err) {
                            alert('Upload failed. Please check your network connection and try again!');
                            //alert("ERROR: " + JSON.stringify(err));
                            $ionicLoading.hide();
                        }, function (progress) {
                            // constant progress updates
                            $timeout(function () {
                                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                //console.log($scope.downloadProgress + ' ');
                            })
                        });
                        
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
            }
                
            $scope.choosePhoto = function () {
                  var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                        
                        var url = $rootScope.apiUrl + 'index.php?do=order_photos-order-photo_add&order_id=' + $stateParams.order_id;

                        //target path may be local or url
                        var targetPath = $scope.imgURI;
                        var milliseconds = new Date().getTime();
                        //var filename = targetPath.split("/").pop();
                        var filename = 'orderimg_' + milliseconds + '.jpg';
                        var options = {
                            fileKey: "file",
                            fileName: filename,
                            chunkedMode: false,
                            mimeType: "image/jpg"
                        };

                        $ionicLoading.show({
                            template: 'Uploading...'
                        });

                        $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
                            $ionicLoading.hide();
                            $scope.run();

                            //alert("success");
                        }, function(err) {
                            $ionicLoading.hide();
                            alert('Upload failed. Please check your network connection and try again!');
                            //alert("ERROR: " + JSON.stringify(err));

                        }, function (progress) {
                            // constant progress updates
                            $timeout(function () {
                                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                //console.log($scope.downloadProgress + ' ');
                            })
                        });
                        
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
            }
            
            $scope.run();
        }]);
