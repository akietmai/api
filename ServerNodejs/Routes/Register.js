// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Model
var modelUser = require('../Models/modelUser');

module.exports = (app) => {
  // Register
  // POST: /user/register
  app.post('/user/register', (req, res) => {
    // Kiểm tra username or email có tồn tại chưa
    modelUser.find({ $or: [{ Username: req.body.Username }, { Email: req.body.Email }] }, (err, data) => {
      if (err) {
        res.json({ kq: 0, 'Error modelUser find': err });
      } else {
        if (data.length != 0) {
          res.json({ kq: 0, 'Username hoặc Email đã tồn tại': 0 });
        } else {
          bcrypt.genSalt(saltRounds, function (errGenSalt, salt) {
            bcrypt.hash(req.body.Password, salt, function (errHash, hash) {
              // Store hash in your password DB.
              if (errHash) {
                res.json({ kq: 0, 'Lỗi mã hóa ': errHash });
              } else {
                var newUser = modelUser({
                  Username: req.body.Username,
                  Password: hash,
                  Active: false,
                  CodeActive: RandomNumberActive(30),
                  Group: 0,
                  RegisterDate: Date.now(),
                  Fullname: req.body.Fullname,
                  Email: req.body.Email,
                  Phone: req.body.Phone,
                  Address: req.body.Address,
                });
                newUser.save((errSave) => {
                  if (errSave) {
                    res.json({ kq: 0, 'Error save data newUser ': errSave });
                  } else {
                    res.json({ kq: 1 });
                  }
                });
              }
            });
          });
        }
      }
    });
  });

  function RandomNumberActive(n) {
    var result = '';
    var array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'k', 'm', 'n', 'p', 's', 'w', 't', 'v', 'y'];
    for (let i = 0; i <= n; i++) {
      var r = Math.floor(Math.random() * array.length);
      result += array[r];
    }
    return result;
  }
};
