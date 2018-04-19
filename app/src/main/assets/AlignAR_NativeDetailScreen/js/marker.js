var kMarker_AnimationDuration_ChangeDrawable = 500;
var kMarker_AnimationDuration_Resize = 1000;

function Marker(poiData) {

    this.poiData = poiData;
    this.isSelected = false;
    /*
        With AR.PropertyAnimations you are able to animate almost any property of ARchitect objects. This sample will animate the opacity of both background drawables so that one will fade out while the other one fades in. The scaling is animated too. The marker size changes over time so the labels need to be animated too in order to keep them relative to the background drawable. AR.AnimationGroups are used to synchronize all animations in parallel or sequentially.
    */

    this.animationGroup_idle = null;
    this.animationGroup_idle_deselected = null;
    this.animationGroup_selected = null;
    this.animationGroup_orange = null;
    this.animationGroup_green = null;


    // create the AR.GeoLocation from the poi data
    var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);
    var altitude = markerLocation.altitude;
/*

More properties defined here

*/

    //console.log("Altitude: " + altitude);
  // var markerLocation = new AR.GeoLocation(53.280290, -9.058741, 0);

    // create an AR.ImageDrawable for the marker in each state
    this.markerDrawable_idle = new AR.ImageDrawable(World.markerDrawable_idle, 2.5, {
        zOrder: 0,
        opacity: 1.0,
        onClick: Marker.prototype.getOnClickTrigger(this)
    });

    this.markerDrawable_idle_green = new AR.ImageDrawable(World.markerDrawable_idle_green, 2.5, {
            zOrder: 0,
            opacity: 0.0,
            onClick: Marker.prototype.getOnClickTrigger(this)
        });

    this.markerDrawable_idle_orange = new AR.ImageDrawable(World.markerDrawable_idle_orange, 2.5, {
             zOrder: 0,
             opacity: 0.0,
             onClick: Marker.prototype.getOnClickTrigger(this)
        });



    // create an AR.ImageDrawable for the marker in selected state
    this.markerDrawable_selected = new AR.ImageDrawable(World.markerDrawable_selected, 1.5, {
        zOrder: 0,
        opacity: 0.0,
        onClick: null
    });

    // create an AR.Label for the marker's title 
    this.titleLabel = new AR.Label(poiData.title.trunc(12), 1, {
        zOrder: 1,
        translate: {
            y: 0.55
        },
        style: {
            textColor: '#FFFFFF',
            fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
    });

    /*
        Create an AR.ImageDrawable using the AR.ImageResource for the direction indicator which was created in the World. Set options regarding the offset and anchor of the image so that it will be displayed correctly on the edge of the screen.
    */
    this.directionIndicatorDrawable = new AR.ImageDrawable(World.markerDrawable_directionIndicator, 0.1, {
        enabled: true,
        verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });

    /*
        The representation of an AR.GeoObject in the radar is defined in its drawables set (second argument of AR.GeoObject constructor). 
        Once drawables.radar is set the object is also shown on the radar e.g. as an AR.Circle
    */
    this.radarCircle = new AR.Circle(0.03, {
        horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
        opacity: 0.8,
        style: {
            fillColor: "#ffffff"
        }
    });

    /*
        Additionally create circles with a different color for the selected state.
    */
    this.radarCircleSelected = new AR.Circle(0.05, {
        horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
        opacity: 0.8,
        style: {
            fillColor: "#ee6363"
        }
    });

    this.radardrawables = [];
    this.radardrawables.push(this.radarCircle);

    this.radardrawablesSelected = [];
    this.radardrawablesSelected.push(this.radarCircleSelected);

    /*  
        Note that indicator and radar-drawables were added
    */
    this.markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
            cam: [this.markerDrawable_idle, this.markerDrawable_selected,  this.markerDrawable_idle_green, this.markerDrawable_idle_orange, this.titleLabel],
            indicator: this.directionIndicatorDrawable,
            radar: this.radardrawables
        }
    });

//this.descriptionLabel],
    return this;
}

Marker.prototype.getOnClickTrigger = function(marker) {


    /*
        The setSelected and setDeselected functions are prototype Marker functions. 
        Both functions perform the same steps but inverted.
    */

    return function() {

        if (!Marker.prototype.isAnyAnimationRunning(marker)) {
            if (marker.isSelected) {

                Marker.prototype.setDeselected(marker);

            } else {
                Marker.prototype.setSelected(marker);
                $.getScript('nativedetailscreen.js')
                {
                    hideMarkers(marker);
                };
                try {
                    World.onMarkerSelected(marker);
                } catch (err) {
                    alert(err);
                }

            }
        } else {
            AR.logger.debug('an animation is already running');
        }


        return true;
    };
};

