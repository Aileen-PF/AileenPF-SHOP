const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dbConnection = require('./database');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));

// SET OUR VIEWS AND VIEW ENGINE
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

// APPLY COOKIE SESSION MIDDLEWARE
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge:  null
}));

// DECLARING CUSTOM MIDDLEWARE
const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('register');
    }
    next();
}
const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/home');
    }
    next();
}
// END OF CUSTOM MIDDLEWARE

//WEBSITE SETTING
app.use((req, res, next) => {
    dbConnection.execute("SELECT * FROM `website` WHERE `id`=?", [1])
        .then(([rows]) => {
            if (rows.length > 0) {
                res.locals.websiteData = {
                    id: rows[0].id,
                    name: rows[0].name,
                    logo: rows[0].logo,
                    banner1: rows[0].banner1,
                    banner2: rows[0].banner2,
                    background: rows[0].background,
                    declared: rows[0].declared,
                    theme: rows[0].theme,
                    discord: rows[0].discord,
                    facebook: rows[0].facebook,
                };
                next();
            } else {
                res.status(404).send('Website data not found');
            }
        })
        .catch((error) => {
            console.error('Error fetching website data:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/update_website', (req, res) => {
    const { name, logo, banner, background, declared, theme, discord, facebook } = req.body;

    dbConnection.execute("UPDATE `website` SET `name`=?, `logo`=?, `banner`=?, `background`=?, `declared`=?, `theme`=?, `discord`=?, `facebook`=? WHERE `id`=?", [name, logo, banner, background, declared, theme, discord, facebook, 1])
    .then(() => {
        res.redirect('/website');
    })
    .catch((error) => {
        console.error('Error updating website data:', error);
        res.status(500).send('Internal Server Error');
    });
});

app.use((req, res, next) => {
    dbConnection.execute("SELECT * FROM `products`")
        .then(([rows]) => {
            if (rows.length > 0) {
                // Map each row to an object
                const productsData = rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    details: row.details,
                    category: row.category,
                    price: row.price,
                    quantity: row.quantity,
                    image: row.image,
                    recommended_product: row.recommended_product
                }));

                // Set the data in res.locals
                res.locals.productsData = productsData;

                // Call next to proceed with the next middleware
                next();
            } else {
                // No data found, you can handle this case as needed
                // For example, set an empty array in res.locals.productsData
                res.locals.productsData = [];

                // Call next to proceed with the next middleware
                next();
            }
        })
        .catch((error) => {
            console.error('Error fetching product data:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.use((req, res, next) => {
    dbConnection.execute("SELECT * FROM `category`")
        .then(([rows]) => {
            if (rows.length > 0) {
                // Map each row to an object
                const categoryData = rows.map(row => ({
                    id: row.id,
                    name: row.name,
                    details: row.details,
                    category: row.category,
                    price: row.price,
                    quantity: row.quantity,
                    image: row.image,
                    recommended_category: row.recommended_category
                }));

                // Set the data in res.locals
                res.locals.categoryData = categoryData;

                // Call next to proceed with the next middleware
                next();
            } else {
                // No data found, you can handle this case as needed
                // For example, set an empty array in res.locals.categoryData
                res.locals.categoryData = [];

                // Call next to proceed with the next middleware
                next();
            }
        })
        .catch((error) => {
            console.error('Error fetching product data:', error);
            res.status(500).send('Internal Server Error');
        });
});

// ROOT PAGE
app.get('/', ifNotLoggedin, async (req, res, next) => {
    try {
        // Wrap the setTimeout in a Promise
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Wait for the delay to complete
        await delay(300);

        // Fetch user data
        const [userRows] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);
        const userData = userRows[0];

        // Fetch total product count
        const [productRows] = await dbConnection.execute("SELECT COUNT(*) as totalProducts FROM `products`");
        const totalProducts = productRows[0].totalProducts;

        // Fetch total sales count
        const [salesRows] = await dbConnection.execute("SELECT COUNT(*) as totalSales FROM `sales`");
        const totalSales = salesRows[0].totalSales;

        // Fetch total users count
        const [userCountRows] = await dbConnection.execute("SELECT COUNT(*) as totalUsers FROM `users`");
        const totalUsers = userCountRows[0].totalUsers;

        res.render('home', { userData, totalProducts, totalSales, totalUsers });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/home', ifNotLoggedin, async (req, res, next) => {
    try {
        // Wrap the setTimeout in a Promise
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Wait for the delay to complete
        await delay(300);

        // Fetch user data
        const [userRows] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);
        const userData = userRows[0];

        // Fetch total product count
        const [productRows] = await dbConnection.execute("SELECT COUNT(*) as totalProducts FROM `products`");
        const totalProducts = productRows[0].totalProducts;

        // Fetch total sales count
        const [salesRows] = await dbConnection.execute("SELECT COUNT(*) as totalSales FROM `sales`");
        const totalSales = salesRows[0].totalSales;

        // Fetch total users count
        const [userCountRows] = await dbConnection.execute("SELECT COUNT(*) as totalUsers FROM `users`");
        const totalUsers = userCountRows[0].totalUsers;

        res.render('home', { userData, totalProducts, totalSales, totalUsers });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/category', ifNotLoggedin, (req, res, next) => {
    // Simulate a 1-second delay
    setTimeout(() => {
        dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID])
        .then(([rows]) => {
            const userData = rows[0];
            res.render('category', { userData });
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            res.status(500).send('Internal Server Error');
        });
    }, 300); // 1000 milliseconds (1 second) delay
});

app.get('/shop', ifNotLoggedin, (req, res, next) => {
    // Simulate a 1-second delay
    setTimeout(() => {
        dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID])
        .then(([rows]) => {
            const userData = rows[0];
            res.render('shop', { userData });
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            res.status(500).send('Internal Server Error');
        });
    }, 300); // 1000 milliseconds (1 second) delay
});


