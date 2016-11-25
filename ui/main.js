function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}


function loadLoginForm () {
   var submit = document.getElementById('signin');
        console.log(submit);
        submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Success!';
                  alert('Login successful');
                  window.location.href='http://priyadarshinijr.imad.hasura-app.io/ui/profile.html';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
                  alert('Invalid username/password');
                  window.location.href='http://priyadarshinijr.imad.hasura-app.io';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = document.getElementById('user-old').value;
        var password = document.getElementById('pass-old').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/signin', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password})); 
        
    };

    var register = document.getElementById('signup');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('Registered successfully. Please login to continue.');
                  window.location.href='http://priyadarshinijr.imad.hasura-app.io';
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('user-new').value;
        var password = document.getElementById('pass-new').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Signing Up...';
    
    };
}

// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!

 function loggedinUser()
{
    
    var usertxt=document.getElementById('nav-list');
    
   
     var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            {
                
               
                var user=request.responseText;
                //alert(user);
                console.log(user);
              usertxt.innerHTML=` 	
              <li>Logged in as ${user}</li>
              <li id="navProfileButton">
              			<a href="/profile">
                		<span class="glyphicon glyphicon-user"></span><br class="hidden-xs">Profile</a>
            		</li>
            
            		<li>
              			<a href="/ui/articles.html">
                		<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span><br class="hidden-xs">Articles</a>
            		</li>
            
            		<li>
              			<a href="#">
                		<span class="glyphicon glyphicon-earphone"></span><br class="hidden-xs">Contact</a>
            		</li>`;
            
            }
             
            else
            {
                usertxt.innerHTML=`	<li id="navProfileButton">
              			<a href="/profile">
                		<span class="glyphicon glyphicon-user"></span><br class="hidden-xs">Profile</a>
            		</li>
            
            		<li>
              			<a href="/ui/articles.html">
                		<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span><br class="hidden-xs">Articles</a>
            		</li>
            
            		<li>
              			<a href="#">
                		<span class="glyphicon glyphicon-earphone"></span><br class="hidden-xs">Contact</a>
            		</li>`;
            }
              
            
        }
        
    };
request.open('GET','http://varunotelli.imad.hasura-app.io/check-login');
request.send(null);
  
   
    
}


loggedinUser();
