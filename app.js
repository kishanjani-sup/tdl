//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");
const _ = require("lodash")
const app = express();

mongoose.connect("mongodb+srv://admin-kishan:test123@cluster0.dudlm.mongodb.net/toDoListDB",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
const itemSchema = new mongoose.Schema({
  name:String
});

const Item = mongoose.model("item" ,itemSchema)
const work1 = new Item ({
  name:"go to dentis"
});
const work2 = new Item ({
  name:"shop grocery"
});

const listSchema = new mongoose.Schema({
  name:String,
  items:[itemSchema]
});
 const List = mongoose.model("list",listSchema);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {

Item.find({},function(err,items){
  if(items.length === 0){
    Item.insertMany([work1,work2],function(err){
      if(err){
        console.log(err)
      }
      else{
        console.log("added to list !!")
      }
    });
    res.redirect("/");
}else{
    res.render("list", {listTitle: "today", newListItems: items});
  }
});
// if(res.body.check === "on"){
//   Item.findByIdRemove(res.body,)
// }
// console.log(res.body.check);

});

app.post("/delete",function(req,res){
const checkedItem = req.body.checkbox;
const listName = req.body.listName;
if(listName === "today"){
  Item.findByIdAndRemove(checkedItem,function(err){
    if(!err){
      console.log("successfully deleted item ");
      res.redirect("/")
    }
  })

}
else{
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}},function(err,result){
    if(!err){
      res.redirect("/"+listName);
    }
  })
}

})
app.post("/", function(req, res){

  const listItem = req.body.newItem;
  const itemList =  req.body.list;

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
const item = new Item ({
  name:listItem
});
if(itemList === "today"){
  item.save();
  res.redirect("/");
}
else{
  List.findOne({name:itemList},function(err,result){
    result.items.push(item);
    result.save();
    res.redirect("/"+itemList);

  });


}

});

app.get("/:title",function(req,res){
   const listName = _.capitalize(req.params.title);
   const list = new List ({
     name: listName,
     items: [work1,work2]
   });
List.findOne({name:listName},function(err,result){
  if(!err){
    if(!result){
      const list = new List ({
        name: listName,
        items: [work1,work2]
      });
      list.save();
      res.redirect("/"+listName);
    }
    else{
        res.render("list", {listTitle: result.name, newListItems: result.items});
    }
  }
})

   list.save();
})
app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT, function() {
  console.log("Server started ");
});





// <% for (let i=0; i<newListItems.length; i++) { %>
//   <div class="item">
//     <input type="checkbox">
//     <p><%=  newListItems[i].name  %></p>
//   </div>
//   <% } %>
