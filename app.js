const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

/////////////////////Requests Targetting all articles//////////////////////

app.route('/articles')

  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save((err) => {
      if (!err) {
        res.send('Successfully added a new article.');
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

/////////////////////Requests Targetting A Sprcific Article//////////////////////

app.route('/articles/:articleTitle')

.get((req, res)=>{
  Article.findOne({title: req.params.articleTitle}, (err, foundArticle)=>{
    if(foundArticle){
      res.send(foundArticle);
    } else {
      res.send('No articles matching that title was found.');
    }
  });
})

.put((req,res)=>{
   Article.updateOne(
     {title: req.params.articleTitle},
     {title: req.body.title, content: req.body.content},
     {overwrite: true},
     (err)=>{
       if(!err){
         res.send('Successfully updated the selected article.');
       }
     }
   );
 })

 .patch((req,res)=>{
   Article.updateOne(
     {title: req.params.articleTitle},
     {$set: req.body},
     (err) => {
       if(!err){
         res.send('Successfully updated article.');
       } else {
         res.send(err);
       }
     }
   );
 })

 .delete((req,res)=>{
   Article.deleteOne(
     {title: req.params.articleTitle},
     (err) =>{
       if(!err){
         res.send('Successfully deleted the corresponding article.');
       } else {
         res.send(err);
       }
     }
   );
 });

app.listen(PORT, () => console.log(`Server Running on port: http://localhost:${PORT}`));
