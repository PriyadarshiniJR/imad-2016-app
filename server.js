var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
    myone:{
           title:'MyFirst Page',
           content:'This is my first page.'
    },
    
    mytwo:{
           title:'MySecong Page',
           content:'This is my second page.'
    },
    
    mythree:{
           title:'MyThird Page',
           content:'This is my third page.'
    }
};

function template(data){
    var title=data.title;
    var content=data.content;
    var htmlTemplate=`<!DOCTYPE html>
    <html>
     <head>
         <title>
             ${title}
         </title>
         <meta name='viewport' content='width=device=width initial-scale=1'>
         <link href="/ui/style.css" rel="stylesheet" />
     </head>   
     <body>
         <div class='container'>
            
             <div>
                 <a href='/'>HOME</a>
             </div>
             
             <div>
                 <hr>
             </div>
             
             <div>
                 <p>
                     ${content}
                </p>
             </div>
         </div>
     </body>
    </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:pageName',function(req,res){
  var pageName = req.params.pageName;
  res.send(template(articles[pageName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
