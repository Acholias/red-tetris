import express from "express";
import cors from 'cors';

const app = express();
const port = "3000";

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.get("/helloThere", (req, res) => {
  res.send({"ref": "General Kenobi"});
});

app.get("/uwu", (req, res) => {
  res.send({"ref": "uwu"});
});
