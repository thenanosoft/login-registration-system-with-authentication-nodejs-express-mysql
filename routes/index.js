var express = require('express');
var router = express.Router();
var mysql = require("mysql")
var bcrypt = require("bcrypt")
var conn = require("../database/conn");

const { validator } = require("../validator");

/* GET home page. */
router.get('/', (req, res, next) => {
  if(req.session.flag == 1) {
    req.session.destroy();
    res.render('index', { title: 'Nanosoft', message : 'Email Already Exists.', flag : 1 });
  }
  else if(req.session.flag == 2) {
    req.session.destroy();
    res.render('index', { title: 'Nanosoft', message : 'Registration Successfully Completed. Please login!', flag : 0 });
  }
  else if(req.session.flag == 3) {
    req.session.destroy();
    res.render('index', { title: 'Nanosoft', message : 'Confirm Password Does not Match.', flag : 1 });
  }
  else if(req.session.flag == 4) {
    req.session.destroy();
    res.render('index', { title: 'Nanosoft', message : 'Incorrect Email OR Password.', flag : 1 });
  }
  else if(req.session.flag == 5) {
    req.session.destroy();
    res.render('index', { title: 'Nanosoft', message : 'Please Login your Account.', flag : 1 });
  }
  else if(req.session.flag == 6) {
    req.session.destroy();
    res.render('index', { title: 'Nanosoft', message : "Form Validation Error", flag : 1 });
  }
  else {
    res.render('index', { title: 'Nanosoft'});
  }
});

/* Authentication for registration */
router.post("/auth_reg", validator, (req, res, next) => {
  var fullname = req.body.fullname;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;

  if(password == cpassword) {
    var sql = 'select * from user where email = ?;';

    conn.query(sql,[email], (err, result, fields) => {
      if (err) throw err;

      if(result.length > 0) {
        req.session.flag = 1;
        res.redirect('/');
      }
      else {
        // var hashPassword = bcrypt.hashSync(password, 10);
        var sql = 'insert into user(fullname, email, password) values (?,?,?);';
        conn.query(sql, [fullname, email, password], (err, result, fields) => {
          if(err) throw err;
          req.session.flag = 2;
          res.redirect('/');
        })
      }
    })
  }
  else {
    req.session.flag = 3;
    res.redirect('/');
  }
})

/* Authentication for login */
router.post('/auth_login', (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  var sql = 'select * from user where email = ?;';

  conn.query(sql,[email], (err, result, fields) => {
    if (err) throw err;

    // var hashedPassword = bcrypt.compareSync(password, result[0].password)
    if(result.length && password == result[0].password) {
      req.session.email = email;
      res.redirect('/home');
    }else {
      req.session.flag = 4;
      res.redirect("/")
    }
  })
})

/* Home page router */
router.get("/home", (req, res, next) => {
  if(req.session.email) {
    res.render('home', {message : "Welcome, " + req.session.email});  
  }
  else {
    req.session.flag = 5;
    res.redirect("/")
  }
})

/* Logout router */
router.get("/logout", (req, res) => {
  if(req.session.email) {
    req.session.destroy();
  }
  res.redirect("/");
})
module.exports = router;
