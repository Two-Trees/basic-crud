import express from 'express'
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js'

const authRouter = express.Router();

const accessTokenSecret = 'somerandomaccesstoken'
const refreshTokenSecret = 'somerandomstringfor refreshtoken'
const refreshTokens = []; 

authRouter.post('/login', (req, res) => {
    // read username and password from request body
    const { username, password } = req.body;

    User.findOne({username: username, password: password}, (err, user) => {
        if(err || !user) {
            res.send('Username or password incorrect')
        } else {
            const accessToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
            const refreshToken = jwt.sign({ id: user._id, username: user.username, role: user.role }, refreshTokenSecret);

            refreshTokens.push(refreshToken);
            console.log(refreshToken, refreshTokenSecret)

            res.json({
                accessToken,
                refreshToken
            });
        }
    })
});

authRouter.post('/token', (req, res) => {
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

export default authRouter
