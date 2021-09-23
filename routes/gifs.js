import express from 'express';
import Gif from '../models/Gif.js'

const gifRouter = express.Router(); 

gifRouter.get('/', (req, res) => {
    console.log(req.user)
    Gif.find({user: req.user.id}, (err, gifs) => {
        if (err) {
            console.log(err)
            res.send("error!")
        } else {
            console.log(gifs)
            res.send(gifs)
        }
    })
})

gifRouter.post('/', (req, res) => {
    Gif.create({ user: req.user.id, url: req.body.url }, (err, gif) => {
        if(err) {
            console.log(err); 
            res.send('error')
        } else {
            res.send('success')
        }
    })
})

gifRouter.put('/:id/', (req, res) => {
    Gif.findByIdAndUpdate(req.params.id, {url: req.body.url}, (err, result) => {
        if(err) {
            console.log(err); 
            res.send('error')
        } else {
            console.log("updated url:", req.body.url)
            res.send('success')
        }
    })
})

gifRouter.delete('/:id', (req, res) => {
    Gif.findByIdAndDelete(req.params.id, {url: req.body.url}, (err, result) => {
        if(err) {
            console.log(err); 
            res.send('error')
        } else {
            console.log("Deleted url:", req.body.url)
            res.send('success')
        }
    })
})

export default gifRouter;