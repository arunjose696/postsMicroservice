const axios = require("axios")
const express = require("express")
const cors= require("cors")
app=express()
app.use(express.json())
app.use(cors())
app.post("/event",async function(req,res){

    var {type,data}=req.body
    if(type=="newCommentEvent"){
        var {postId,commentId,content,status}= data
        if (status=="pending"){
            if ( content.includes("orange")){

                status="rejected"

            }
            else{
                status="approved" 
            }       
        }
        // const delay = ms => new Promise(res => setTimeout(res, ms));
        // const yourFunction = async () => {
        //     await delay(5000);
        //     console.log("Waited 5s");
          
        //     await delay(5000);
        //     console.log("Waited an additional 5s");
        //   };
        //   await yourFunction()
        //   console.log("dadsdfa")

        
        try {
            
            await axios.post("http://localhost:4005/eventbus", {
                "type": "moderatedEvent",
                "data": {
                    postId,
                    commentId,
                    content,
                    status 
                }
            })            
        }
        catch (err) {
            console.warn(err)
    
        }        

        
    }
    res.send({})

})

app.listen(4003,()=>{
    console.log("moderation service listening on 4003")
})