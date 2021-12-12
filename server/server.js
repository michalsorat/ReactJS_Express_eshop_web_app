const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 5000;
app.use(express.json());
var cors=require('cors');
const { json } = require('body-parser');
app.use(cors({origin:true,credentials: true}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
})

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');

    const drop_products_table_sql = 'DROP DATABASE IF EXISTS vavjs_db';
    db.query(drop_products_table_sql, err => {
        if (err) {
            throw err;
        }
        console.log('Database "vavjs_db" dropped');
    });

    const create_db_sql = 'CREATE DATABASE vavjs_db';
    db.query(create_db_sql, err => {
        if (err) {
            throw err;
        }
        console.log('Database "vavjs_db" created');
    });

    const create_products_table_sql = 'CREATE TABLE IF NOT EXISTS vavjs_db.produkty (id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT , nazov VARCHAR(255) NOT NULL , obrazok VARCHAR(255) NOT NULL , cena DOUBLE NOT NULL , PRIMARY KEY (id))';
    db.query(create_products_table_sql, err => {
        if (err) {
            throw err;
        }
        console.log('Table "produkty" created');
    });
    
    const insert_products_sql = 'INSERT IGNORE INTO vavjs_db.produkty (nazov, obrazok, cena) VALUES ("Iphone X", "https://i.imgur.com/N0xF918.png", 499.99), ("Xiaomi Redmi", "https://i.imgur.com/znvZLaG.png", 199.99), ("Nokia 1208", "https://i.imgur.com/fLSQ3L1.jpeg", 699.99)';
    db.query(insert_products_sql, err => {
        if (err) {
            throw err;
        }
        console.log('Products inserted into "produkty" table');
    });

    const create_order_table_sql = "CREATE TABLE IF NOT EXISTS vavjs_db.objednavky (id BIGINT(20) NOT NULL AUTO_INCREMENT , zakaznik_id BIGINT(20) NOT NULL , produkt_id BIGINT(20) NOT NULL , stav_objednavky ENUM('prijata', 'zaplatena') NOT NULL , pocet_kusov INT NOT NULL, total DOUBLE NOT NULL, PRIMARY KEY (id))";
    db.query(create_order_table_sql, err => {
        if (err) {
            throw err;
        }
        console.log('Table "objednavky" created');
    });

    const create_customer_table_sql = 'CREATE TABLE IF NOT EXISTS vavjs_db.zakaznici (id BIGINT(20) NOT NULL AUTO_INCREMENT, email VARCHAR(255) NOT NULL , meno VARCHAR(255) NOT NULL , ulica VARCHAR(255) NOT NULL , cislo VARCHAR(255) NOT NULL , mesto VARCHAR(255) NOT NULL , psc VARCHAR(255) NOT NULL , PRIMARY KEY (id), UNIQUE (email))';
    db.query(create_customer_table_sql, err => {
        if (err) {
            throw err;
        }
        console.log('Table "zakaznici" created');
    });

    const create_advertisement_table_sql = 'CREATE TABLE IF NOT EXISTS vavjs_db.reklama (id BIGINT(20) NOT NULL, obrazok VARCHAR(255) NOT NULL, link VARCHAR(255) NOT NULL, pocitadlo INT NOT NULL, PRIMARY KEY (id))';
    db.query(create_advertisement_table_sql, err => {
        if (err) {
            throw err;
        }
        console.log('Table "reklama" created');
    });

    const insert_reklama_sql = 'INSERT IGNORE INTO vavjs_db.reklama (obrazok, link, pocitadlo) VALUES ("https://i.imgur.com/rEG3HyO.png", "https://sk.wikipedia.org/wiki/Reklama", 0)';
    db.query(insert_reklama_sql, err => {
        if (err) {
            throw err;
        }
    });

});

app.get('/allProducts', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    const sql = 'SELECT * FROM vavjs_db.produkty';
    db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

app.get('/shoppingCartItems', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    let id_array = JSON.parse(req.query.array);
    const sql = 'SELECT * FROM vavjs_db.produkty WHERE id IN (?)';
    db.query(sql, [id_array], (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

app.post('/createOrder', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    let email = req.body.email;
    let name = req.body.name;
    let street = req.body.street;
    let streetNr = req.body.streetNr;
    let city = req.body.city;
    let psc = req.body.psc;
    let cart = req.body.cart;
    let total = req.body.total;
    const sql = 'INSERT INTO vavjs_db.zakaznici (email, meno, ulica, cislo, mesto, psc) VALUES (?,?,?,?,?,?)'; 
    db.query(sql, [email, name, street, streetNr, city, psc], (err, results) => {
        if (err) {
            res.status(409).send("");
        }
        else {
            const select_sql = 'SELECT id FROM vavjs_db.zakaznici WHERE email = ?';
            db.query(select_sql, email, (err, results) => {
                if (err) {
                    throw err;
                }
                else {
                    let zakaznik_id = results[0].id;
                    const state = 'prijata';
                    for (key in cart){
                        const create_order_sql = 'INSERT INTO vavjs_db.objednavky (zakaznik_id, produkt_id, stav_objednavky, pocet_kusov, total) VALUES (?,?,?,?,?)';
                        db.query(create_order_sql, [zakaznik_id, key, state, cart[key], total], (err, results) => {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                }
            });
            res.status(201).send("");
        }
    });
});

app.get('/getOrders', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    const select_sql = 'SELECT z.id, z.email, z.cislo, z.mesto, z.psc, z.ulica, GROUP_CONCAT(p.nazov) as produkt_nazvy, GROUP_CONCAT(p.cena) as produkt_ceny, GROUP_CONCAT(o.pocet_kusov) as produkt_pocty_kusov, o.total, o.stav_objednavky\
                        FROM vavjs_db.objednavky as o\
                        LEFT JOIN  vavjs_db.zakaznici as z\
                        ON z.id = o.zakaznik_id\
                        LEFT JOIN vavjs_db.produkty as p\
                        ON p.id = o.produkt_id\
                        GROUP BY zakaznik_id';
    db.query(select_sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

app.put('/changeOrderState', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    let customer_id = req.body.customer_id;
    const update_sql = 'UPDATE vavjs_db.objednavky SET stav_objednavky = 2 WHERE zakaznik_id = ?';
    db.query(update_sql, customer_id, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send("");
    });
});

app.get('/getAdvertisement', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    const select_sql = 'SELECT * FROM vavjs_db.reklama WHERE id = 0'
    db.query(select_sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

app.put('/incrementCounter', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    const update_sql = 'UPDATE vavjs_db.reklama SET pocitadlo = pocitadlo + 1 WHERE id = 0';
    db.query(update_sql, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send("");
    });
});

app.put('/postNewUrl', (req, res) => {
    let newUrl = req.body.newUrl;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    const update_sql = 'UPDATE vavjs_db.reklama SET link = ? WHERE id = 0';
    db.query(update_sql, newUrl, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send("");
    });
});

app.put('/postNewImg', (req, res) => {
    let newImg = req.body.newImg;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    const update_sql = 'UPDATE vavjs_db.reklama SET obrazok = ? WHERE id = 0';
    db.query(update_sql, newImg, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send("");
    });
});

app.listen(port, () => console.log(`Server started on port ${port}`));