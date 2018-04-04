var rxRecGain = 0;
var rxCableLoss= 0;
var rxConLoss = 0;

// Function to calculate estimated Signal to noise ratio
function Signal(poiData, distance) {

    var
        poiData = poiData; //TODO: Change?
        distance = distance;
       // test = findCoord(poiData, distance);
        angle = getAngle(poiData, distance);

    // Transmitter Frequency, power and gain all grabbed from input json
        frequency = poiData.frequency * 1000; // MHz
        tPower = poiData.power; // dBm
        tGain = poiData.gain; // dBi
        lightSpeed = 299792458; // m/s
        wavelength = lightSpeed/(frequency*1000000); // m
   // console.log("wavelength: " + wavelength);

    // Free space path loss
        fspl = 20*Math.log10((wavelength/(4*Math.PI*distance))); //dB

    // Effective isotropic radiated power
        eirp = tPower + tGain; //dBm

    // Power at Receiver
        powerAtRec = eirp + fspl; //dB

    console.log("RECGAIN BEFORE CALC: " + rxRecGain);

        rxPowerFSPL = powerAtRec + rxRecGain + rxConLoss + rxCableLoss;
    console.log("RXPowerFSPL: " + rxPowerFSPL);
     console.log("RECGAIN AFTER CALC: " + rxRecGain);
    // Noise at RX receiver
        boltzConst = 1.38e-23; // J/K
        rxNoiseFig = 7; // dB ... NEED TO CHANGE... Read from server
        opTemp = 290; // K
        antennaTemp = 300; // K
        recBandwidth = 20; // MHz
        effectNoiseTemp = opTemp*(10^(rxNoiseFig/10)-1); //K
        rxNoisePower = 10*Math.log10(boltzConst*(antennaTemp+effectNoiseTemp)*(recBandwidth*1000000))+30;
        SNR = rxPowerFSPL - rxNoisePower;
    console.log("SNR:" + SNR);


    properties = {
    "rpower": powerAtRec,
    "snr": SNR,
    "angle": angle
    };

   return properties;
 }

 function setRecData(){

    // Read receiver specs from user input
    if(document.forms["sigForm"]["rGain"].value != null){
        rxRecGain = parseInt(document.forms["sigForm"]["rGain"].value);
        console.log("Changing rGain to: " + rxRecGain);
      }

    if(document.forms["sigForm"]["rConLoss"].value != null){
        rxConLoss = parseInt(document.forms["sigForm"]["rConLoss"].value);
        console.log("Changing rConLoss to: " + rxRecGain);
       }

    if(document.forms["sigForm"]["rCableLoss"].value != null){
        rxRecGain = parseInt(document.forms["sigForm"]["rCableLoss"].value);
        console.log("Changing rCableLoss to: " + rxRecGain);
       }

 }

 // Calculate recommended angle using simple trigonometry
function getAngle(poiData, distance){
    //TODO: Validate..
    var antennaElevation = poiData.elevation;
    console.log("Antenna Elevation: " + antennaElevation);
    var userElevation = World.userLocation.altitude;
    console.log("User Elevation: " + userElevation);

    // In the unlikely event that the user is higher than the antenna, the markers will display this
    // Handle both antenna higher than user and vice versa

    if (antennaElevation >= userElevation){
        var A = antennaElevation - userElevation;
    }

    else{
        var A = userElevation - antennaElevation;
    }

    var B = distance;
//    console.log("Distance (b): " + B);

    var angle = Math.asin(A/B).toDeg();
//    console.log("Suggested angle before toDeg: " + Math.asin(A/B));
//    console.log("Suggested angle: " + angle);
    return angle;
 }

function calcDist(tLat, tLong, userData){
    var
        x1 = tLat;
        y1 = tLong;
        x2 = userData.latitude;
        y2 = userData.longitude;

        distance = Math.sqrt((x2-x1)^2 + (y2-y1)^2);

//    console.log("Distance between points = " + distance);
    return distance;

}

// Find hypothetical "center point" of signal based on azimuth and users distance
function findCoord(poiData, distance){

    var
        radius = 6371e3, // radius of the earth in meters
        angDist = Number(distance) / radius, // angular distance in radians
        azimuth = Number(poiData.azimuth).toRad();
        latitude = poiData.latitude.toRad(),
        longitude = poiData.longitude.toRad();

    var newLatitude = Math.asin(Math.sin(latitude)*Math.cos(angDist) + Math.cos(latitude)*Math.sin(angDist)*Math.cos(azimuth));

    var newLongitude = longitude + Math.atan2(Math.sin(azimuth)*Math.sin(angDist)*Math.cos(latitude), Math.cos(angDist)-Math.sin(latitude)*Math.sin(newLatitude));

    newLongitude = (newLongitude+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180°

//    console.log("Long: " + newLongitude.toDeg() + " Lat: " + newLatitude.toDeg());

    var coords = {
        "latitude": newLatitude.toDeg(),
        "longitude": newLongitude.toDeg()
        };

    return coords;
}

Number.prototype.toDeg = function() { return this * 180 / Math.PI; }
Number.prototype.toRad = function() { return this * Math.PI / 180; }