app.get('/spin', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
        const userData = rows[0];

        res.render('spin', { userData });
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    });
});

app.get('/payment', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
        const userData = rows[0];

        res.render('payment', { userData });
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    });
});

app.get('/contact', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
        const userData = rows[0];

        res.render('contact', { userData });
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    });
});

app.get('/profile', ifNotLoggedin, (req,res,next) => {
    dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
        const userData = rows[0];

        res.render('profile', { userData });
    })
    .catch((error) => {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    });
});

app.get('/backend', ifNotLoggedin, (req, res, next) => {
    dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID])
    .then(([rows]) => {
        if (rows.length > 0) {
            const userRole = rows[0].urole;
            const userData = rows[0];
            if (userRole === 'admin') {
                res.render('backend/backend', { userData });
            } else {
                res.redirect('/home');
            }
        } else {
            res.redirect('/home');
        }
    });
});
// END OF ROOT PAGE

// REGISTER PAGE
app.post('/register', ifLoggedin, 
// post data validation(using express-validator)
[
    body('email','Invalid email address!').isEmail().custom((value) => {
        return dbConnection.execute('SELECT `email` FROM `users` WHERE `email`=?', [value])
        .then(([rows]) => {
            if(rows.length > 0){
                return Promise.reject('This E-mail already in use!');
            }
            return true;
        });
    }),
    body('username','Username is Empty!').trim().not().isEmpty(),
    body('password','The password must be of minimum length 6 characters').trim().isLength({ min: 6 }),
    // เพิ่ม validation สำหรับตรวจสอบรหัสผ่านและยืนยันรหัสผ่าน
    body('c_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
],// end of post data validation
(req,res,next) => {

    const validation_result = validationResult(req);
    const {username, password, email} = req.body;
    // IF validation_result HAS NO ERROR
    if(validation_result.isEmpty()){
        // password encryption (using bcryptjs)
        bcrypt.hash(password, 12).then((hash_pass) => {
            // INSERTING USER INTO DATABASE
            const urole = 'user';
            const money = 0.00;
            const createdAt = new Date().toISOString();
            dbConnection.execute("INSERT INTO `users`(`username`,`email`,`password`, `urole`, `money`, `created_at`) VALUES(?,?,?,?,?,?)",[username,email, hash_pass, urole, money, createdAt])
            .then(result => {
                res.send(`your account has been created successfully, Now you can <a href="/">Login</a>`);
            }).catch(err => {
                // THROW INSERTING USER ERROR'S
                if (err) throw err;
            });
        })
        .catch(err => {
            // THROW HASING ERROR'S
            if (err) throw err;
        })
    }
    else{
        // COLLECT ALL THE VALIDATION ERRORS
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING register PAGE WITH VALIDATION ERRORS
        res.render('register',{
            register_error:allErrors,
            old_data:req.body
        });
    }
});// END OF REGISTER PAGE



// LOGIN PAGE
app.post('/', ifLoggedin, [
    body('username').custom((value) => {
        return dbConnection.execute('SELECT username FROM users WHERE username=?', [value])
        .then(([rows]) => {
            if(rows.length == 1){
                return true;
                
            }
            return Promise.reject('Invalid Username!');
            
        });
    }),
    body('password','Password is empty!').trim().not().isEmpty(),
], (req, res) => {
    const validation_result = validationResult(req);
    const {password, username} = req.body;
    if(validation_result.isEmpty()){
        
        dbConnection.execute("SELECT * FROM `users` WHERE `username`=?",[username])
        .then(([rows]) => {
            bcrypt.compare(password, rows[0].password).then(compare_result => {
                if(compare_result === true){
                    req.session.isLoggedIn = true;
                    req.session.userID = rows[0].id;

                    res.redirect('/');
                }
                else{
                    res.render('register',{
                        login_errors:['Invalid Password!']
                    });
                }
            })
            .catch(err => {
                if (err) throw err;
            });


        }).catch(err => {
            if (err) throw err;
        });
    }
    else{
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        });
        // REDERING register PAGE WITH LOGIN VALIDATION ERRORS
        res.render('register',{
            login_errors:allErrors,
            old_data:req.body
        });
    }
});
// END OF LOGIN PAGE

// LOGOUT
app.get('/logout',(req,res)=>{
    //session destroy
    req.session = null;
    res.redirect('/');
});
// END OF LOGOUT

app.use('/', (req,res) => {
    res.status(404).send('<h1>404 Page Not Found!</h1>');
});

app.listen(3000, () => console.log("Server is Running..."));