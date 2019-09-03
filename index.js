var express = require('express'),
	path 	= require('path'),
	bodyParser = require('body-parser'),
	cons	= require('consolidate'),
	dust	= require('dustjs-helpers'),
	pg		= require('pg'),
	app		= express();

// pull specifics instead of everything
// const { Pool, Client } = require('pg')

/* Database connection string format and string */
// var conString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'
var connector = 'postgresql://root:dollar@localhost/db_recipes'

// assign Dust engine as to .dust files
app.engine('dust', cons.dust);

// set the default extension as .dust
app.set('view engine', 'dust');

// look into the views folder
app.set('views', __dirname + '/views');

// setting the public folder
app.use(express.static(path.join(__dirname, 'public')));

// adding body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create a route
app.get('/', function(req, res){
	console.log('App Landing page loaded successfully!');
	// res.render('index');
	// postres connection

	pg.connect(connector, function(err, client, done){
		if(err){
			return console.error('error fetching the client data from Pool', err);
		}
		client.query('SELECT * FROM recipes', function(err, result){
			if (err){
				return console.log('Error in running the query!', err);
			}

			// render the template
			res.render('index', {recipes: result.rows});
		});
		done();
	});

});



// make a serve and port
app.listen(3000, function(){
	console.log('Express server now running on port 3000!')
});

