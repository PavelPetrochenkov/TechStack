const mongoose = require("mongoose");

const User = require("../models/user");
const Bike = require("../models/bikes");


exports.user_get_all_my_rented = (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      const response = {
        alreadyRentedBike: docs[0].alreadyRentedBike.map(doc => {
          return {
            idBike: doc.idBike,
            startTimeOfUse: doc.startTimeOfUse,
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

exports.user_get_all_was_rented = (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      const response = {
        wasRentedBike: docs[0].wasRentedBike.map(doc => {
          return {
            idBike: doc.idBike,
            usedTime: doc.usedTime,
            cost:doc.cost,
            isPaid:doc.isPaid,
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

exports.user_add_bike = async (req, res, next) => {
  const id = req.body.bikeId;
  const startTimeOfUse = new Date();
 
  const processedBike = new  Object ({
    idBike: id,
    startTimeOfUse:startTimeOfUse
  });

  await User.findOne({}, { alreadyRentedBike: {$elemMatch:{idBike : id}}}).then(bike => {
    if(!!bike.alreadyRentedBike[0]){
      console.log(err);
      res.status(500).json({
        message: "Bike is exist"
      });
  }else {
    User.updateOne({ }, { $push:{alreadyRentedBike:  processedBike}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Bike added",
    })}).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
    Bike.updateOne({_id:id}, {isRent:true}).exec();
  }})
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_cancel_bike = async (req, res, next) => {
  const id = req.body.bikeId;
  await Bike.updateOne({ _id: id }, { isRent: false });
  const bike = (await Bike.findById(id));
  
  const getBikeUseNow = (await User.findOne({}, { alreadyRentedBike: {$elemMatch:{idBike : id}}}).then(bike => {
    if(!bike.alreadyRentedBike[0]){
      console.log(err);
      res.status(500).json({
        message: "Bike isn't use"
      })}
    return bike.alreadyRentedBike[0];
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Bike isn't use"
    });
  })
  );

  await User.updateOne({}, {"$pull": { "alreadyRentedBike": {"idBike": id} } }).then(bike=>{
    bike
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Bike id is wrong"
    });
  });

  const usedTime =(new Date()-new Date(getBikeUseNow.startTimeOfUse));
  const time = (Math.ceil(usedTime/1000/60/60));
  const cost =(time>=20)?time/2:(time)*bike.price;
  const processedBike = new  Object ({
    idBike: id,
    usedTime:usedTime,
    cost:cost.toFixed(2),
    isPaid:false
  });

  await  User.updateOne({}, { $push:{wasRentedBike:  processedBike}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Bike canceled",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};