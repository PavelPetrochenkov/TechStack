const mongoose = require("mongoose");

const Bike = require("../models/bikes");

exports.bike_get_all = (req, res, next) => {
  Bike.find()
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        bikes: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            type: doc.type,
            price: doc.price,
            isRent: doc.isRent,
          };
        })
      };  
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.bike_create_bike = (req, res, next) => {
  price = Number(req.body.price).toFixed(2)
  const bike = new Bike ({
    _id: mongoose.Types.ObjectId(),
    name:  req.body.name,
    type: req.body.type,
    price:  price,
    isRent: false,
  });
   bike
    .save()
    .then(result => {
      res.status(201).json({
        message: "Created bike successfully",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.bike_delete_bike = (req, res, next) => {
  const id = req.body.bikeId;
  Bike.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Bike deleted",
       
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
