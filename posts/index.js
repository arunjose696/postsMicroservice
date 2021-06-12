//const exec = util.promisify(require('child_process').exec);
const { randomBytes } = require("crypto")
var express = require ("express")
var cors = require('cors')
 
var bodyParser = require('body-parser');
const { default: axios } = require("axios");

var app = express();
app.use(cors())
app.use(bodyParser.json());
var posts= {};
app.get('/posts', function (req, res) {
    res.send(posts)
  })
  //asd

  app.post('/posts',   async function (req, res) {
    const id = randomBytes(4).toString("hex");
    const {title} = req.body
    posts[id]={
        id,title
 
    }
    try{
    await axios.post("http://eventbus-service:4005/eventbus",{
      "type":"postEvent",
      "data":{
        id,
        title

      }


    })}
    catch (err) {
      console.warn(err)
      
    }

    res.status(201).send(id)

    
  })

app.post("/event",function(req,res){
  console.log(req.body.type)
  res.send({})

})
  app.listen(4000, () => {
    console.log('Listening on port 4000 here');
    console.log("change to deployment")
   
  });