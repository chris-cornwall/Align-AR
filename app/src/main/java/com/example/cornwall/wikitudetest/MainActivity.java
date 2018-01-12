package com.example.cornwall.wikitudetest;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;

import com.antenna_alignment.nuig.R;
import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;

public class MainActivity extends AppCompatActivity {

    private ArchitectView architectView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null).show();
            }
        });

        this.architectView = (ArchitectView)this.findViewById( R.id.architectView );
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        config.setLicenseKey("qUIw0+pdPPdRCkiRQHP8D4MLzWLGKoRFvCJE35SWZCgFMBemyBPa37BR4+49RNEyvuLRbSfeKlnK3YrP7j7sn9MWJ05q7EkbEYN3qP/U4xfMEBVdJBISInyGIxT8Ae0UxP5+9DvFrcr72LQaIBdtKLiyGltzN10jpPwUAxnpBgRTYWx0ZWRfX4xyO6M1s963493Goe0b5Em0CAO7NaezKXkMHzHXtK5KWowpUMSOhZf7RB2EadnZ8cdxNfqZLoWBdTFkCGbezyd26YT8FPJ7a6ZWSVy/COYWQVvkArogVOEuRvAJEe6Svpwk9XMMMgeeYZUnLl1ykedCTkCEP8KkiuLla/8r+Y6KWU8EB/WL09DGaK863qnjtBjvtBMvRfnan1KP1Rea92icdrbtU6YoOJmtp3nc2Nc3kr4hSkIhReC3+KxXL+0FEku2y5O9YMYjF/UOnmR+e6hl1oxwwIpUHjjUm+hjUEegvOdmFRjxk09RdJhYkWeE8tMkE1pGFL+ZEVxbiFTU2+QI2zAUcp+exHFRa+L3anjpI0SPFfkfzX+w4hAJNGTiAQtdO6SreHhGUJaILdBNEuJCmVgT7MbT+2JuE44IsXXKR98dYUZLJYFxFwNXRszbrs5ay0i55CYIpAedYsy1rV3mKTTb3HPq8HvCz+P2Qs8G3YZUqduHfrtW2jKrKcUyLcqgT1Hi7gjiWkRu9yBdXQmKKYMJutOPxw==");
        this.architectView.onCreate( config );
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
    protected void onPostCreate(Bundle savedInstanceState){
        super.onPostCreate(savedInstanceState);
        architectView.onPostCreate();
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

}
