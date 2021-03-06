const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const nodeurlShortner=require('node-url-shortener');
const app=express();

app.set('view engine','pug');
app.use(express.urlencoded({ extended: true }));

//first end point GET Request

// moongoose 
mongoose.connect('mongodb://localhost/justshort', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});
// schema

const urlshortnerSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl:String,
    user:String,
    Date:String

  });

// model
const shortner = mongoose.model('shortner',urlshortnerSchema);

// Get request

app.get('/',(req,res)=>{
    shortner.find({},(err,docs)=>{
        if(err){
            res.send("error occured in Data fetch");
        }
        else{
            let document=docs;
            res.render('index',{array:document.reverse()});
        }
    });
});

// Post request
app.post('/',(req,res)=>{
    // data fetch from input 
    let user=req.body.user;
    let fullUrl=req.body.originalUrl;
    // Date declaration
    let d=new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date=d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();

    nodeurlShortner.short(fullUrl,(err,url)=>{
        if(err){
            res.send('Error occured try again!!');
        }
        else{
            // finally shorted url 
            let shortedUrl=url;
            // document creation

            let Data=new shortner({
                longUrl:fullUrl,
                shortUrl:shortedUrl,
                user:user,
                Date:date

            });

            // save data to mongodb
            Data.save();
            res.redirect('/');
        }
    })
    


});

app.listen(80,()=>{
    console.log('Server is ready');
})
