let bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
let mogoose = require('mongoose');
//coonect to database

mongoose.connect('mongodb+srv://test:test@todo.4fsy8wh.mongodb.net', { useUnifiedTopology: true, useNewUrlParser: true });
//create a schema 

let todoSchema = new mongoose.Schema({
    item: String
});

let Todo = mongoose.model('Todo', todoSchema);
let itemOne = Todo({item: ''}).save(function(err){
    if (err) throw err;
    console.log('item saved');
});

//let data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'code some good stuff'}];
let urlencodedParser = bodyParser.urlencoded({extended: false});
module.exports = function(app){
    app.get('/todo', function(req, res){
        //get data from mongodb and pass to the view
        Todo.find({}, function(err, data){
        if (err) throw err;
        res.render('todo', {todos: data});
        }); 
    });
    app.post('/todo', urlencodedParser, function(req,res){
        //get data from the view and add it to database
        let newTodo = Todo(req.body).save(function(err,data){
            if(err) throw err;
            res.json(data);
        });
        
    });
    app.delete('/todo/:item', function(req,res){
        //delete requested item from database
        Todo.find({item: req.params.item.replace(/\-/g, ' ')}).deleteOne(function(err,data){
            if (err) throw err;
            res.json(data);
        });  
    }); 

}

