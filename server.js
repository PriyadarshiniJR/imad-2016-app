var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var article = {
	first:{
		title:'First Shot',
		h2Content:'I am Priya',
		wishContent:'How are you?',
		dateContent:'Today is Friday'
	},

	second:{
		title :'Second Shot',
		h2Content:'I am Madhu',
		wishContent:'Hey all!',
		dateContent:'Tmrw is Saturday'
	},

	third:{
		title :'Third Shot',
		h2Content:'I am Varun',
		wishContent:'Sup',
		dateContent:'Day after is Sunday'
	}
}

function createTemp(data){
	var title =data.title;
	var h2Content=data.h2Content;
	var wishContent=data.wishContent;
	var dateContent=data.dateContent;
	var htmlTemp = 	`<!DOCTYPE html>
	<html>
	<head>
		<title>
			${title}
		</title>
		<meta name="viewport" content="width=device-width initial-scale=1">
		<link href="/ui/style.css" rel="stylesheet" />
	</head>
	<body>
	<div class='container'>
		<div>
			<h2>
			${h2Content}
			</h2>
		</div>

		<div>
			<hr>
		</div>

		<div>
			<p>
				${wishContent}
			</p>
		</div>

		<div>
			<p>
				${dateContent}
			</p>
		</div>
	<div>
	</body>
	</html>`;
	return htmlTemp;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:pageName',function(req,res){
	var pageName=req.params.pageName;
	res.send(createTemp(article[pageName]));
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