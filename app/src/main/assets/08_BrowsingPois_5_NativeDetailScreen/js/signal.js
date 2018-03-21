// Function to calculate free space path loss
function Signal(poiData, distance) {

    this.poiData = poiData;
     var distance = distance;

    // Transmitter Frequency, power and gain all grabbed from input json
    var frequency = poiData.frequency * 1000; // MHz
    var tPower = poiData.power; // dBm
    var tGain = poiData.gain; // dBi
    var lightSpeed = 299792458; // m/s
    var wavelength = lightSpeed/(frequency*1000000); // m
    console.log("wavelength: " + wavelength);

    // Free space path loss
    var fspl = 20*Math.log10((wavelength/(4*Math.PI*distance))); //dB
    console.log("FSPL: " + fspl);

    // Effective isotropic radiated power
    var eirp = tPower + tGain; //dBm
    console.log("EIRP: " + eirp);

    // Power at Receiver
    var powerAtRec = eirp + fspl; //dB

    var rxRecGain = 19; // need to gather from user
    var rxConLoss = -1;
    var rxCableLoss = 0;
    var rxPowerFSPL = powerAtRec + rxRecGain + rxConLoss + rxCableLoss;
    console.log("RXPowerFSPL: " + rxPowerFSPL);
    // Noise at RX receiver
    var boltzConst = 1.38e-23; // J/K
    var rxNoiseFig = 7; // dB ... NEED TO CHANGE... Read from server
    var opTemp = 290; // K
    var antennaTemp = 300; // K
    var recBandwidth = 20; // MHz
    var effectNoiseTemp = opTemp*(10^(rxNoiseFig/10)-1); //K
    var rxNoisePower = 10*Math.log10(boltzConst*(antennaTemp+effectNoiseTemp)*(recBandwidth*1000000))+30;
    console.log("rxNoisePower" + rxNoisePower);
    var SNR = rxPowerFSPL - rxNoisePower;


    var properties = {
    "rpower": powerAtRec,
    "snr": SNR
    };


   return properties;
 }

 function getSigData(){
 var Rpower=document.getElementById('Rpower').value;
 var Rfrequency=document.getElementById('Rfrequency').value;
console.log("Got from Form: " + Rpower + Rfrequency);
 }