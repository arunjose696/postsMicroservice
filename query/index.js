const axios = require("axios")
const express = require("express")
const bodyparser= require("body-parser")
const cors=require("cors")
const { response } = require("express")



app=express()
app.use(express.json())
app.use(cors())
var postsAndComments={}
app.get("/query",(req,res)=>{
    res.send(postsAndComments)
})

function handleEvents(type,data)
{
    console.log(type)
    if (type=="postEvent"){
        var {id,title} = data
        postsAndComments[id]={
            id,
            title,
            "comments":[]
        } 

    }
    if (type=="newCommentEvent"){
       var {postId,commentId,content,status} = data 
       post=postsAndComments[postId]
       post.comments.push({
        commentId,
        content,
        status      
       })
    }      
    if (type=="commentUpdated"){
       var {postId,commentId,content,status} = data 
       
       post=postsAndComments[postId]
       comments=post.comments
       console.log(comments)
       
       comment=comments.find((comment)=>{
        return comment.commentId==commentId
       })
       comment.status=status 





       


    }

}

app.post("/event",(req,res)=>{
    var {type, data} = req.body

    handleEvents(type,data)
    
    res.send({}) 


})

app.listen(4002,()=>{
    console.log("listening on 4002")
     
    eventsOccured=axios.get("http://eventbus-service:4005/eventbus").then((response)=>{

    for(prevevent of response.data){

        var {type, data} = prevevent
        
        handleEvents(type,data)


    }
    }
        )
     
    
})
