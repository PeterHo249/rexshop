var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.redirect('/product');
});

router.get('/item/:id', function(req, res, next) {
  res.redirect('/product/item/' + req.params.id);
});

module.exports = router;
