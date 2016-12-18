var app = angular.module('KeralaRestaurants.controllers', []);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

	//Load district data
	if($scope.districts==undefined){
		$scope.districts = districts;
	};
})

app.controller('RestaurantsCtrl', function($rootScope, $scope, $stateParams, $window, $state, restaurantService) {
	if($stateParams.district==""){
		$scope.exploreNearby = "Welcome";			
	}else{
		$scope.exploreNearby = $stateParams.district;
	}
	
    $scope.exploreQuery = "Food";
    $scope.filterValue = "";

    $scope.places = [];
	$rootScope.data = [];
    $scope.filteredPlaces = [];
    $scope.filteredPlacesCount = 0;

    //paging
    $scope.totalRecordsCount = 0;
    $scope.pageSize = 20;
    $scope.currentPage = 1;

    init();

    function init() {
		
		if($scope.exploreNearby == "Welcome"){
			try{
				var localStorage = $window.localStorage['MyDistrict'];
				
				if(localStorage !== undefined){
					//Load data
					$scope.exploreNearby = localStorage;
					getPlaces();	
				}else{
					//$ionicSideMenuDelegate.toggleLeft();
					$scope.exploreNearby = 'Kozhikode';
					getPlaces();
					$window.localStorage['MyDistrict'] = $scope.exploreNearby;
				}
			}catch(err){}
						
		}else{
			try{
				// Store the district for future use.
				$window.localStorage['MyDistrict'] = $stateParams.district;
			}catch(err){}
			
			//Load data
			getPlaces();
		}
    }
	
	function getPlaces() {
		var offset = ($scope.pageSize) * ($scope.currentPage - 1);
		
        restaurantService.get({ near: $scope.exploreNearby, query: $scope.exploreQuery, limit: $scope.pageSize, offset: offset }, function (restaurantResult) {
			
            if (restaurantResult.response.groups) {
				$rootScope.data.push.apply($rootScope.data,restaurantResult.response.groups[0].items);
				$scope.places.push.apply($scope.places, restaurantResult.response.groups[0].items);
				$scope.totalRecordsCount = restaurantResult.response.totalResults;
                //filterPlaces('');
				//alert($rootScope.data,restaurantResult.response.groups[0].items.length);
		
				if($scope.currentPage>1){
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
            }
            else {
                $scope.places = [];
                $scope.totalRecordsCount = 0;
            }
        });
    };
	
	$scope.buildVenueThumbnail = function (photo) {
		if(photo != undefined){
			return photo.items[0].prefix + '128x128' + photo.items[0].suffix;
		}else{
			if($scope.exploreQuery == 'Hospital'){
				return "./img/medical_bg_88.png"
			}else if($scope.exploreQuery == 'Food'){
				return "./img/food_foodcourt_bg_88.png"
			}else if($scope.exploreQuery == 'Shopping'){
				return "./img/mall_bg_88.png"
			}else if($scope.exploreQuery == 'Coffee'){
				return "./img/coffeeshop_bg_88.png"
			}else if($scope.exploreQuery == 'Movie Theater'){
				return "./img/movietheater_bg_88.png"
			}
		}
    };
	
	$scope.loadMore = function (page) {
		if(parseInt($scope.totalRecordsCount) > parseInt($scope.currentPage*$scope.pageSize)){
			$scope.currentPage = parseInt($scope.currentPage) + 1;
			getPlaces();
		}else{
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
    };
	
	$scope.tabClick = function(pValue){
		$scope.currentPage = 1;
		$scope.exploreQuery = pValue;
		$rootScope.data = [];
		$scope.places = [];
		getPlaces();
	}
	
	$scope.fn_ShowMap = function(plat, plng){
		$state.go("app.single", {lat:plat,lng:plng});			
	}
	
	$scope.fn_Dial = function(number) {
		window.open('tel:' + number, '_system');
	}
})

app.controller('HomeCtrl', function($scope, $window, $state) {
	// if none of the above states are matched, use this as the fallback
	try{
		
		var localStorage = $window.localStorage['MyDistrict'];
		
		if(localStorage!==""){
			alert(localStorage);
			
			$state.go("app.restaurants", {district:localStorage});
			$ionicHistory.clearHistory();
			
		}
	}catch(err){
	}
});

app.controller('MapCtrl', function($rootScope, $scope, $stateParams, $ionicLoading, $compile, $ionicHistory ) {
	
	initialize();
	
	function initialize() {
		
		//var item = $rootScope.data[$stateParams.restaurantId];
		var lat = $stateParams.lat;
		var lng = $stateParams.lng;
				
        var site = new google.maps.LatLng(lat,lng);
        var hospital = new google.maps.LatLng(11.259036776225587,75.781345693192);
      
        var mapOptions = {
          streetViewControl:true,
          center: site,
          zoom: 18,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
		var marker = new google.maps.Marker({
			position: site,
			map: map
		});
		
        $scope.map = map;
		google.maps.event.addDomListener(window, 'load', initialize);
       
        /*var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();

        var request = {
            origin : site,
            destination : hospital,
            travelMode : google.maps.TravelMode.DRIVING
        };
		
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

        directionsDisplay.setMap(map);*/
    }
	 
    //google.maps.event.addDomListener(window, 'load', initialize);
	 
	$scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };
	
});
