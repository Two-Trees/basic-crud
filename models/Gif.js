import mongoose from 'mongoose'; 

let Schema = mongoose.Schema; 

const Gif = mongoose.model('Gif', Schema({
    url: String, 
    user: {type: Schema.Types.ObjectId, ref: 'User'}
}))

export default Gif; 