<html>  
    <head>  
        <title>Align AR</title>  
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />  
         <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>  
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>  
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        
        <meta name="google-signin-client_id" content="962339483613-qet1cck0p62fh7mi4lsgnj3r25r43s62.apps.googleusercontent.com">
       
    </head>  
   <body onLoad = "signOut()">
    <div class="g-signin2"
         data-onsuccess="onSignIn"
         data-redirecturi="https://danu6.it.nuigalway.ie/ITChris">
    </div>
       <div>
        <a href="#" onclick="signOut();">Sign out</a></div>
     

    <script>
      function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);

            // The user is now signed in on the server too
            // and the user should now have a session cookie
            // for the whole site. 
      document.location.href = '/ITChris/view_summary.php';
    }
        
     function signOut() {
         console.log("INSIDE SIGNOUT FUNCTION");
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
        console.log('User signed out.');
        });
   }
    </script>
  </body>  
</html>  
<script>  
$(document).ready(function(){  
    function fetch_data()  
    {  
        $.ajax({  
            url:"select.php",  
            method:"POST",  
            success:function(data){  
				$('#live_data').html(data);  
            }  
        });  
    }  
    fetch_data();  
    $(document).on('click', '#btn_add', function(){  
        var name = $('#name').text();  
        var description = $('#description').text();  
        var latitude = $('#latitude').text();  
        var longitude = $('#longitude').text();  
        var altitude = $('#altitude').text();  
        var power = $('#power').text();  
        var gain = $('#gain').text();  
        var frequency = $('#frequency').text();  
        var azimuth = $('#azimuth').text();  
        if(name == '')  
        {  
            alert("Enter Antenna Name");  
            return false;  
        }  
        if(description == '')  
        {  
            alert("Enter Antenna Description");  
            return false;  
        }  
        $.ajax({  
            url:"insert.php",  
            method:"POST",  
            data:{name:name, description:description, latitude:latitude, longitude:longitude, altitude:altitude, power:power, gain:gain, frequency:frequency, azimuth:azimuth},  
            dataType:"text",  
            success:function(data)  
            {  
                alert(data);  
                fetch_data();  
            }  
        })  
    });  
    
	function edit_data(id, text, column_name)  
    {  
        $.ajax({  
            url:"edit.php",  
            method:"POST",  
            data:{id:id, text:text, column_name:column_name},  
            dataType:"text",  
            success:function(data){  
                //alert(data);
				$('#result').html("<div class='alert alert-success'>"+data+"</div>");
            }  
        });  
    }  
    $(document).on('blur', '.name', function(){  
        var id = $(this).data("id1");  
        var name = $(this).text();  
        edit_data(id, name, "name");  
    });  
    $(document).on('blur', '.description', function(){  
        var id = $(this).data("id2");  
        var description = $(this).text();  
        edit_data(id, description, "description");  
    });  
      $(document).on('blur', '.latitude', function(){  
        var id = $(this).data("id3");  
        var latitude = $(this).text();  
        edit_data(id, latitude, "latitude");  
    });  
      $(document).on('blur', '.longitude', function(){  
        var id = $(this).data("id4");  
        var longitude = $(this).text();  
        edit_data(id, longitude, "longitude");  
    });  
      $(document).on('blur', '.altitude', function(){  
        var id = $(this).data("id5");  
        var altitude = $(this).text();  
        edit_data(id, altitude, "altitude");  
    });  
      $(document).on('blur', '.power', function(){  
        var id = $(this).data("id6");  
        var power = $(this).text();  
        edit_data(id, power, "power");  
    });  
      $(document).on('blur', '.gain', function(){  
        var id = $(this).data("id7");  
        var gain = $(this).text();  
        edit_data(id, gain, "gain");  
    });  
      $(document).on('blur', '.frequency', function(){  
        var id = $(this).data("id8");  
        var frequency = $(this).text();  
        edit_data(id, frequency, "frequency");  
    });  
      $(document).on('blur', '.azimuth', function(){  
        var id = $(this).data("id9");  
        var azimuth = $(this).text();  
        edit_data(id, azimuth, "azimuth");  
    });  
    $(document).on('click', '.btn_delete', function(){  
        var id=$(this).data("id10");  
        if(confirm("Are you sure you want to delete this?"))  
        {  
            $.ajax({  
                url:"delete.php",  
                method:"POST",  
                data:{id:id},  
                dataType:"text",  
                success:function(data){  
                    alert(data);  
                    fetch_data();  
                }  
            });  
        }  
    });  
});  
</script>