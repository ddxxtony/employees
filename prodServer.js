const path = require('path');
const express = require('express');
const compression = require('compression');

console.log('Serving release build');

const app = express();

app.use(compression());
app.use(express.static(path.resolve(__dirname, './dist')));
app.get('*', (req, res) => { res.sendFile(path.resolve(__dirname, './dist/index.html')); });
app.listen(80, (err) => { if (err) console.error(err); });
