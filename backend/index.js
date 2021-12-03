function formatIncident(incident) {
  // eslint-disable-next-line
  const id = incident._id;
  const { latitude, longitude, voltage } = incident;

  const accuracy = Math.min(Math.round((latitude * 100) % 100) + 40, 98) / 100;

  return {
    type: 'Feature',
    id,
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    properties: {
      dangerLevel: 1,
      accuracy,
      voltage,
      id,
      rawData: incident,
    },
  };
}

const { MongoClient, ObjectId } = require('mongodb');
// const fs = require('fs');

// const uri = 'mongodb+srv://ezee:ezee@cluster0.bngnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// client.connect(async err => {
//   const collection = client.db('test_database').collection('test_tickets_table');
//   const cursor = collection.find();
//   const incidents = await cursor.toArray();

//   fs.writeFileSync('myjsonfile.json', JSON.stringify(incidents), 'utf8');

//   client.close();
// });

const express = require('express');
const cors = require('cors');
const clustersData = require('./data/clusters.json');
const ratingData = require('./data/regions_rating.json');
const plansData = require('./data/plans.json');

const app = express();
app.use(cors());
const port = 8080;

app.use(express.static('public'));

app.get('/api/incidents', (req, res) => {
  const uri = 'mongodb+srv://ezee:ezee@cluster0.bngnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  client.connect(async err => {
    const collection = client.db('test_database').collection('test_tickets_table');
    const cursor = collection.find();
    const incidents = await cursor.toArray();

    const features = incidents.map(formatIncident);

    const data = { type: 'FeatureCollection', features };

    res.send(data);

    client.close();
  });
});

app.get('/api/incident', (req, res) => {
  const { id } = req.query;

  const uri = 'mongodb+srv://ezee:ezee@cluster0.bngnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  client.connect(async err => {
    const collection = client.db('test_database').collection('test_tickets_table');
    const incident = await collection.findOne({ _id: ObjectId(id) });

    const feature = formatIncident(incident);

    res.send(feature);

    client.close();
  });
});

app.get('/api/clusters', (req, res) => {
  res.send(clustersData);
});

app.get('/api/statistic', (req, res) => {
  res.send(ratingData);
});

app.get('/api/plans', (req, res) => {
  res.send(plansData);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
