const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");


const app = express();
const PORT = 3000;

//Initiating connection to the DB -->
mongoose.connect("",{
}).then(() => console.log("Successfully connect to mongoDB"))
    .catch(err => console.log("Error in connecting to DB" , err));

//Creating Schema using Mongoose to use in the DB for the URL model

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
})

//Defining the URL model

const urlModel= mongoose.model('URL', urlSchema);

//Defining a middleware to parse the JSON

app.use(express.json());

//function to validate the URL against the schema created
function isValidUrl(url){
    try{
        new urlModel({ originalUrl: url });
        return true
    }catch (error){
        console.log(error);
        return false;
    }
}
//Defining the routes
app.post('/shorten',async (req,res) =>{
    const {originalUrl} = req.body;

    //Validating the URL
    if(!isValidUrl(originalUrl)){
        return res.status(400).json({
            error:"The URL is invalid"
        })
    }

    //If the URL is Valid we can proceed further
    try {
        let url = await urlModel.findOne({originalUrl});

        //If the URL is present in the DB we can directly return it back to the USER.
        if(url){
            res.json(url);
        }else {
            const shortUrl = shortid.generate();
            const newUrl = new urlModel({ originalUrl: originalUrl, shortUrl: shortUrl });
            await newUrl.save();
            res.json(newUrl);
        }
    }catch (e){
        console.log("There is error in generating the URL");
        console.error(e);
        res.status(500).json({error:"There is error in generating the URL"});
    }
})

//GET Route to get the Shortened URL from the DB
app.get('/:shortUrl',async (req, res)=>{
    const {shortUrl} = req.params;
    console.log("Inside the ShortURL");
    try{
        const url = await urlModel.findOne({ shortUrl: shortUrl });
        if(url){
            res.redirect(url.originalUrl);
        }else {
            res.status(404).send({error:"URL not found !!!"})
        }
    }catch (e) {
        console.log(e);
        res.status(500).send({error:"Server error !!!"});
    }
});

//Initializing the Server to Listen on the PORT 
app.listen(PORT,()=>{
    console.log("Server is connected on the PORT" + PORT);
})
