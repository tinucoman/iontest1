angular
    .module('asogem') 
    .controller('imagesCtrl', ['$scope', '$rootScope', '$http', '$stateParams', '$timeout', 'Upload', '$ionicModal', '$ionicLoading', '$cordovaCamera', '$cordovaFileTransfer',
        function ($scope, $rootScope, $http, $stateParams, $timeout, Upload, $ionicModal, $ionicLoading, $cordovaCamera, $cordovaFileTransfer) {
            $scope.run = function () {
                if(!angular.isDefined($scope.order)) {
                    $scope.order = {};
                }
                $rootScope.showSearchButton = false;
                $scope.photos = [];

                if ($stateParams.order_id){
                    $http.get($rootScope.apiUrl + 'index.php?do=morder_photos&xget=photos&order_id=' + $stateParams.order_id).then(function (response) {
                        $scope.photos = response.data.data.photos;
                    }, function (err) {
                        console.log(err);
                        return false;
                    })
                } 
            };

            $scope.photoDelete = function(photo_id){
                var params = {
                    'do': 'order_photos-order-photo_delete', 
                    'xget': 'photos',
                    'order_id': $stateParams.order_id,
                    'photo_id': photo_id
                };
                $http.get($rootScope.apiUrl + 'index.php', params).then(function(response){
                    $scope.photos = response.data.data.photos;
                }, function(err){
                    console.log(err);
                    return false;
                })
            }
            
            $scope.takePhoto = function () {
                  var options = {
                    quality: 75,
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
                            $scope.run();
                            $ionicLoading.hide();
                            //alert("success");
                        }, function(err) {
                            alert('Upload failed. Please check your network connection and try again!');
                            console.log("ERROR: " + JSON.stringify(err));
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
                    quality: 75,
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
                            $scope.run();
                            $ionicLoading.hide();
                            //alert("success");
                        }, function(err) {
                            alert('Upload failed. Please check your network connection and try again!');
                            console.log("ERROR: " + JSON.stringify(err));
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
            
            $scope.run();
        }]);
