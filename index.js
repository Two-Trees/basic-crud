import express from 'express'; 
import path from 'path'; 
import { Low, JSONFile } from 'lowdb'; 
import { v4 as uuidv4 } from 'uuid';

const file = path.join(path.resolve(), 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

const app = express(); 
const PORT = 3001;

await db.read(); 

if(!db.data) db.data = { gifs: [] }

app.get('/post', (req, res) => {
    db.data.gifs.push({id: uuidv4(), url: 'some string'})
    db.write()
    res.send('gif added')
})
//GET
app.get('/read', (req, res) => {
     res.send(db.data.gifs)
})

app.get('/update/:id/:url', (req, res) => {
    const itemToUpdate = db.data.gifs.find((gif) => gif.id === req.params.id);
    itemToUpdate.url = req.params.url; 
    db.write();
    res.send('item updated')
})

app.get('/testresponse/:id', (req, res) => {
    res.json(req.params.id)
})

app.get('/delete/:id', (req, res) => {
    db.data.gifs = db.data.gifs.filter((gifs) => gifs.id !== req.params.id)
    db.write(); 
    res.send(`removed id: ${req.params.id}`)
})

app.listen(PORT, () => {
    console.log(`listening on: ${PORT}`); 
})