/*
    Property Animations allow constant changes to a numeric value/property of an object, dependent on start-value, end-value and the duration of the animation. Animations can be seen as functions defining the progress of the change on the value. The Animation can be parametrized via easing curves.
*/
Marker.prototype.setSelected = function(marker) {
    console.log("SETSELECTED");
    marker.isSelected = true;

     marker.markerObject.drawables.radar = marker.radardrawables;

    if (marker.animationGroup_selected === null) {

        // create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the idle-state-drawable
        var hideIdleDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

        var hideGreenAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_green, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

        var hideOrangeAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_orange, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

                // create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the selected-state-drawable
        var showSelectedDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_selected, "opacity", null, 1.0, kMarker_AnimationDuration_ChangeDrawable);

        // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2
        var idleDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2
        var selectedDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the title label to 1.2
        var titleLabelResizeAnimationX = new AR.PropertyAnimation(marker.titleLabel, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));

        // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2
        var idleDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2
        var selectedDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the title label to 1.2
        var titleLabelResizeAnimationY = new AR.PropertyAnimation(marker.titleLabel, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the description label to 1.2
//        var descriptionLabelResizeAnimationY = new AR.PropertyAnimation(marker.descriptionLabel, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
//            amplitude: 2.0
//        }));

        /*
         There are two types of AR.AnimationGroups. Parallel animations are running at the same time, sequentials are played one after another. This example uses a parallel AR.AnimationGroup.
         */
        marker.animationGroup_selected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [hideIdleDrawableAnimation, hideGreenAnimation, hideOrangeAnimation, showSelectedDrawableAnimation, idleDrawableResizeAnimationX, selectedDrawableResizeAnimationX, titleLabelResizeAnimationX, idleDrawableResizeAnimationY, selectedDrawableResizeAnimationY, titleLabelResizeAnimationY]);    //descriptionLabelResizeAnimationX,  descriptionLabelResizeAnimationY]);
    }

    // removes function that is set on the onClick trigger of the idle-state marker
    marker.markerDrawable_idle.onClick = null;
    // sets the click trigger function for the selected state marker
    marker.markerDrawable_selected.onClick = Marker.prototype.getOnClickTrigger(marker);

    // enables the direction indicator drawable for the current marker
    marker.directionIndicatorDrawable.enabled = true;

    marker.markerObject.drawables.radar = marker.radardrawablesSelected;

    // starts the selected-state animation
    marker.animationGroup_selected.start();
};

Marker.prototype.setDeselected = function(marker) {
console.log("SET DESELECTED");
    marker.isSelected = false;

    marker.markerObject.drawables.radar = marker.radardrawables;

    if (marker.animationGroup_idle === null) {

        // create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the idle-state-drawable
        var showIdleDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle, "opacity", null, 1.0, kMarker_AnimationDuration_ChangeDrawable);
        // create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the selected-state-drawable
        var hideSelectedDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_selected, "opacity", null, 0, kMarker_AnimationDuration_ChangeDrawable);

        var hideGreenAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_green, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

        var hideOrangeAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_orange, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

        // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.0
        var idleDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.x', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.0
        var selectedDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.x', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the title label to 1.0
        var titleLabelResizeAnimationX = new AR.PropertyAnimation(marker.titleLabel, 'scale.x', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the description label to 1.0
//        var descriptionLabelResizeAnimationX = new AR.PropertyAnimation(marker.descriptionLabel, 'scale.x', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
//            amplitude: 2.0
//        }));
        // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.0
        var idleDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.y', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.0
        var selectedDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.y', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the title label to 1.0
        var titleLabelResizeAnimationY = new AR.PropertyAnimation(marker.titleLabel, 'scale.y', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        }));
        // create AR.PropertyAnimation that animates the scaling of the description label to 1.0
