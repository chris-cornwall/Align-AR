<html>  
    <head >  
        <title>Align AR</title>  
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />  
         <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>  
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>  
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
        <script src="https://apis.google.com/js/api.js"></script>
        
        <meta name="google-signin-client_id" content="962339483613-qet1cck0p62fh7mi4lsgnj3r25r43s62.apps.googleusercontent.com">
        <div> <a href="logout.php" onclick="sign_out();">Sign out</a></div>
        <div> <a href="#" onclick="validate_user();">Validate User</a></div>
        
       
    </head>  
    <body onload="gapi.load('client', start)">  
        
        <div class="container">  
            <br />  
            <br />
			<br />
			<div class="table-responsive">  
				<h3 align="center">Align AR</h3><br />
				<span id="result"></span>
				<div id="live_data"></div>                 
			</div>  
		</div>
    </body> 
</html>  
<script>
    function validate_user()
    
        {
            console.log("VALIDATING USER....");
            var auth2 = gapi.auth2.getAuthInstance();
            if (auth2.isSignedIn.get()){
            console.log("USER IS SIGNED IN");
            }
            else{
                console.log("USER IS NOT SIGNED IN");
               // window.location = "http://danu6.it.nuigalway.ie/ITChris";
            }
        } 
    
        function checkFlag() {
    if(start() == false) {
        console.log("Checking flag...");
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      console.log("flag set to true");

      validate_user();
    }
}

  function start()
  {   
      if(gapi.client == null){
          return false;
      }
      else{
      // 2. Initialize the JavaScript client library.
      gapi.client.init({
          'apiKey': 'AIzaSyCixKQqcLECrgmfcWwgM7ZoCinYNArJ9Tk',
           // clientId and scope are optional if auth is not required.
          'clientId': '962339483613-qet1cck0p62fh7mi4lsgnj3r25r43s62.apps.googleusercontent.com',
          'scope': 'profile'
      })
      console.log("Start has finished");
      return true;
      }
  }
  
     
// 1. Load the JavaScript client library.
//gapi.load('client', start);
checkFlag();
    

 
    
 function sign_out()
    {
        console.log("INSIDE SIGNOUT FUNCTION");
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
            document.location.href = '/ITChris/';
        });
   }

        
    
 

             
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