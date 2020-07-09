var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Server connected successfully!');
});

// body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// mongoose i7nW3imXeS4vxtYi
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(
  'mongodb+srv://demorestapi:i7nW3imXeS4vxtYi@cluster0-gdxyh.mongodb.net/Demo_RestAPI?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log('Database connect error : ' + err);
    } else {
      console.log('Database connected successfully!');
    }
  },
);

require('./Routes/Register')(app);
require('./Routes/Login')(app);
require('./Routes/Logout')(app);
