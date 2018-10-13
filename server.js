// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./User.js');
var ExerciseLog = require('./ExerciseLog.js');
mongoose.connect('mongodb://jpeeling:hello123@ds231749.mlab.com:31749/exercise_tracker', { useNewUrlParser: true });


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Create a new User based on the ID given
app.post("/api/exercise/new-user", (req, res) => {

  let nameGiven = req.body.username;
  console.log("checking to see if " + nameGiven + " is available...");
  
  User.findOne({username: nameGiven}, (err, data) => {
    
    if(err) return res.json({error: err});
    
    if(data == null){
       
      let newUser = new User;
      newUser.username = nameGiven;
      newUser.id = newUser.id.substring(0, 5);
      
      newUser.save((err, data)=> {
        
        if(err) return res.json({error: err});
        
        return res.json(data);
        
      });
      
    }
    else{
      return res.json({error: "Username is already taken"}); 
    }
    
  });
  
});

app.post("/api/exercise/add", (req, res) => {
   
  let newLog = new ExerciseLog();
  newLog.user_id = req.body.user_id;
  newLog.description = req.body.description;
  newLog.duration = req.body.duration;
  newLog.date = new Date(req.body.date);
  
  if(req.body.user_id.length != 24) return res.json({error: "user ID given is invalid"});
  
  User.findById(mongoose.Types.ObjectId(req.body.user_id), (err, data) => {
    
    if(err) return res.json({error:err});
    console.log(data);
    
    if(data != null){
      
      newLog.save((err, data) => {
        
        if(err) return res.json({error: err});
        
        return res.json({user_id: data.user_id, description: data.description, duration: data.duration, date: data.date})

      });
    }
    else{
      return res.json({error:"User ID given does not exist"}); 
    }
    
  });
  
});

app.get("/api/exercise/log", (req, res) => {

  let userId = req.query.userId;
  let fromDate = req.query.from != "" ? new Date(req.query.from) : null; 
  let toDate = req.query.to != "" ? new Date(req.query.to) : null;
  let limit = isNaN(parseInt(req.query.limit)) ? 1000000 : parseInt(req.query.limit);
  
  let dateOptions = {};
  if(fromDate != null) dateOptions.$gte = fromDate;
  if(toDate != null) dateOptions.$lte = toDate;

  if(Object.keys(dateOptions).length !== 0){
    ExerciseLog.find({user_id:userId, date:dateOptions})
    .limit(limit)
    .exec((err, data) => {

      if(err) return res.json({error: err});

      return res.json(data);

    }); 
  }
  else{
    ExerciseLog.find({user_id:userId})
    .limit(limit)
    .exec((err, data) => {

      if(err) return res.json({error: err});

      return res.json(data);

    });  
  }
  
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});