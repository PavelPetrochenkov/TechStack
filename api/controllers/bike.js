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

exports.bike_create_bike = async (req, res, next) => {
  const bike = new Bike ({
    _id: mongoose.Types.ObjectId(),
    name:  req.body.name,
    type: req.body.type,
    price:  req.body.price,
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
  Bike.remove({ _id: id })
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
