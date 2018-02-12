package com.antenna_alignment.nuig;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.widget.Toast;

import com.antenna_alignment.nuig.R;
import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;

import static java.lang.String.*;

public class MainActivity extends AppCompatActivity implements LocationListener{

    private ArchitectView architectView;

    private LocationManager lm;

    private double latitude;
    private double longitude;
    private double altitude = 0;
    private float accuracy;


    //initiate tool bar with buttons and actions
    private void initToolbar() {
        Toolbar toolbarBottom = (Toolbar) findViewById(R.id.menuToolbar);
        toolbarBottom.setOnMenuItemClickListener(new Toolbar.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                switch(item.getItemId()){
                    case R.id.action_main:
                        break;
                    case R.id.action_carte:
                        Intent carte = new Intent(MainActivity.this, Map.class);
                        startActivity(carte);
                        break;
                    case R.id.action_addPoi:
                        Intent addPoi = new Intent(MainActivity.this, AddPoi.class);
                        startActivity(addPoi);
                        break;
                    case R.id.action_galerie:
                        Uri gal = Uri.parse("http://www.lirmm.fr/campusar/galerie/");
                        Intent intent_gal = new Intent(Intent.ACTION_VIEW, gal);
                        startActivity(intent_gal);
                        break;
                    case R.id.action_calendar:
                        Intent calen = new Intent(MainActivity.this, Calendar.class);
                        startActivity(calen);
                        break;
                }
                return true;
            }
        });
        // Inflate a menu to be displayed in the toolbar
        toolbarBottom.inflateMenu(R.menu.menumain_rotated);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initToolbar();

        this.architectView = (ArchitectView) this.findViewById(R.id.architectView);
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        config.setLicenseKey("qUIw0+pdPPdRCkiRQHP8D4MLzWLGKoRFvCJE35SWZCgFMBemyBPa37BR4+49RNEyvuLRbSfeKlnK3YrP7j7sn9MWJ05q7EkbEYN3qP/U4xfMEBVdJBISInyGIxT8Ae0UxP5+9DvFrcr72LQaIBdtKLiyGltzN10jpPwUAxnpBgRTYWx0ZWRfX4xyO6M1s963493Goe0b5Em0CAO7NaezKXkMHzHXtK5KWowpUMSOhZf7RB2EadnZ8cdxNfqZLoWBdTFkCGbezyd26YT8FPJ7a6ZWSVy/COYWQVvkArogVOEuRvAJEe6Svpwk9XMMMgeeYZUnLl1ykedCTkCEP8KkiuLla/8r+Y6KWU8EB/WL09DGaK863qnjtBjvtBMvRfnan1KP1Rea92icdrbtU6YoOJmtp3nc2Nc3kr4hSkIhReC3+KxXL+0FEku2y5O9YMYjF/UOnmR+e6hl1oxwwIpUHjjUm+hjUEegvOdmFRjxk09RdJhYkWeE8tMkE1pGFL+ZEVxbiFTU2+QI2zAUcp+exHFRa+L3anjpI0SPFfkfzX+w4hAJNGTiAQtdO6SreHhGUJaILdBNEuJCmVgT7MbT+2JuE44IsXXKR98dYUZLJYFxFwNXRszbrs5ay0i55CYIpAedYsy1rV3mKTTb3HPq8HvCz+P2Qs8G3YZUqduHfrtW2jKrKcUyLcqgT1Hi7gjiWkRu9yBdXQmKKYMJutOPxw==");
        this.architectView.onCreate(config);
    }


    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

        architectView.onPostCreate();

        try {
            this.architectView.load("file:///android_asset/08_BrowsingPois_5_NativeDetailScreen/index.html");
            architectView.setLocation(latitude, longitude, altitude, accuracy);
        } catch (Exception e) {
            System.out.println("Erreur du chargement de l'asset Wikitude");
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
        lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 0, this);
        lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 10000, 0, this);

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
    //                               fonctions de localisation                                            //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////


    @Override
    public void onLocationChanged(Location location) {
        latitude = location.getLatitude();
        longitude = location.getLongitude();
        altitude = 0;
        accuracy = location.getAccuracy();

        architectView.setLocation(latitude, longitude, altitude, accuracy); //mise a jour de la position

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
       // String msg = format(getResources().getString(R.string.provider_disabled), provider);
       // Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }
}
