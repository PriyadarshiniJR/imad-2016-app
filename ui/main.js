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
                  window.location.href='http://priyadarshinijr.imad.hasura-app.io/ui/articles.html';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
                  alert('Invalid username/password');
                  window.location.href='http://priyadarshinijr.imad.hasura-app.io';
              } else if (request.status === 500) {
                  alert("Username can't contain special characters except _.@");
                  submit.value = 'Login';
              }else if(request.status === 400){ 
                  alert('Cannot leave username or password blank.Please Enter Username/Password:(Upto 32 chars)');
                  submit.value = 'Login';
              }else {
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
              }else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('user-new').value;
        var password = document.getElementById('pass-new').value;
        var email = document.getElementById('email').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password,email: email}));  
        register.value = 'Signing Up...';
    
    };
}

// The first thing to do is to check if the user is logged in!
//loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!

function loggedinUser()
{
    
   
    //console.log(usertxt);
   
     var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            {
                
                var usertxt=document.getElementById('logged');
                var user=request.responseText;
                //alert(user);
                console.log(user);
              usertxt.innerHTML=`<a href="/" onclick="return logout();">
                		<span class="glyphicon glyphicon-log-out"></span><br class="hidden-xs">Log Out</a>
              
              Logged in as `+user;
            }
        }
        
    };
request.open('GET','http://priyadarshinijr.imad.hasura-app.io/check-login');
request.send(null);
  
   
    
}


loggedinUser();

function logout(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            {
                alert("Logged out successfully!");
                window.location.href="http://priyadarshinijr.imad.hasura-app.io/";
            }
            
            else
            {
                //console.log(request.status);
            alert('Could not logout');
            }
        }
        
    };
request.open('GET','http://priyadarshinijr.imad.hasura-app.io/logout');
request.send(null);
}