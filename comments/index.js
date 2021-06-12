const { randomBytes } = require("crypto")
const express = require("express")
const bodyparser = require("body-parser")
var cors = require('cors')
const axios = require("axios")
var app = express();
app.use(bodyparser.json());
app.use(cors())
 
var commentsByPostId = {}
 
app.post("/posts/:id/comments", async function (req, res) {
    const commentId = randomBytes(4).toString("hex")
    const { content } = req.body;
    comments = commentsByPostId[req.params.id] || []
    comments.push(
        {
            commentId,
            content,
            status : "pending"

        } 

    )
    commentsByPostId[req.params.id] = comments
    try {
        await axios.post("http://eventbus-service:4005/eventbus", {
            "type": "newCommentEvent",
            "data": {
                "postId": req.params.id,
                commentId,
                content,
                status : "pending"
            } 


        })
    }
    catch (err) {
        console.warn(err)

    }

    res.status(201).send(comments)

})





app.post("/event",async function(req,res){
    var {data,type}=req.body
    console.log(type)
    if (type=="moderatedEvent"){
        var {postId, commentId, content, status}=data
        comments=commentsByPostId[postId]

        comment=comments.find((comment)=>{
            return comment.commentId==commentId
        })
        comment.status=status
 

        try {
            await axios.post("http://eventbus-service:4005/eventbus", {
                "type": "commentUpdated",
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


app.get("/posts/:id/comments", function (req, res) {
    comments = commentsByPostId[req.params.id] || []
    

    res.send(comments)
}
)

app.listen(4001, () => {
    console.log('Listening on port 4001');
    console.log("comments service")

});


