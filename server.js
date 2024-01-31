const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_app_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connection to database');
    } else {
        console.log('Connected to database');
    }
});

app.get('/', (req, res) => {
    const sql = `SELECT * FROM users`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index.ejs', { data: results, editUser: results[0] });
    });
});

app.get('/', (req, res) => {
    const sql = `SELECT * FROM users`;
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('index.ejs', { data: results, editUser: null });
    });
});

app.post('/add', (req, res) => {
    const { name, email } = req.body;
    const sql = `INSERT INTO users (name, email) VALUES (?, ?)`
    db.query(sql, [name, email], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.post('/edit/:id', (req, res) => {
    const { name, email } = req.body;
    const userId= req.params.id;
    const sql =  `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    db.query(sql, [name, email, userId], (err, results) => {
        if (err) throw err;
        res.redirect('index.ejs', { data: [], editUser: results[0] });
    });
});

app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log('Server is running');
});