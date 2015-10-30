define(['modules/common/config/initModule'],function (Hairzzlers) {
    'use strict';
    var logger = console.log, tracer=console.trace;
    Hairzzlers.controller('ModalCtrl',['$scope','$rootScope', '$modal' ,'$timeout','$state', function ($scope,$rootScope, $modal ,$timeout,$state) {


        var templateModal = {
            signIn : '/partials/components/signin.html',
            demoReg: '/partials/components/demoreg.html',
            subscribe: '/partials/store/subscribe.html',
            notifyReg: '/partials/components/notifyReg.html',
            confirm: '/partials/components/confirm.html',
            contactForm: '/partials/components/contactform.html',
            createWorkSpace: '/partials/components/workspace.html',
            privacy: '/partials/common/privacy.html'
        };
        $rootScope.modalOpen = false;
        //var opened = [];//hold all the open modal names;

        /**
         * open up the modal window
         * @param template the template to use and show up in modal
         * @param size the size of the modal window lg/sm/none
         */
        $scope.open = function (template, size) {
            if (typeof templateModal[template]=='undefined') {
                console.warn('you must specify a valid templateUrl or forget to add one');
                return;
            }
            $rootScope.modalOpen = true;

            /**
             * Get an Instance of model and open it
             */
            var modalInstance = $modal.open({ //will open up the modal
                    templateUrl: templateModal[template],
                    controller: 'ModalInstanceCtrl',
                    windowTemplateUrl: '/partials/components/modal.html',
                    windowClass:'stick-up',//slide-up disable-scroll,stick-up,slide-right
                    size: size,
                    backdrop: true,
                    resolve: {
                        items: function () {
                            return [1, 2, 3];
                        }
                    }
                });

            //resolver after some operation on modal can be avoided
            modalInstance.result
                .then(function (fromModalInstance) {
                    $rootScope.modalOpen = false;
                    switch(fromModalInstance){
                        case 'confirmed':
                            $rootScope.$broadcast('confirmed',{
                                id:'entrylog',
                                stat:true
                            });
                            break;
                        case 'termaccepted':
                            $rootScope.isTermAgreed = true;
                            break;
                        case 'termdeclined':
                            $rootScope.isTermAgreed = false;
                            break;
                    }
                }, function () {
                    $rootScope.modalOpen = false;
                    console.log('Modal dismissed at: ' + new Date());
                    $state.go($state.current, {}, {reload: true});
                });
        };

        /** trigger Modal window Opening
         *  $rootScope.emit('triggerModal',{
             *      name : 'confirm',
             *      size : 'sm'
             *  })
         * **/
        var test = $rootScope.$on('triggerModal',function(event,modalDetails){
            if(!$rootScope.modalOpen)
                $scope.open(modalDetails.name, modalDetails.size);
            //test();
        });

    }])

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

    .controller('ModalInstanceCtrl', ['$scope','$timeout','$window','$rootScope', '$modalInstance', 'items','vault',function ($scope,$timeout,$window,$rootScope, $modalInstance, items,vault) {
        var fromModalInstance='';
        $scope.ok = function (triggerOps) {
            fromModalInstance=triggerOps?triggerOps:'test';
            closeModal(fromModalInstance);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        var closeModal = function(fromModalInstance){
            $modalInstance.close(fromModalInstance);
        }

        require(['js/waves'],function(Waves){
            console.log('waves',Waves);
            $timeout(function(){
                Waves.attach('.btn',['waves-float']);
            },1000);
        });

        $rootScope.$on('loggedIn',closeModal);
        $rootScope.$on('closeModal',closeModal);
    }]);
});