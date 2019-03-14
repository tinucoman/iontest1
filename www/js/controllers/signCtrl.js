angular
    .module('asogem') 
    .controller('signCtrl', ['$scope', '$rootScope', '$http', '$stateParams', '$timeout', 'Upload', '$ionicModal', '$ionicLoading', '$cordovaCamera', '$cordovaFileTransfer', '$ionicPopup', '$window',
        function ($scope, $rootScope, $http, $stateParams, $timeout, Upload, $ionicModal, $ionicLoading, $cordovaCamera, $cordovaFileTransfer, $ionicPopup, $window) {
            
            var canvas = document.getElementById('signatureCanvas');
            var signaturePad = new SignaturePad(canvas);
            
            $scope.run = function () {
                $rootScope.showSearchButton = false;
                $scope.canvasWidth = $window.innerWidth - 12;
                $scope.canvasHeight = $window.innerHeight - 140;
            };
            
            $scope.clearCanvas = function() {
                signaturePad.clear();
            }
            
            $scope.saveCanvas = function() {
                $scope.imgURI = signaturePad.toDataURL();
                var url = $rootScope.apiUrl + 'index.php?do=order_photos-order-photo_add&order_id=' + $stateParams.order_id;

                var targetPath = $scope.imgURI;
                var milliseconds = new Date().getTime();
                //var filename = targetPath.split("/").pop();
                var filename = 'signatureimg_' + milliseconds + '.png';
                var options = {
                    fileKey: "file",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/png"
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