//        var descriptionLabelResizeAnimationY = new AR.PropertyAnimation(marker.descriptionLabel, 'scale.y', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
//            amplitude: 2.0
//        }));

        /*
         There are two types of AR.AnimationGroups. Parallel animations are running at the same time, sequentials are played one after another. This example uses a parallel AR.AnimationGroup.
         */
        marker.animationGroup_idle = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [showIdleDrawableAnimation, hideSelectedDrawableAnimation, hideGreenAnimation, hideOrangeAnimation, idleDrawableResizeAnimationX, selectedDrawableResizeAnimationX, titleLabelResizeAnimationX, idleDrawableResizeAnimationY, selectedDrawableResizeAnimationY, titleLabelResizeAnimationY,]); // descriptionLabelResizeAnimationX,  descriptionLabelResizeAnimationY
    }

    // sets the click trigger function for the idle state marker
    marker.markerDrawable_idle.onClick = Marker.prototype.getOnClickTrigger(marker);
    // removes function that is set on the onClick trigger of the selected-state marker
    marker.markerDrawable_selected.onClick = null;

    // disables the direction indicator drawable for the current marker
    marker.directionIndicatorDrawable.enabled = false;
    // starts the idle-state animation
    marker.animationGroup_idle.start();
};

Marker.prototype.setIdleDeselected = function(marker) {
         console.log("SETIDLEDESELECTED");
         marker.isSelected = false;

         marker.markerObject.drawables.radar = marker.radardrawables;

         if (marker.animationGroup_idle_deselected === null) {

             // create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the idle-state-drawable
             var hideIdleDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);
             // create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the selected-state-drawable
             var hideSelectedDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_selected, "opacity", null, 0, kMarker_AnimationDuration_ChangeDrawable);

             var hideGreenAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_green, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

             var hideOrangeAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_orange, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

             // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.0
             var idleDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.x', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                 amplitude: 2.0
             }));
             // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.0
             var selectedDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.x', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                 amplitude: 2.0
             }));
             // create AR.PropertyAnimation that animates the scaling of the title label to 1.0
             var titleLabelHideAnimation = new AR.PropertyAnimation(marker.titleLabel, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

             // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.0
             var idleDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.y', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                 amplitude: 2.0
             }));
             // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.0
             var selectedDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_idle, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                 amplitude: 2.0
             }));
             // create AR.PropertyAnimation that animates the scaling of the title label to 1.0
             var titleLabelResizeAnimationY = new AR.PropertyAnimation(marker.titleLabel, 'scale.y', null, 1.0, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                 amplitude: 2.0
             }));

             marker.animationGroup_idle_deselected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [hideIdleDrawableAnimation, hideSelectedDrawableAnimation,hideGreenAnimation, hideOrangeAnimation, idleDrawableResizeAnimationX, selectedDrawableResizeAnimationX, titleLabelHideAnimation, idleDrawableResizeAnimationY, selectedDrawableResizeAnimationY, titleLabelResizeAnimationY,]); // descriptionLabelResizeAnimationX,  descriptionLabelResizeAnimationY
         }
             // sets the click trigger function for the idle state marker
             marker.markerDrawable_idle.onClick = Marker.prototype.getOnClickTrigger(marker);
             // removes function that is set on the onClick trigger of the selected-state marker
             marker.markerDrawable_selected.onClick = null;

             // disables the direction indicator drawable for the current marker
             marker.directionIndicatorDrawable.enabled = false;
             // starts the idle-state animation
             marker.animationGroup_idle_deselected.start();
         };

