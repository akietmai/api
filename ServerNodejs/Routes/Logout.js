// Model
var modelToken = require('../Models/modelToken');

module.exports = function (app) {
  // Xóa 1 token
  app.post('/logout1Token', (req, res) => {
    modelToken.findOneAndUpdate({ Token: req.body.Token, State: true }, { State: false }, (err1) => {
      if (err1) {
        res.json({ kq: 0, 'Error delete 1 token': err1 });
      } else {
        res.json({ kq: 1, MSG: 'Logout 1 token successfully' });
      }
    });
  });

  // Xóa tất cả token của id
  app.post('/logoutAllToken', (req, res) => {
    modelToken.findOne({ Token: req.body.Token, State: true }, (errFind, result) => {
      if (errFind) {
        res.json({ kq: 0, 'Error Find': errFind });
      } else {
        modelToken.updateMany({ result: result.User }, { State: false }, (err2) => {
          if (err2) {
            res.json({ kq: 0, 'Error delete all token': err2 });
          } else {
            res.json({ kq: 1, MSG: 'Logout all token successfully' });
          }
        });
      }
    });
  });
};
