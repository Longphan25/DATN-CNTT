const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const RouteStop = require('../models/RouteStop');

router.post('/', async (req, res) => {
  try {
    const r = await Route.create(req.body);
    res.status(201).json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

router.post('/:routeId/stops', async (req, res) => {
  try {
    const stop = await RouteStop.create({ ...req.body, route: req.params.routeId });
    res.status(201).json(stop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:routeId/stops', async (req, res) => {
  const stops = await RouteStop.find({ route: req.params.routeId }).sort({ order: 1 });
  res.json(stops);
});

module.exports = router;
