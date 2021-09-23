import mongoose from 'mongoose'; 

let Schema = mongoose.Schema; 

const User = mongoose.model('User', Schema({
    username: {
        type: String, 
        unique: true
    }, 
    password: String,
    gifs: [{type: Schema.Types.ObjectId, ref:'Gif'}]
})); 

export default User; 