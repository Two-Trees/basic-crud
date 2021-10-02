import express from 'express'; 
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import gifRouter from './routes/gifs.js'
import authRouter from './routes/auth.js'

const accessTokenSecret = 'somerandomaccesstoken';

mongoose.connect('mongodb+srv://Two-Trees:vorplesword@cluster0.g2rte.mongodb.net/gifs-library?retryWrites=true&w=majority')
console.log("connected to MongoDB")

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

const app = express(); 
const PORT = process.env.POT || 3001;

app.use(express.urlencoded( { extended: true })); 

app.use('/auth', authRouter);

app.use('/gifs', authenticateJWT, gifRouter)

app.get('/', (req, res) => {
    res.send("Login to access API")
})

app.listen(PORT, () => {
    console.log(`listening on: ${PORT}`); 
})

app.post('/logout', (req, res) => {
    const token  = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.send("Logout successful");
});