var added = false;	// Flag to hold whether markers have been added
		var poiOne;		// Reference to the first poin of interest
		var poiTwo;		// Reference to the second point of interest

		// Called when location changes
		function locationChanged(lat, lon, alt, acc){


			// First time the function runs wer add the markers
			if (!added){

				// ------ First Marker ----------

				// create the image for the marker
				var marker_image = new AR.ImageResource("assets/marker_idle.png");

				// create the marker location
				var marker_loc = new AR.GeoLocation(lat+0.05, lon, alt);

				// create the drawable (set display parameters of the image - just size here)
				var marker_drawable = new AR.ImageDrawable(marker_image, 5);

				// create GeoObject (also adds to the display)
				poiOne = new AR.GeoObject(marker_loc, {
					drawables: {
						cam: [marker_drawable]
					}
				});

                AR.logger.debug("Debug Mode Activated");
                AR.logger.debug("Added Marker - Hup ya boyo ya");
				// ------ Second Marker ----------

				// create the image for the marker
				var marker_image2 = new AR.ImageResource("assets/marker_idle.png");

				// create the marker location
				var marker_loc2 = new AR.GeoLocation(lat+0.002699, lon+0.002294, alt);

				// create the drawable (set display parameters of the image - just size here)
				var marker_drawable2 = new AR.ImageDrawable(marker_image2, 5);

				// create GeoObject (also adds to the display)
				poiTwo = new AR.GeoObject(marker_loc2, {
					drawables: {
						cam: [marker_drawable2]
					}
				});

				added = true;	// Store that markers were added

				AR.logger.debug("markers added");
			}
			else {
				// Each other time position is changed we update
				//  location is stored in an array (not sure why)

				poiOne.locations[0].latitude = lat+0.00;
				poiOne.locations[0].longitude = lon+0.001905;
				poiOne.locations[0].altitude = alt;

				poiTwo.locations[0].latitude = lat+0.002699;
				poiTwo.locations[0].longitude = lon+0.002294;
				poiTwo.locations[0].altitude = alt;

				AR.logger.debug("markers updated");
			}
		}


		AR.logger.debug("starting");

		// Set which function is called when the location changes
		AR.context.onLocationChanged = locationChanged;