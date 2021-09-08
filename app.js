import express from 'express'; 
import path from 'path'; 
import jwt from 'jsonwebtoken'
import { Low, JSONFile } from 'lowdb'; 
import gifsRouter from './routes/gifs.js'

const file = path.join(path.resolve(), 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read(); 
if(!db.data) db.data = { gifs: [] }

const app = express(); 
const PORT = process.env.POT || 3001;

app.use(express.urlencoded( { extended: true })); 

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

const users = [
    {
        username: 'bob',
        password: '123',
    }
]

const refreshTokens = [];

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(`Headers: ${JSON.stringify(req.headers)}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}
app.use('/gifs', authenticateJWT, gifsRouter)

app.post('/login', (req, res) => {
    // read username and password from request body
    const { username, password } = req.body;

    // filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        refreshTokens.push(refreshToken);
        console.log(refreshToken, refreshTokenSecret)

        res.json({
            accessToken,
            refreshToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        console.log(refreshTokenSecret)
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
});

app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.send("Logout successful");
});





//GET
app.get('/', (req, res) => {
    res.send('Login to access API')
})

// app.get('/:id', (req, res) => {
//     if(req.params.id){
//         res.json(req.params.id)
//     } else {
//         res.send('add something to the end of the URL')
//     }
// })

app.listen(PORT, () => {
    console.log(`listening on: ${PORT}`); 
})