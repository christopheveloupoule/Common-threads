const express = require('express');
const app = express();
const port = 8000;
const connection = require("./src/config");
const bodyParser =require("body-parser")


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.text());

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

// GET - HOME
app.get('/', (req, res) => {
  res.send('Hello common threats');
});

// (1) GET - Retrieve all of the data from your table
app.get('/api/series', (req, res) => {
  connection.query('SELECT * from series', (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving series');
    } else {
      res.json(results);
    }
  });
});

// (2) GET - Retrieve specific fields (i.e. series names)
app.get('/api/series/:name', (req, res) => {
  const seriesName = req.params.field;
  connection.query(`SELECT * from series where name = ?`,
    [seriesName],
    (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving series');
    } else {
      res.status(200).json(results);
    }
  });
});


// (4) GET - Ordered data recovery - The order should be passed as a route parameter

app.get('/api/series/name/descending', (req, res) => {
  connection.query("SELECT * FROM series ORDER BY name DESC", (err, results) => {
    if(err){
      res.status(500).send("Error retriving series")
    } else {
      res.status(200).json(results)
    }
  })
});

// (5) POST - Insertion of a new entity (a new serie)
          
app.post('/api/series', (req,res) => {
  const { name, released_Date, watched} = req.body;
  connection.query (
    'INSERT INTO series (name, released_Date, watched) VALUES (?,?,?)',
    [name, released_Date, watched],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send("error create new serie(s)");
      } else {
        res.status(200).send("Well done, new serie(s) created");
      }
    }
  )
})

// (6) PUT - Modification of an entity

app.put("api/series/:id", (req, res) => {
  const seriesId = req.params.id;
  const seriesName = req.body;
  connection.query(
    "UPDATE series SET ? WHERE id = ?",
    [seriesId, seriesName],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating on the serie");
      } else {
        res.status(200).send("Well done, serie updated");
      }
    }
  );
});

// (7) PUT - Toggle a Boolean value

app.put("/api/series/:id", (req, res) => {
  const seriesId = req.params.id;
  connection.query(
    "UPDATE series SET watched = !watched WHERE id = ?",
    [seriesId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating the serie");
      } else {
        res.status(200).send("Well done, serie updated");
      }
    }
  );
});


// (8) DELETE - Delete an entity

app.delete("api/series/:id", (req, res) => {
  const seriesId = req.params.id;
  connection.query(
    "DELETE FROM series WHERE id = ?",
    [seriesId],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting a serie");
      } else {
        res.status(200).send("serie deleted");
      }
    }
  );
});

// (9) DELETE - Delete all entities where boolean value is false

app.delete("/api/series/not_watched", (req, res) => {
  connection.query(
    "DELETE FROM series WHERE watched IS FALSE", (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting non watched series");
      } else {
        res.status(200).send("Non watched series deleted");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});