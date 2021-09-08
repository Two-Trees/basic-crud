import express from 'express'
import path from 'path'; 
import { Low, JSONFile } from 'lowdb'; 

import { v4 as uuidv4 } from 'uuid';

const file = path.join(path.resolve(), 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read(); 

const router = express.Router(); 

router.get('/', (req, res) => {
    res.send(db.data.gifs)
})
router.post('/', (req, res) => {
   db.data.gifs.push({id: uuidv4(), url: 'some string'})
   db.write()
   res.send('gif added')
})
router.put('/:id/', (req, res) => {
   const itemToUpdate = db.data.gifs.find((gif) => gif.id === req.params.id);
   itemToUpdate.url = req.body.url; 
   db.write();
   res.send(`item updated: ${req.params.id}`)
})
router.delete('/:id', (req, res) => {
    db.data.gifs = db.data.gifs.filter((gifs) => gifs.id !== req.params.id)
    db.write(); 
    res.send(`removed id: ${req.params.id}`)
})

export default router;