Marker.prototype.setIdleGreen = function(marker) {

         marker.isSelected = false;

         marker.markerObject.drawables.radar = marker.radardrawables;

         if (marker.animationGroup_green === null) {
             var hideIdleDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

             var hideOrangeAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_orange, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

             // create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the idle-state-drawable
            var showGreenAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_green, "opacity", null, 1.0, kMarker_AnimationDuration_ChangeDrawable);
             // create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the selected-state-drawable
             var hideSelectedDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_selected, "opacity", null, 0, kMarker_AnimationDuration_ChangeDrawable);
             // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.0
    // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2
            var idleDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2
            var selectedDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));

            var showLabelAnimation = new AR.PropertyAnimation(marker.titleLabel, "opacity", null, 1.0, kMarker_AnimationDuration_ChangeDrawable);
            // create AR.PropertyAnimation that animates the scaling of the title label to 1.2
            var titleLabelResizeAnimationX = new AR.PropertyAnimation(marker.titleLabel, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            // create AR.PropertyAnimation that animates the scaling of the description label to 1.2
    //        var descriptionLabelResizeAnimationX = new AR.PropertyAnimation(marker.descriptionLabel, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
    //            amplitude: 2.0
    //        }));

            // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2
            var idleDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2
            var selectedDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            // create AR.PropertyAnimation that animates the scaling of the title label to 1.2
            var titleLabelResizeAnimationY = new AR.PropertyAnimation(marker.titleLabel, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));

             marker.animationGroup_green = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [hideIdleDrawableAnimation, hideOrangeAnimation, hideSelectedDrawableAnimation, showGreenAnimation, idleDrawableResizeAnimationX, selectedDrawableResizeAnimationX, titleLabelResizeAnimationX, idleDrawableResizeAnimationY, selectedDrawableResizeAnimationY, titleLabelResizeAnimationY, showLabelAnimation]);
         }

    // sets the click trigger function for the idle state marker
    marker.markerDrawable_idle_green.onClick = Marker.prototype.getOnClickTrigger(marker);
    // removes function that is set on the onClick trigger of the selected-state marker
    marker.markerDrawable_selected.onClick = null;

    // disables the direction indicator drawable for the current marker
    marker.directionIndicatorDrawable.enabled = true;
    // starts the idle-state animation
    marker.animationGroup_green.start();
};

Marker.prototype.setIdleOrange = function(marker) {
         console.log("SETIDLEORANGE");
         marker.isSelected = false;

         marker.markerObject.drawables.radar = marker.radardrawables;

         if (marker.animationGroup_orange === null) {

             // create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the orange animation
             var showOrangeAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_orange, "opacity", null, 1.0, kMarker_AnimationDuration_ChangeDrawable);
             // create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide unnecessary drawables
             var hideSelectedDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_selected, "opacity", null, 0, kMarker_AnimationDuration_ChangeDrawable);

             var hideIdleDrawableAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

             var hideGreenAnimation = new AR.PropertyAnimation(marker.markerDrawable_idle_green, "opacity", null, 0.0, kMarker_AnimationDuration_ChangeDrawable);

            // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2
            var idleDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2
            var selectedDrawableResizeAnimationX = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            var showLabelAnimation = new AR.PropertyAnimation(marker.titleLabel, "opacity", null, 1.0, kMarker_AnimationDuration_ChangeDrawable);
            // create AR.PropertyAnimation that animates the scaling of the title label to 1.2
            var titleLabelResizeAnimationX = new AR.PropertyAnimation(marker.titleLabel, 'scale.x', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));

            // create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2
            var idleDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_idle, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            // create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2
            var selectedDrawableResizeAnimationY = new AR.PropertyAnimation(marker.markerDrawable_selected, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));
            // create AR.PropertyAnimation that animates the scaling of the title label to 1.2
            var titleLabelResizeAnimationY = new AR.PropertyAnimation(marker.titleLabel, 'scale.y', null, 1.2, kMarker_AnimationDuration_Resize, new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
                amplitude: 2.0
            }));

             marker.animationGroup_orange = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [hideIdleDrawableAnimation, hideGreenAnimation, showOrangeAnimation, hideSelectedDrawableAnimation, idleDrawableResizeAnimationX, selectedDrawableResizeAnimationX, titleLabelResizeAnimationX, idleDrawableResizeAnimationY, selectedDrawableResizeAnimationY, titleLabelResizeAnimationY, showLabelAnimation]);
         }

    // sets the click trigger function for the idle state marker
    marker.markerDrawable_idle_orange.onClick = Marker.prototype.getOnClickTrigger(marker);
    // removes function that is set on the onClick trigger of the selected-state marker
    marker.markerDrawable_selected.onClick = null;

    // disables the direction indicator drawable for the current marker
    marker.directionIndicatorDrawable.enabled = true;
    // starts the idle-state animation
    marker.animationGroup_orange.start();
};

Marker.prototype.isAnyAnimationRunning = function(marker) {

    if (marker.animationGroup_idle === null || marker.animationGroup_selected === null || marker.animationGroup_orange === null || marker.animationGroup_green === null) {
        return false;
    } else {
        if ((marker.animationGroup_idle.isRunning() === true) || (marker.animationGroup_selected.isRunning() === true) || (marker.animationGroup_orange.isRunning() === true) || (marker.animationGroup_green.isRunning() === true)) {
            return true;
        } else {
            return false;
        }
    }
};

// will truncate all strings longer than given max-length "n". e.g. "foobar".trunc(3) -> "foo..."
String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...' : '');
};