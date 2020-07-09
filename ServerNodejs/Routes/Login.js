// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// jsonwebtoken
var jwt = require('jsonwebtoken');
var privateKey = 'tramxinh';

// Model
var modelUser = require('../Models/modelUser');
var modelToken = require('../Models/modelToken');

module.exports = function (app) {
  // Active
  // GET : /active/:codeActive
  app.get('/active/:codeActive', (req, res) => {
    modelUser.findOne({ CodeActive: req.params.codeActive }, (errFind, data) => {
      if (errFind) {
        res.json({ kq: 0, 'Error modelUser find CodeActive': errFind });
      } else {
        if (data.length == 0) {
          res.json({ kq: 0, ErrMSG: 'Code này không tồn tại' });
        } else {
          if (data.Active == false) {
            modelUser.findOneAndUpdate({ CodeActive: req.params.codeActive }, { Active: true }, (errUpdate) => {
              if (errUpdate) {
                res.json({ kq: 0, 'Error Update Active': errUpdate });
              } else {
                res.json({ kq: 1 });
              }
            });
          } else {
            res.json({ kq: 0, ErrMSG: 'Tài khoản đã active' });
          }
        }
      }
    });
  });

  // Login
  // POST : /user/login
  app.post('/user/login', (req, res) => {
    // Check username có tồn tại ko
    modelUser.findOne({ Username: req.body.Username }, (errFind, data) => {
      if (errFind) {
        res.json({ kq: 0, 'Error modelUser find Username': errFind });
      } else {
        if (!data) {
          res.json({ kq: 0, ErrMSG: 'Username chưa đăng kí' });
        } else {
          // Check active == true
          if (data.Active !== true) {
            res.json({ kq: 0, ErrMSG: 'User chua active' });
          } else {
            // Check password
            bcrypt.compare(req.body.Password, data.Password, function (errCompare, result) {
              // result == true
              if (errCompare) {
                res.json({ kq: 0, 'Error Hash Password': errCompare });
              } else {
                if (result !== true) {
                  res.json({ kq: 0, ErrMSG: 'Sai Password' });
                } else {
                  // Tạo Token
                  jwt.sign(
                    {
                      IdUser: data._id,
                      Username: data.Username,
                      Group: data.Group,
                      RegisterDate: data.RegisterDate,
                      Fullname: data.Fullname,
                      Email: data.Email,
                      Phone: data.Phone,
                      Address: data.Address,
                      RequireAgent: req.headers,
                      CreatingDate: Date.now(),
                    },
                    privateKey,
                    { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 2 },
                    (errJWT, token) => {
                      if (errJWT) {
                        res.json({ kq: 0, 'Error JWT': errJWT });
                      } else {
                        var currenToken = new modelToken({
                          Token: token,
                          User: data._id,
                          CreateDate: Date.now(),
                          State: true,
                        });
                        // Huy tat ca Token cũ
                        modelToken.updateMany({ User: data._id }, { State: false }, (errUpdate) => {
                          if (errUpdate) {
                            res.json({ kq: 0, 'Error Update': errUpdate });
                          } else {
                            // Save token
                            currenToken.save((errSave) => {
                              if (errSave) {
                                res.json({ kq: 0, 'Error save :': errSave });
                              } else {
                                res.json({ kq: 1, Token: token });
                              }
                            });
                          }
                        });
                      }
                    },
                  );
                }
              }
            });
          }
        }
      }
    });
  });
};
