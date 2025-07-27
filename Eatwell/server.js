const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); 

mongoose.connect('mongodb://localhost:27017/mangos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(' Свързан с MongoDB (mangos)');
}).catch(err => {
  console.error(' Грешка при свързване с MongoDB:', err);
});


const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, { collection: 'mangas' }); 

const User = mongoose.model('User', userSchema);


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  
  if (!username || !password) {
    return res.status(400).json({ message: 'Моля, попълнете всички полета.' });
  }

  try {
    
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: ' Успешно запазен потребител!' });
  } catch (error) {
    console.error(' Грешка при запис:', error);
    res.status(500).json({ message: 'Грешка при записа в базата.' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Сървърът работи на: http://localhost:${PORT}`);
});