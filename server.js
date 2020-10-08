const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const logger = require('morgan');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// use morgan for logging requests
app.use(logger("dev"));
// Define middleware here
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// Serve up static assets
app.use(express.static("./client/build"));


// Send every other request to the React app
// Define any API routes before this runs
// app.get("/mreh", (req, res) => {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });
// app.get("/other", (req, res) => {
//     res.sendFile(path.join(__dirname, "./public/other.html"));
// });
app.get("/output.mp3", (req, res) => {
    res.setHeader("content-type", "audio/mpeg");
    fs.createReadStream("output.mp3").pipe(res);
});
app.post("/texttospeech", async function(req, res) {

  // console.log(req);
  console.log('body: ', req.body);

  console.log('text: ', req.body.text);
  // The text to synthesize
  const text = req.body.text;

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', name: 'en-US-Wavenet-F', ssmlGender: 'FEMALE'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  try {
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    const outputFile = 'output.mp3'
    await writeFile( outputFile, response.audioContent, 'binary');
    console.log('file written');

    //return audio to client
    res.send({
      result: 'success',
      audioURL: 'http://localhost:3001/output.mp3'
    });
  } catch (err) {
    res.send({error: `${err}`});
    console.log('error: ', err);
  }  
});

app.post("/texttospeechsentence", async function(req, res) {

  // console.log(req);
  console.log('body: ', req.body);

  console.log('text: ', req.body.text);
  // The text to synthesize
  const text = req.body.text;

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', name: 'en-US-Wavenet-F', ssmlGender: 'FEMALE'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  try {
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    const outputFile = 'output.mp3'
    await writeFile( outputFile, response.audioContent, 'binary');
    console.log('file written');

    //return audio to client
    res.send({
      result: 'success',
      audioURL: 'http://localhost:3001/output.mp3'
    });
  } catch (err) {
    res.send({error: `${err}`});
    console.log('error: ', err);
  }  
});

app.listen(PORT, () => {
  console.log(`Our server is now listening on port ${PORT}!`);
});