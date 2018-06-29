const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use("/", express.static("servroot"));
app.listen(port, () => console.info("Listening on port "+port));