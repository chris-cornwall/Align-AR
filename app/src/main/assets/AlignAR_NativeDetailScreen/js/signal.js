var rxRecGain = 0;

// Function to calculate estimated Signal to noise ratio
function Signal(poiData, distance) {
    // Retreive receiver data from local storage
    getRecData();
//    rec = JSON.parse(localStorage.getItem('recData'));
//    rxRecGain = rec.rxRecGain;
    console.log("RECGAIN FROM LOCAL STORAGE: " + rxRecGain);
    var rxCableLoss= 0;
    var rxConLoss = 0;
    this.poiData = poiData;
    var distance = distance;

    // Transmitter Frequency, power and gain all grabbed from input json
    var frequency = poiData.frequency * 1000; // MHz
    var tPower = poiData.power; // dBm
    var tGain = poiData.gain; // dBi
    var lightSpeed = 299792458; // m/s
    var wavelength = lightSpeed/(frequency*1000000); // m
   // console.log("wavelength: " + wavelength);

    // Free space path loss
    var fspl = 20*Math.log10((wavelength/(4*Math.PI*distance))); //dB
   // console.log("FSPL: " + fspl);

    // Effective isotropic radiated power
    var eirp = tPower + tGain; //dBm
  //  console.log("EIRP: " + eirp);

    // Power at Receiver
    var powerAtRec = eirp + fspl; //dB

//    var rxRecGain = 19; // need to gather from user
//    var rxConLoss = -1;
//    var rxCableLoss = 0;
    // console.log("RECGAIN BEFORE CALC: " + rxRecGain);
    delete rxRecGain;
    delete powerArRec;
    delete rxCableLoss;
    delete rxPowerFSPL;
    rxPowerFSPL = powerAtRec + rxRecGain + rxConLoss + rxCableLoss;
    console.log("RXPowerFSPL: " + rxPowerFSPL);
     console.log("RECGAIN AFTER CALC: " + rxRecGain);
    // Noise at RX receiver
    var boltzConst = 1.38e-23; // J/K
    var rxNoiseFig = 7; // dB ... NEED TO CHANGE... Read from server
    var opTemp = 290; // K
    var antennaTemp = 300; // K
    var recBandwidth = 20; // MHz
    var effectNoiseTemp = opTemp*(10^(rxNoiseFig/10)-1); //K
    var rxNoisePower = 10*Math.log10(boltzConst*(antennaTemp+effectNoiseTemp)*(recBandwidth*1000000))+30;
    SNR = rxPowerFSPL - rxNoisePower;
    console.log("SNR:" + SNR);


    properties = {
    "rpower": powerAtRec,
    "snr": SNR
    };

   return properties;
 }

 function getRecData(){
   // Read receiver specs from user input
   rxRecGain=document.forms["sigForm"]["rGain"].value;
   var conLoss=document.forms["sigForm"]["rConLoss"].value;
   var cableLoss=document.forms["sigForm"]["rCableLoss"].value;
    console.log("\nBEFORE: \nRecGain: " + rxRecGain );

   // Set defaults to 0
   if (rxRecGain == "") {rxRecGain = 0;}
   if (conLoss == "") {conLoss = 0;}
   if (cableLoss == "") {cableLoss = 0};

//console.log("\nRecGain: " + rxRecGain +"\n rxConLoss: " + rxConLoss + "\n rxCableLoss: " + rxCableLoss);
//   // Write to json file for future use
   var receiver = {
   "rxRecGain": rxRecGain,
   "rxConLoss": conLoss,
   "rxCableLoss": cableLoss
   };

   localStorage.setItem('recData', JSON.stringify(receiver));

   console.log("Got from Form: " + rxRecGain );
   return true;
 }