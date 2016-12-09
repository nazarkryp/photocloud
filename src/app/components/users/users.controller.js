angular.module('blogapp').controller('UsersController', ['$scope', '$state', '$stateParams', 'UsersService', 'UserService', 'AuthService', function($scope, $state, $stateParams, UsersService, UserService, AuthService) {
    $scope.currentUserId = AuthService.userId;

    $scope.group = {
        users: [],
        hasMoreItems: false,
        pageIndex: 0,
        pageSize: 5
    };

    $scope.loadMore = function() {
        init();
    };

    $scope.invertRelationshipsWithUser = function(user) {
        UserService.invertRelationshipsWithUser(user.id).then(
            function(response) {
                user.relationships = response;
            },
            function(error) {
                console.log(error);
            });
    };

    var init = function() {
        UsersService.getUsers($scope.group.pageIndex + 1, $scope.group.pageSize).then(
            function(response) {
                $scope.group.users = $scope.group.users.concat(response.items);
                $scope.group.pageIndex = response.pageIndex;
                $scope.group.hasMoreItems = response.hasMoreItems;
            }, function(error) {
                console.log(error);
            }
        );
    };

    init();
}]);