require('dotenv').config();
const express = require('express');
const cors = require('cors');
const validUrl = require('valid-url');
const app = express();

const bodyParser = require('body-parser');

const urlDatabase = [];

const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', (req, res) => {
  const { url } = req.body; 
  
 
  if (!validUrl.isWebUri(url)) {
    return res.json({ error: 'invalid url' });
  }

  
  const shortUrl = urlDatabase.length + 1; 
  urlDatabase.push({ original_url: url, short_url: shortUrl });

  return res.json({ original_url: url, short_url: shortUrl });
});


app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = parseInt(req.params.shortUrl, 10);

  const urlEntry = urlDatabase.find(entry => entry.short_url === shortUrl);

  if (urlEntry) {
    return res.redirect(urlEntry.original_url);
  } else {
    return res.status(404).json({ error: 'No short URL found for the given input' });
  }
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
