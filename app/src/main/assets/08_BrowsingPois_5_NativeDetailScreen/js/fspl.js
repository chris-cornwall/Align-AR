// Function to calculate free space path loss
function FSPL(poiData, distance) {

    this.poiData = poiData;
     var distance = distance;

    // Transmitter Frequency, power and gain all grabbed from input json
    var frequency = poiData.frequency;
    var tPower = poiData.power;
    var tGain = poiData.gain;
    var lightSpeed = 299792458;
    var wavelength = lightSpeed/(frequency*1000000);

    // Free space path loss
    var fspl = 20*Math.log10((wavelength/(4*Math.PI*distance)));
    console.log("Marker FSPL: " + poiData.title + ":" + fspl);
    console.log("PI: " + Math.PI);
    console.log("distancde: " + distance);
    console.log("wavelength: " + wavelength);
    console.log("log10: " + Math.log10(100));



    // Effective isotropic radiated power
    var eirp = tPower + tGain;

    // Receiver power
    var rPower = eirp + fspl;
$("#poi-detail-strength").html(rPower);
    console.log("RPOWER: " + rPower);


    var properties = {
    "fspl": rPower
    };


   return properties;
 }