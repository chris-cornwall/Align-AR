package com.antenna_alignment.nuig;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.support.annotation.RequiresApi;
import android.support.v4.app.ActivityCompat;
import android.support.v4.view.GestureDetectorCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.GestureDetector;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.widget.Toast;

import com.antenna_alignment.nuig.R;
import com.google.android.gms.location.*;
import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;

import static android.location.Criteria.ACCURACY_FINE;
import static android.os.Looper.*;
import static com.google.android.gms.location.LocationServices.getFusedLocationProviderClient;
import static java.lang.String.*;

public class MainActivity extends AppCompatActivity implements LocationListener, GestureDetector.OnGestureListener {

    private ArchitectView architectView;

    private LocationManager lm;

    private double latitude, longitude, altitude, lastAltitude;
    private float accuracy;

    private LocationRequest mLocationRequest;

    private long UPDATE_INTERVAL = 50000;  /* 10 secs */
    private long FASTEST_INTERVAL = 2000; /* 2 sec */
    private GestureDetectorCompat detector;

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        //initToolbar();
        startLocationUpdates();

        this.architectView = (ArchitectView) this.findViewById(R.id.architectView);
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        config.setLicenseKey("qUIw0+pdPPdRCkiRQHP8D4MLzWLGKoRFvCJE35SWZCgFMBemyBPa37BR4+49RNEyvuLRbSfeKlnK3YrP7j7sn9MWJ05q7EkbEYN3qP/U4xfMEBVdJBISInyGIxT8Ae0UxP5+9DvFrcr72LQaIBdtKLiyGltzN10jpPwUAxnpBgRTYWx0ZWRfX4xyO6M1s963493Goe0b5Em0CAO7NaezKXkMHzHXtK5KWowpUMSOhZf7RB2EadnZ8cdxNfqZLoWBdTFkCGbezyd26YT8FPJ7a6ZWSVy/COYWQVvkArogVOEuRvAJEe6Svpwk9XMMMgeeYZUnLl1ykedCTkCEP8KkiuLla/8r+Y6KWU8EB/WL09DGaK863qnjtBjvtBMvRfnan1KP1Rea92icdrbtU6YoOJmtp3nc2Nc3kr4hSkIhReC3+KxXL+0FEku2y5O9YMYjF/UOnmR+e6hl1oxwwIpUHjjUm+hjUEegvOdmFRjxk09RdJhYkWeE8tMkE1pGFL+ZEVxbiFTU2+QI2zAUcp+exHFRa+L3anjpI0SPFfkfzX+w4hAJNGTiAQtdO6SreHhGUJaILdBNEuJCmVgT7MbT+2JuE44IsXXKR98dYUZLJYFxFwNXRszbrs5ay0i55CYIpAedYsy1rV3mKTTb3HPq8HvCz+P2Qs8G3YZUqduHfrtW2jKrKcUyLcqgT1Hi7gjiWkRu9yBdXQmKKYMJutOPxw==");
        this.architectView.onCreate(config);
        detector = new GestureDetectorCompat(this.architectView.getContext(), this);



    }

    private boolean onTouchEvent() {
        System.out.println("OnTouchEvent fired");
        return true;
    }


    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        architectView.onPostCreate();

        try {
            this.architectView.load("file:///android_asset/AlignAR_NativeDetailScreen/index.html");
            architectView.setLocation(latitude, longitude, altitude, accuracy);
        } catch (Exception e) {
            System.out.println("Unable to load Wikitude");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        lm = (LocationManager) this.getSystemService(LOCATION_SERVICE);
        if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER))
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
        lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 2000, 0, this);
        lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 4000, 0, this);


        architectView.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        architectView.onDestroy();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        lm.removeUpdates(this);

        architectView.onPause();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                               Location Functions                                                      //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    protected void startLocationUpdates() {

        // Create the location request to start receiving updates
        mLocationRequest = new LocationRequest();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(UPDATE_INTERVAL);
        mLocationRequest.setFastestInterval(FASTEST_INTERVAL);

        // Create LocationSettingsRequest object using location request
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
        builder.addLocationRequest(mLocationRequest);
        LocationSettingsRequest locationSettingsRequest = builder.build();

        // Check whether location settings are satisfied
        // https://developers.google.com/android/reference/com/google/android/gms/location/SettingsClient
        SettingsClient settingsClient = LocationServices.getSettingsClient(this);
        settingsClient.checkLocationSettings(locationSettingsRequest);

        // new Google API SDK v11 uses getFusedLocationProviderClient(this)
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        getFusedLocationProviderClient(this).requestLocationUpdates(mLocationRequest, new LocationCallback() {
                    @Override
                    public void onLocationResult(LocationResult locationResult) {
                        // do work here
                        System.out.println("INSIDE NEW LOCATION FUNCTION");
                        onLocationChanged(locationResult.getLastLocation());
                    }
                },
                myLooper());
    }

    @Override
    public void onLocationChanged(Location location) {
        latitude = location.getLatitude();
        longitude = location.getLongitude();
        altitude = location.getAltitude();
        accuracy = location.getAccuracy();

        //Altitude sometimes reads as zero, here's a fix for when that happens
        if (altitude!=0)
            lastAltitude = altitude;
        else
            altitude = lastAltitude;



        architectView.setLocation(latitude, longitude, altitude, accuracy);
        System.out.println("ARCH VIEW ALT: " + altitude);
        System.out.println("ARCH VIEW LAT: " + latitude);
        System.out.println("ARCH VIEW LONG: " + longitude);
        System.out.println("ARCH VIEW ACC: " + accuracy);

    }

    //Gives state of location function
    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        String newStatus = "";
        switch (status) {
            case LocationProvider.OUT_OF_SERVICE:
                newStatus = "Out of Service";
                break;
            case LocationProvider.TEMPORARILY_UNAVAILABLE:
                newStatus = "Temporarily Unavailable";
                break;
            case LocationProvider.AVAILABLE:
                newStatus = "Available";
                break;
        }
        String msg = format((getResources().getString(R.string.provider_new_status)), provider, newStatus);
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();

    }

    @Override
    public void onProviderEnabled(String provider) {
        // String msg = format(getResources().getString(R.string.provider_enabled), provider);
        // Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
        architectView.setLocation(latitude, longitude, altitude, accuracy);
    }

    @Override
    public void onProviderDisabled(String provider) {
         //String msg = format(getResources().getString(R.string.provider_disabled), provider);
         //Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }

    @Override
    public boolean onDown(MotionEvent motionEvent) {
        return false;
    }

    @Override
    public void onShowPress(MotionEvent motionEvent) {

    }

    @Override
    public boolean onSingleTapUp(MotionEvent motionEvent) {
        return false;
    }

    @Override
    public boolean onScroll(MotionEvent motionEvent, MotionEvent motionEvent1, float v, float v1) {
        return false;
    }

    @Override
    public void onLongPress(MotionEvent motionEvent) {

    }

    @Override
    public boolean onFling(MotionEvent motionEvent, MotionEvent motionEvent1, float v, float v1) {
        Intent receiverInputIntent = new Intent(this.architectView.getContext(), ReceiverActivity.class);
        startActivity(receiverInputIntent);
        return true;
    }

    @Override
    public boolean onTouchEvent (MotionEvent event) {
        detector.onTouchEvent(event);
        return super.onTouchEvent(event);
    }




}
