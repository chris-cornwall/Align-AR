package com.example.cornwall.wikitude;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {
    // LogCat tag
    private static final String TAG = MainActivity.class.getSimpleName();
    private final static int PLAY_SERVICES_RESOLUTION_REQUEST = 1000;
    private Location mLastLocation;
    // Google client to interact with Google API
    private GoogleApiClient mGoogleApiClient;
    // boolean flag to toggle periodic location updates
    private boolean mRequestingLocationUpdates = false;
    private LocationRequest mLocationRequest;
    // Location updates intervals in sec
    private static int UPDATE_INTERVAL = 5000; // 10 sec
    private static int FATEST_INTERVAL = 5000; // 5 sec
    private static int DISPLACEMENT = 10; // 10 meters

    // UI elements
    private TextView lblLocation;
    private Button btnShowLocation, btnStartLocationUpdates;
    private ArchitectView architectView;
    protected Location lastKnownLocation;
    Button btnGetLoc;
    double lat;
    double lon;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        lblLocation = (TextView) findViewById(R.id.lblLocation);
        btnShowLocation = (Button) findViewById(R.id.btnShowLocation);
        btnStartLocationUpdates = (Button) findViewById(R.id.btnLocationUpdates);

        this.architectView = (ArchitectView) this.findViewById(R.id.architectView);
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        config.setLicenseKey("qUIw0+pdPPdRCkiRQHP8D4MLzWLGKoRFvCJE35SWZCgFMBemyBPa37BR4+49RNEyvuLRbSfeKlnK3YrP7j7sn9MWJ05q7EkbEYN3qP/U4xfMEBVdJBISInyGIxT8Ae0UxP5+9DvFrcr72LQaIBdtKLiyGltzN10jpPwUAxnpBgRTYWx0ZWRfX4xyO6M1s963493Goe0b5Em0CAO7NaezKXkMHzHXtK5KWowpUMSOhZf7RB2EadnZ8cdxNfqZLoWBdTFkCGbezyd26YT8FPJ7a6ZWSVy/COYWQVvkArogVOEuRvAJEe6Svpwk9XMMMgeeYZUnLl1ykedCTkCEP8KkiuLla/8r+Y6KWU8EB/WL09DGaK863qnjtBjvtBMvRfnan1KP1Rea92icdrbtU6YoOJmtp3nc2Nc3kr4hSkIhReC3+KxXL+0FEku2y5O9YMYjF/UOnmR+e6hl1oxwwIpUHjjUm+hjUEegvOdmFRjxk09RdJhYkWeE8tMkE1pGFL+ZEVxbiFTU2+QI2zAUcp+exHFRa+L3anjpI0SPFfkfzX+w4hAJNGTiAQtdO6SreHhGUJaILdBNEuJCmVgT7MbT+2JuE44IsXXKR98dYUZLJYFxFwNXRszbrs5ay0i55CYIpAedYsy1rV3mKTTb3HPq8HvCz+P2Qs8G3YZUqduHfrtW2jKrKcUyLcqgT1Hi7gjiWkRu9yBdXQmKKYMJutOPxw==");
        this.architectView.onCreate(config);






    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        architectView.onPostCreate();

        try {
             //architectView.setLocation(lon, lat, 1);
             this.architectView.setLocation(-9.0591469,53.2799559, 1000);
             architectView.load("file:///android_asset/demo1/index.html");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onResume(){
        super.onResume();
        architectView.onResume();

    }

    @Override
    protected void onDestroy(){
        super.onDestroy();

        architectView.onDestroy();
    }

    @Override
    protected void onPause(){
        super.onPause();
        architectView.onPause();
    }





   // @Override
    public void onLocationChanged(Location location) {
        // Assign the new location
        mLastLocation = location;

        Toast.makeText(getApplicationContext(), "Location changed!",
                Toast.LENGTH_SHORT).show();

        // Displaying the new location on UI
        //displayLocation();
    }


}




