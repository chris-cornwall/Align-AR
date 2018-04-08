<html>  
    <head>  
        <title>Align AR</title>  
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />  
         <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>  
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>  
        <script src="https://apis.google.com/js/platform.js" async defer></script>
        
        <meta name="google-signin-client_id" content="962339483613-qet1cck0p62fh7mi4lsgnj3r25r43s62.apps.googleusercontent.com">
        
        <link rel="stylesheet" type="text/css" href="index.css">
       
    </head>  
   <body onLoad = "signOut()">
    
  <form action="/ITChris/login.php" method="post">
  <div class="imgcontainer">
    <img src="images/logo.png" alt="Avatar" class="avatar">
  </div>

  <div class="container">
    <label for="uname"></label>
    <input type="text" placeholder="Enter Username" name="name" required>

    <label for="psw"></label>
    <input type="password" placeholder="Enter Password" name="password" required>

    <button type="submit" value="Submit">Login</button>
      <div class="g-signin2"
         data-onsuccess="onSignIn"
         data-redirecturi="https://danu6.it.nuigalway.ie/ITChris">
    </div>
      
    <label>
      <input type="checkbox" checked="checked" name="remember"> Remember me
    </label>
  </div>

  <div class="container" style="background-color:#f1f1f1">
    <button type="button" class="cancelbtn">Cancel</button>
    <span class="psw">Forgot <a href="#">password?</a></span>
  </div>
</form>
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
