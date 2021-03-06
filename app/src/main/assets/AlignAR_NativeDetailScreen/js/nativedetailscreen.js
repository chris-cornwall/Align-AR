var ServerInformation = {
	POIDATA_SERVER: "http://danu6.it.nuigalway.ie/ITChris/pois.json",
	POIDATA_SERVER_ARG_LAT: "lat",
	POIDATA_SERVER_ARG_LON: "lon",
	POIDATA_SERVER_ARG_ALT: "alt",
	POIDATA_SERVER_ARG_NR_POIS: "nrPois"
};

// holds google map
var map;
// implementation of AR-Experience (aka "World")
var World = {

	//  user's latest known location, accessible via userLocation.latitude, userLocation.longitude, userLocation.altitude
	userLocation: null,

	// you may request new data from server periodically, however: in this sample data is only requested once
	isRequestingData: false,

	// true once data was fetched
	initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_idle_green: null,
	markerDrawable_idle_orange: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	locationUpdateCounter: 0,
	updatePlacemarkDistancesEveryXLocationUpdates: 10,

	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

		// destroys all existing AR-Objects (markers & radar)
		AR.context.destroyAll();

		// show radar & set click-listener
		PoiRadar.show();

		$('#radarContainer').unbind('click');
		$("#radarContainer").click(PoiRadar.clickedRadar);

		// empty list of visible markers
		World.markerList = [];

		// start loading marker assets
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle1.png");
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		World.markerDrawable_idle_green = new AR.ImageResource("assets/marker_idle_green.png");
		World.markerDrawable_idle_orange = new AR.ImageResource("assets/marker_idle_orange.png");
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"power": parseFloat(poiData[currentPlaceNr].power),
				"gain": parseFloat(poiData[currentPlaceNr].gain),
				"azimuth": parseFloat(poiData[currentPlaceNr].azimuth),
				"elevation":  parseFloat(poiData[currentPlaceNr].altitude),
				"frequency": parseFloat(poiData[currentPlaceNr].frequency),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description
			};

			World.markerList.push(new Marker(singlePoi));
		}

		// updates distance information of all placemarks
		World.updateDistanceToUserValues();

		World.updateStatusMessage(currentPlaceNr + ' Antennas Loaded');

        World.markerList.forEach(marker => filterMarkers(marker));

        // categorize marks by expected power
        categorizeMarkers();
		// set distance slider to 100%
		$("#panel-distance-range").val(100);
		$("#panel-distance-range").slider("refresh");
	},

	// sets/updates distances of all makers so they are available way faster than calling (time-consuming) distanceToUser() method all the time
	updateDistanceToUserValues: function updateDistanceToUserValuesFn() {
		for (var i = 0; i < World.markerList.length; i++) {
			World.markerList[i].distanceToUser = World.markerList[i].markerObject.locations[0].distanceToUser();
		}
	},

	// updates status message shon in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

	/*
		It may make sense to display POI details in your native style.
		In this sample a very simple native screen opens when user presses the 'More' button in HTML.
		This demoes the interaction between JavaScript and native code.
	*/
	// user clicked "More" button in POI-detail panel -> fire event to open native screen
	onPoiDetailMoreButtonClicked: function onPoiDetailMoreButtonClickedFn() {
	   // console.log("MORE BUTTON CLICKED");
		var currentMarker = World.currentMarker;
		var architectSdkUrl = "architectsdk://markerselected?id=" + encodeURIComponent(currentMarker.poiData.id) + "&title=" + encodeURIComponent(currentMarker.poiData.title) + "&description=" + encodeURIComponent(currentMarker.poiData.description);
		/*
			The urlListener of the native project intercepts this call and parses the arguments.
			This is the only way to pass information from JavaSCript to your native code.
			Ensure to properly encode and decode arguments.
			Note: you must use 'document.location = "architectsdk://...' to pass information from JavaScript to native.
			! This will cause an HTTP error if you didn't register a urlListener in native architectView !
		*/
		document.location = architectSdkUrl;
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {

		// store user's current location in World.userLocation, so you always know where user is
		World.userLocation = {
			'latitude': lat,
			'longitude': lon,
			'altitude': alt,
			'accuracy': acc
		};


		// request data if not already present
		if (!World.initiallyLoadedData) {
			World.requestDataFromServer(lat, lon, alt);
			World.initiallyLoadedData = true;
		} else if (World.locationUpdateCounter === 0) {
			// update placemark distance information frequently, you max also update distances only every 10m with some more effort
			World.updateDistanceToUserValues();
		}

		// helper used to update placemark information every now and then (e.g. every 10 location upadtes fired)
		World.locationUpdateCounter = (++World.locationUpdateCounter % World.updatePlacemarkDistancesEveryXLocationUpdates);
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {
	World.currentMarker = marker;


        //TODO: Need to make units smarter...
		// update panel values
		$("#poi-detail-title").html(marker.poiData.title);
		$("#poi-detail-description").html(marker.poiData.description);
		$("#poi-detail-gain").html(marker.poiData.gain + " dBi");
		$("#poi-detail-frequency").html(marker.poiData.frequency + " MHz");
		$("#poi-detail-elevation").html((marker.poiData.elevation) + " m");
		$("#poi-detail-azimuth").html(marker.poiData.azimuth + "°");

		//console.log("Marker: " + marker.getBoundingRectangle());


		/* It's ok for AR.Location subclass objects to return a distance of `undefined`. In case such a distance was calculated when all distances were queried in `updateDistanceToUserValues`, we recalcualte this specific distance before we update the UI. */
		if( undefined == marker.distanceToUser ) {
			marker.distanceToUser = marker.markerObject.locations[0].distanceToUser();
		}
		var distanceToUserValue = (marker.distanceToUser > 999) ? ((marker.distanceToUser / 1000).toFixed(2) + " km") : (Math.round(marker.distanceToUser) + " m");
		$("#poi-detail-distance").html(distanceToUserValue);

		console.log("Distance to User: " + marker.distanceToUser);


		var signal = new Signal(marker.poiData, marker.distanceToUser);
//		signal = signal.toFixed(3);
//		console.log("Signal: " + signal['signal']);
		//TODO: Need to make units smarter...
		if (typeof (signal['snr']) == "number"){
		    $("#poi-detail-strength").html((signal['snr'].toFixed(3)) + " dB");
		}
		else {
		    $("#poi-detail-strength").html("Unavailable");
		}
		if (typeof (signal['angle']) == "number"){
		    $("#poi-detail-angle").html((signal['angle'].toFixed(3)) + "°");
		    }
		else{
            $("#poi-detail-angle").html("Unavailable");
		}


		// show panel
		$("#panel-poidetail").panel("open", 123);

		$(".ui-panel-dismiss").unbind("mousedown");

		$("#panel-poidetail").on("panelbeforeclose", function(event, ui) {
			World.currentMarker.setDeselected(World.currentMarker);
		});
		 hideMarkers(marker);
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: async function onScreenClickFn() {
    // TODO: TRY CATCH
	    await World.reloadPlaces();
	    //categorizeMarkers();
		// you may handle clicks on empty AR space too
	},

	// returns distance in meters of placemark with maxdistance * 1.1
	getMaxDistance: function getMaxDistanceFn() {

		// sort palces by distance so the first entry is the one with the maximum distance
		World.markerList.sort(World.sortByDistanceSortingDescending);

		// use distanceToUser to get max-distance
		var maxDistanceMeters = World.markerList[0].distanceToUser;

		// return maximum distance times some factor >1.0 so ther is some room left and small movements of user don't cause places far away to disappear
		return maxDistanceMeters * 1.1;
	},

	// udpates values show in "range panel"
	updateRangeValues: function updateRangeValuesFn() {

		// get current slider value (0..100);
		var slider_value = $("#panel-distance-range").val();

		// max range relative to the maximum distance of all visible places
		var maxRangeMeters = Math.round(World.getMaxDistance() * (slider_value / 100));

		// range in meters including metric m/km
		var maxRangeValue = (maxRangeMeters > 999) ? ((maxRangeMeters / 1000).toFixed(2) + " km") : (Math.round(maxRangeMeters) + " m");

		// number of places within max-range
		var placesInRange = World.getNumberOfVisiblePlacesInRange(maxRangeMeters);

		// update UI labels accordingly
		$("#panel-distance-value").html(maxRangeValue);
		$("#panel-distance-places").html((placesInRange != 1) ? (placesInRange + " Antennas") : (placesInRange + " Place"));

		// update culling distance, so only palces within given range are rendered
		AR.context.scene.cullingDistance = Math.max(maxRangeMeters, 1);

		// update radar's maxDistance so radius of radar is updated too
		PoiRadar.setMaxDistance(Math.max(maxRangeMeters, 1));
	},

	// returns number of places with same or lower distance than given range
	getNumberOfVisiblePlacesInRange: function getNumberOfVisiblePlacesInRangeFn(maxRangeMeters) {

		// sort markers by distance
		World.markerList.sort(World.sortByDistanceSorting);

		// loop through list and stop once a placemark is out of range ( -> very basic implementation )
		for (var i = 0; i < World.markerList.length; i++) {
			if (World.markerList[i].distanceToUser > maxRangeMeters) {
				return i;
			}
		};

		// in case no placemark is out of range -> all are visible
		return World.markerList.length;
	},

	handlePanelMovements: function handlePanelMovementsFn() {

		$("#panel-distance").on("panelclose", function(event, ui) {
			$("#radarContainer").addClass("radarContainer_left");
			$("#radarContainer").removeClass("radarContainer_right");
			PoiRadar.updatePosition();
		});

		$("#panel-distance").on("panelopen", function(event, ui) {
			$("#radarContainer").removeClass("radarContainer_left");
			$("#radarContainer").addClass("radarContainer_right");
			PoiRadar.updatePosition();
		});
	},

	// display range slider
	showRange: function showRangeFn() {
		if (World.markerList.length > 0) {

			// update labels on every range movement
			$('#panel-distance-range').change(function() {
				World.updateRangeValues();
			});

			World.updateRangeValues();
			World.handlePanelMovements();

			// open panel
			$("#panel-distance").trigger("updatelayout");
            $("#panel-distance").panel("open", 1234);

		} else {

			// no places are visible, because the are not loaded yet
			World.updateStatusMessage('Loading antennas', true);
		}
	},

    showMenu: function showMenuFn() {
    		if (World.markerList.length > 0) {

    			// update labels on every range movement
    			$('#panel-distance-range').change(function() {
    				World.updateRangeValues();
    			});

    			World.updateRangeValues();
    			World.handlePanelMovements();

    			// open panel
    			$("#panel-menu").trigger("updatelayout");
                $("#panel-menu").panel("open", 1234);
    		} else {

    			// no places are visible, because the are not loaded yet
    			World.updateStatusMessage('Loading antennas', true);
    		}
    	},
	// reload places from content source
	reloadPlaces: function reloadPlacesFn() {
		if (!World.isRequestingData) {
			if (World.userLocation) {
				World.requestDataFromServer(World.userLocation.latitude, World.userLocation.longitude);
			} else {
				World.updateStatusMessage('Unknown location.', true);
			}
		} else {
			World.updateStatusMessage('Loading in progress', true);
		}
	},

	// request POI data
	requestDataFromServer: function requestDataFromServerFn(lat, lon) {

		// set helper var to avoid requesting places while loading
		World.isRequestingData = true;
		World.updateStatusMessage('Loading Places...');

		// server-url to JSON content provider
		var serverUrl = ServerInformation.POIDATA_SERVER + "?" + ServerInformation.POIDATA_SERVER_ARG_LAT + "=" + lat + "&" + ServerInformation.POIDATA_SERVER_ARG_LON + "=" + lon + "&" + ServerInformation.POIDATA_SERVER_ARG_NR_POIS + "=20";
		var jqxhr = $.getJSON(serverUrl, function(data) {
				World.loadPoisFromJsonData(data);
			})
			.error(function(err) {
				World.updateStatusMessage("<center>Cannot connect to <br> server</center>", true);
				World.isRequestingData = false;
			})
			.complete(function() {
				World.isRequestingData = false;
			});
	},

	// helper to sort places by distance
	sortByDistanceSorting: function(a, b) {
		return a.distanceToUser - b.distanceToUser;
	},

	// helper to sort places by distance, descending
	sortByDistanceSortingDescending: function(a, b) {
		return b.distanceToUser - a.distanceToUser;
	}

};

// TODO: Change...
// Remove other markers from screen when one is selected
function hideMarkers(Marker) {
  for (var i=0; i<World.markerList.length; i++){
            if (World.markerList[i].poiData.id != Marker.poiData.id){
                World.markerList[i].setIdleDeselected(World.markerList[i]);
            }
      }

}


// Check if two markers belong to the same mast, if so, filter them using their azimuth and users location
function filterMarkers(Marker) {
  var userData = World.userLocation;
  for (var i=0; i<World.markerList.length; i++){

                if (World.markerList[i].poiData.longitude == Marker.poiData.longitude &&
                    World.markerList[i].poiData.latitude == Marker.poiData.latitude &&
                    World.markerList[i].poiData.id != Marker.poiData.id){

                         var oldMarkerCoord = findCoord(Marker.poiData, Marker.distanceToUser);
                         var newMarkerCoord = findCoord(World.markerList[i].poiData, World.markerList[i].distanceToUser);

                         if (calcDist(oldMarkerCoord.latitude, oldMarkerCoord.longitude, userData) >=
                             calcDist(newMarkerCoord.latitude, newMarkerCoord.longitude, userData)){
                                console.log("Going to remove marker: " + World.markerList[i].poiData.id);
                                World.markerList[i].setIdleDeselected(World.markerList[i])
                                World.markerList[i].setIdleDeselected(World.markerList[i])
                             }
                         else{
                            Marker.setIdleDeselected(Marker);
                         }

                    }

                }

}
function categorizeMarkers(){
    for (var i=0; i<World.markerList.length; i++){
  	    var signal = new Signal(World.markerList[i].poiData, World.markerList[i].distanceToUser);
        var signalStrength  = parseFloat(signal['snr']);
        console.log("Marker: " + World.markerList[i].poiData.title + "; Strength " + signal['snr']);
       // World.markerList[i].setIdleGreen(World.markerList[i]);
        if (signalStrength >= 20){
            World.markerList[i].setIdleGreen(World.markerList[i]);
        }
        if (signalStrength >= 10 && signalStrength < 20){
            World.markerList[i].setIdleOrange(World.markerList[i]);
        }
        filterMarkers(World.markerList[i]);
    }
}


function initMap() {
      console.log("INSIDE INIT MAP FUNCTION");
        var userData = World.userLocation;
        var userLoc = {lat: userData.latitude, lng: userData.longitude};
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: userLoc,
          mapTypeId: 'terrain'
        });
        map.setTilt(100);

      }

function initMapMarkers(){

       for (var i = 0; i < World.markerList.length; i++) {
                        console.log("ID:" + World.markerList[i].poiData.id);
                        var markerData = World.markerList[i].poiData;
                        var markerLoc = {lat: markerData.latitude, lng: markerData.longitude};
                        var markerName = markerData.name;
                        console.log("MARKERNAME: " +  markerData.title);
                        var marker = new google.maps.Marker({
                          position: markerLoc,
                          label: markerData.title,
                          map: map

                        });
                        marker.setMap(map);
                      }
}



/* forward locationChanges to custom function */
AR.context.onLocationChanged = World.locationChanged;

/* forward clicks in empty area to World */
AR.context.onScreenClick = World.onScreenClick;