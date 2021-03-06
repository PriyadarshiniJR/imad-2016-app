var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'priyadarshinijr',
    database: 'priyadarshinijr',
    host: 'db.imad.hasura-app.io',
    port:  '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/ui/favicon.ico">
        <link rel="manifest" href="/ui/favicon/manifest.json">
        <meta name="theme-color" content="#ffffff">
        <link rel="stylesheet" href="/ui/bootstrap.css">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Just+Another+Hand|Sacramento|Satisfy|Special+Elite|Tangerine" rel="stylesheet">
        <link href="/ui/article.css" rel="stylesheet" />

      </head> 
      <body onload="loadLogin(); loadComments();">
        <header>
	<nav id="header-nav" class="navbar navbar-default">
		<div class="container">
			<div class="navbar-header">
				<div class="navbar-brand">
            		Articles
         		</div>
				
				<button id="navbarToggle" type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapsable-nav" aria-expanded="false">
	            <span class="sr-only">Toggle navigation</span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
	            <span class="icon-bar"></span>
          		</button>
			</div>

			<div id="collapsable-nav" class="collapse navbar-collapse">
           		<ul id="nav-list" class="nav navbar-nav navbar-right">
            		<li>
              			<a href="/">
                		<span class="glyphicon glyphicon-home" aria-hidden="true"></span><br class="hidden-xs">Home</a>
            		</li>
            		
            		<li id="navProfileButton">
              			<a href="/ui/profile.html">
                		<span class="glyphicon glyphicon-user"></span><br class="hidden-xs">Profile</a>
            		</li>
            		
            		<li>
              			<a href="/ui/articles.html">
                		<span class="glyphicon glyphicon-paperclip" aria-hidden="true"></span><br class="hidden-xs">Articles</a>
            		</li>
            
            		<li>
              			<a href="/ui/profile.html/#contact">
                		<span class="glyphicon glyphicon-earphone"></span><br class="hidden-xs">Contact</a>
            		</li>
            		
            		<li id="logged">
            		    
            		</li>
          		</ul><!-- #nav-list -->
        	</div><!-- .collapse .navbar-collapse -->
		</div>
	</nav>
</header>
          <div class="container">
              <div class="wrap">
                  <div class="heading">
                      ${heading}
                  </div>
                  <div class="date">
                      ${date.toDateString()}
                  </div>
                  <div class="content2">
                    ${content}
                  </div>
              </div>
              <br/>

              <div id="comment_form">
              </div>
              <div id="comments">
              </div>
          </div>
            <script src="/ui/jquery-3.1.1.min.js"></script>
            <script src="/ui/bootstrap.min.js"></script>
            
            <script src="/ui/main.js"></script>
            <script type="text/javascript" src="/ui/article.js"></script>
      </body>
    </html>
    `;
    return htmlTemplate;
}


//Index
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});

function hash (input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  if(!username.trim() || !password.trim() || !email.trim() || username.length>32 || password.length>32 || email.length>64){
      res.status(400).send('Cannot leave username or password blank.')
  } 
  else if(!/^[a-zA-Z0-9_.@]+$/.test(username)){  //If username contains other than a-z,A-Z,0-9,@._ then send error.
      res.status(500).send("Username can't contain special characters except _.@");
  }
  else{
        var salt = crypto.randomBytes(128).toString('hex');
        var dbString = hash(password, salt);
        pool.query('INSERT INTO "user" (username, password,email) VALUES ($1, $2,$3)', [username, dbString,email],         function (err, result) {
           if(err) {
              res.status(500).send(err.toString());
           } else {
              res.send('User successfully created: ' + username);
           }
        });
    }
});

/*
app.post('/signin', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('Username/Password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              console.log(dbString);
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); 
              // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('Credentials correct!');
                
              } else {
                res.status(403).send('Username/Password is invalid');
              }
          }
      }
   });
});
*/

app.post('/signin',function(req,res){
 var username=req.body.username;
 var password=req.body.password;
 if(!username.trim() || !password.trim() || username.length>32 || password.length>32){
      res.status(400).send('Cannot leave username or password blank.Please Enter Username/Password:(Upto 32 chars)');
 }
 else if(!/^[a-zA-Z0-9_ .@]+$/.test(username)){  //If username contains other than a-z,A-Z,0-9,@._BLANKSPACE then send error.
    res.status(500).send("Username can't contain special characters except _.@");
}else{
     pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('Username/Password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              console.log(dbString);
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); 
              // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('Credentials correct!');
                
              } else {
                res.status(403).send('Username/Password is invalid');
              }
          }
      }
   });
   }
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

var pool = new Pool(config);

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.get('/logout',function(req,res)
{    
    delete req.session.auth;
    res.send('Logged Out');
});

//ProfilePage
app.get('/ui/profile', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile.html'));
});

app.get('/ui/bootstrap.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bootstrap.min.js'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
