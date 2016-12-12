angular.module('blogapp').controller('IndexController', ['$scope', '$state', '$mdDialog', 'AuthService', 'UserService', 'PageService',
    function ($scope, $state, $mdDialog, AuthService, UserService, PageService) {
        $scope.AuthService = AuthService;
        $scope.pageService = PageService;
        $scope.page = {
            title: ''
        };

        $scope.isAuthenticated = false;

        $scope.gotoProfile = function () {
            $state.go('usersfeed', { username: AuthService.username });
        };

        $scope.gotoSignInPage = function () {
            $state.go('signin');
        };

        $scope.gotoSignUpPage = function () {
            $state.go('signup');
        };

        $scope.gotoFeedPage = function () {
            $state.go('feed');
        };

        $scope.openMenu = function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.$watch('pageService.title', function (value) {
            if (value) {
                $scope.page.title = value;
            }
        });

        $scope.$watch('AuthService.authenticated',
            function (value) {
                $scope.isAuthenticated = value;

                if (value) {
                    getAuthenticatedUser();
                    getIncommingRequests();
                } else {
                    $scope.user = null;
                }
            });

        $scope.signOut = function () {            
            AuthService.signOut();

            if ($state.current.name !== 'feed') {
                $state.go('signin');
            }
        };

        $scope.showRequests = function (ev) {
            $mdDialog.show({
                controller: 'UsersController',
                templateUrl: 'app/components/users/users-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        $scope.requests = [];

        $scope.acceptRequest = function (index) {
            var request = $scope.requests[index];

            UserService.responseIncommingRequest(request.id, true).then(
                function (response) {
                    $scope.requests.splice(index, 1);
                }, function (error) {
                    console.log(error);
                });
        };

        $scope.rejectRequest = function (index) {
            var request = $scope.requests[index];

            UserService.responseIncommingRequest(request.id, false).then(
                function (response) {
                    $scope.requests.splice(index, 1);
                }, function (error) {
                    console.log(error);
                });
        };

        var getIncommingRequests = function () {
            UserService.getIncommingRequests().then(
                function (response) {
                    $scope.requests = response;
                }, function (error) {
                    console.log(error);
                });
        };

        var getAuthenticatedUser = function () {
            $scope.user = {
                userId: AuthService.userId,
                username: AuthService.username,
                imageUri: AuthService.imageUri
            };
        };

        getIncommingRequests();
    }]);