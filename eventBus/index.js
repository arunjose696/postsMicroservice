const express = require("express")
const axios = require("axios")
const bodyparser= require("body-parser")
var cors= require("cors")
app=express()
app.use(bodyparser.json())
app.use(cors())
var eventsCache=[]

app.get('/eventbus', (req, res) => {
    res.send(eventsCache)
  })

app.post('/eventbus', async (req, res) => {
    const event = req.body
    eventsCache.push(event)
    
    
    try{await axios.post("http://posts-service:4000/event/",event)
    }
    catch (err) {
      console.warn("4000 comments failed ")
      
    }
    
    try{await axios.post("http://comments-service:4001/event/",event)
    }
    catch (err) {
      console.warn("4001 posts failed")
      
    }
    try{await axios.post("http://query-service:4002/event/",event)
    }
    catch (err) {
      console.warn("4002  query failed")
      
    }
    // try{await axios.post("http://localhost:4003/event/",event)
    // }
    // catch (err) {
    //   console.warn("4003  query failed")
      
    // }

    
    

    console.log(req.body)
    res.send("GET Request Called")

  })
app.listen(4005,()=>{
    console.log("listening on port 4005")
    console.log("updated query")
    
    
})


