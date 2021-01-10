const express = require('express');
const app = express();
const port = 6000;
const connection = require("./src/config");

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
app.get('/api/series/:field', (req, res) => {
  const getParam = req.params.field;
  connection.query(`SELECT ${getParam} from series`, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving series');
    } else {
      res.status(200).json(results);
    }
  });
});


// (4) GET - Ordered data recovery - The order should be passed as a route parameter
app.get('/api/series/:order', (req, res) => {
  const getOrder = req.params.order;
  connection.query(`SELECT * FROM series ORDER BY id ${getOrder}`, (err, results) => {
    if (err) {
      res.status(500).json({
        error: 'Error retrieving series',
        sql: err.sql,
      });
    } else {
      res.status(200).json(results);
    }
  });
});

// (5) POST - Insertion of a new entity

app.post('/api/', (req, res) => {
  connection.query("INSERT INTO series SET ?", [req.body], (err, results) => {
      if(err){
          res.status(422).json({"error": "required field(s) missing"});
      }else{
          connection.query("SELECT * FROM series WHERE id= ?", [results.insertId], (err, results) => {
              if(err){
                  res.status(400).json({"error": "series doesn't exists"})
              }
              res.status(201).json(results[0]);
          })
          
      }
  })
})

// (6) PUT - Modification of an entity
app.put('/api/series/:id', (req, res) => {
  connection.query("UPDATE series SET ? WHERE id= ?", [req.body, req.params.id], (err, results) => {
      if(err){
          res.status(500).send({errorMessage : err.message});
      }else{
          connection.query("SELECT * FROM series WHERE id= ?", [req.params.id], (err, results) => {
              if(err){
                  res.status(500).send({errorMessage : err.message});
              } else {
                  if(results.length === 0) {
                      res.status(404).json({"error": "series doesn't exists"})
                  }else{
                      res.status(201).json(results[0]);
                  }
              }
          })
      }
  })
})


// (8) DELETE - Delete an entity
app.delete('/api/series/:id', (req, res) => {
  const idSeries = req.params.id;
  connection.query('DELETE FROM series WHERE id = ?', [idSeries], (err, results) => {
    if (err) {
      res.status(500).json({
        error: `Error deleting a serie`,
        sql: err.sql,
      });
    } else {
      res.sendStatus(200);
    }
  });
});

// (9) DELETE - Delete all entities where boolean value is false
app.delete('/api/series', (req, res) => {
  connection.query('DELETE FROM series WHERE watched IS FALSE', (err, results) => {
    if (err) {
      res.status(500).json({
        error: `Error deleting not watched series`,
        sql: err.sql,
      });
    } else {
      res.sendStatus(200);
    }
  });
});


app.listen(port, () => {
  console.log(`Server is runing on ${port}`);
});