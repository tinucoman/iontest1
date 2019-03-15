angular
    .module('asogem')
    .constant('appVersion', {
        debug: false
    })
    .run(function ($rootScope, appVersion, appConfig, $http, $ionicModal) {
        $rootScope.updateAvailable = false;
        $rootScope.downloadingUpdate = false;
        var timestamp = Math.floor(Date.now() / 1000);
        $http.get(appConfig.updateUrl + 'version.json?'+timestamp).then(function (response) {
            $rootScope.newVersion = response.data.version;
            $rootScope.newVersionName = response.data.versionName;
            $rootScope.newVersionDescription = response.data.versionDescription;
            $rootScope.installFile = response.data.installFile;

            $rootScope.version = appConfig.version;
            $rootScope.versionName = appConfig.versionName;

            if(appVersion.debug == true)
            {
                alert('Succesfully retreived the new version file');
            }
            if($rootScope.newVersion > $rootScope.version) {

                $rootScope.updateAvailable = true;
                $rootScope.updateModal.show();

                if(appVersion.debug == true)
                {
                    alert('There is a new version to download');
                }
            }
        }, function (err) {
            if(appVersion.debug == true)
            {
                alert('version.json file not found on updateUrl');
            }
            return false;
        })

        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {

            if(appVersion.debug == true)
            {
                alert('Device Ready');
            }

                $rootScope.startUpdate = function(){
                    // update will take place here
                    if(!$rootScope.updateAvailable){
                        return false;
                    }
                    if(appVersion.debug == true)
                    {
                        alert('Starting Update Process');
                    }

                    $rootScope.downloadingUpdate = true;

                    window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function (fileSystem) {
                        var getFilePermissions = function(){
                            if(appVersion.debug == true)
                            {
                                alert('Checking for permissions');
                            }
                            var permissions = cordova.plugins.permissions;
                            permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function (status) {
                                if (!status.hasPermission) {
                                    var errorCallback = function () {
                                        alert("Error: app requires storage permission");
                                    };
                                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE,
                                        function (status) {
                                            if (!status.hasPermission)
                                                errorCallback();
                                            else {
                                                downloadFile(fileSystem);
                                            }
                                        },
                                        errorCallback);
                                }
                                else {

                                    downloadFile(fileSystem);
                                }
                            }, null);
                        }

                        getFilePermissions();

                        var downloadFile = function (fileSystem) {
                            if(appVersion.debug == true)
                            {
                                alert('Start Download');
                            }
                            var timestamp = Math.floor(Date.now() / 1000);
                            var localPath = cordova.file.externalRootDirectory + timestamp + $rootScope.installFile;
                            $rootScope.downloadingUpdate = true;

                            fileTransfer = new FileTransfer();
                            fileTransfer.download(appConfig.updateUrl + $rootScope.installFile, localPath, function (entry) {
                                $rootScope.downloadingUpdate = false;
                                if(appVersion.debug == true)
                                {
                                    alert("Downloaded file: " + localPath);

                                }

                                window.plugins.intentShim.startActivity({
                                        action: window.plugins.intentShim.ACTION_INSTALL_PACKAGE,
                                        url: localPath,
                                        //url: 'content://' + entry.fullPath,
                                        type: 'application/vnd.android.package-archive'
                                    },
                                    function (data) {

                                        if(appVersion.debug == true)
                                        {
                                            alert("Done  " + JSON.stringify(data));
                                        }

                                    },
                                    function (e) {

                                        if(appVersion.debug == true)
                                        {
                                            alert("Error installing: " + JSON.stringify(e));
                                        }

                                    }
                                );
                            }, function (error) {
                                alert("Error downloading the latest updates! - error: " + JSON.stringify(error));
                            });
                        };
                    }, function (evt) {
                        alert("Error preparing to download the latest updates! - Err - " + evt.target.error.code);
                    });
                }

        };

        // Update Part
        $ionicModal.fromTemplateUrl('templates/update.html', {
            scope: $rootScope,
            hardwareBackButtonClose: false
        }).then(function($ionicModal) {
            $rootScope.updateModal = $ionicModal;
        });

        $rootScope.updateMe = function(){
             $rootScope.updateModal.show();
        }

    })

