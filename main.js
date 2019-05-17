var myapp = angular.module('myapp', ["ui.router"]);
myapp.run( ['$rootScope', '$state', '$stateParams', 
function ( $rootScope, $state, $stateParams, ) {
    /**
     * @abstract Router error detection - captura los errores en la navegación y lanza una confirmación con un mensaje.
     */
    $state.defaultErrorHandler( function ( error ) {
        const messageErrorRouter = error['message'];
        let r = confirm( "Al lugar donde desea navegar no esta disponible en este momento, por favor intente de nuevo mas tarde, gracias." );
        if ( r == true ) {
            return console.log( messageErrorRouter + ": The route you are looking for is not available at this time." );
        } else {
            return $state.go('index');
        };
    } );
}] );

myapp.config(function($stateProvider, $urlRouterProvider){
    let tempParam = 'nofound';
    $stateProvider
    .state('index', {
        url: "/",
        template: "index template"
    })
    .state('dynamic', {
        url: "/dynamic/:id",
        views: {
            '' : {
                /**
                 * @tutorial Dynamic_template
                 * Opción con ng-include
                 * @example
                 * template: (params, $transition$) => `<div ng-include="vm.view + '.html'" class="o-main"></div>`
                 */
                
                templateUrl: (params, $transition$) => `./views/${tempParam}.html`
                , controller:  'ctrl as vm'
            }
        },
        resolve: {
            dynamicTempResolve: function ($q, $timeout, $state, $stateParams, $transition$) {
                console.log("TCL: $transition$", $transition$.params())
                var deferred = $q.defer();
                fetch(`server.json`)
                    .then(data => data.json())
                    .then(data => {
                        tempParam = data['viewName'];
                        $timeout(function () { deferred.resolve(data); }, 1000);
                    }).catch(err => {
                        console.error(err);
                    })
                
                return deferred.promise;
            }
        }
    })
    $urlRouterProvider.otherwise('/');
});
  
  myapp.controller('ctrl', ['$scope', '$transition$', 'dynamicTempResolve', 
  function($scope, $transition$, dynamicTempResolve) {
        let vm = this;
        let { tipo, data: images, viewName } = dynamicTempResolve;
        vm.images = images;
        vm.view = viewName;
        console.log('type of employee is:', tipo, images);
  }]);