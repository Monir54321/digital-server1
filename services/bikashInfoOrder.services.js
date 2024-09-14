const BikashInfoOrder = require("../models/BikashInfoOrder");

exports.createNewBikashInfoOrderService = async (data) => {

 

    const result = await BikashInfoOrder.create(data);

    return result;
}

exports.getAllBikashInfoOrderService = async () => {

    const result = await BikashInfoOrder.find({});

    return result;
}

exports.getAUserBikashInfoOrderService = async (_id) => {

    const result = await BikashInfoOrder.findOne({_id});  

    return result;
}
exports.getAUserBikashInfoOrdersDataByEmailService = async (email) => {

    const result = await BikashInfoOrder.find({email});  

    return result;
}

exports.updateAUserBikashInfoOrderService = async ({_id, data}) => {

    const result = await BikashInfoOrder.updateOne({_id}, {$set: {...data}}, {upsert: true});

    return result;
}

exports.deleteAUserBikashInfoOrderService = async (_id) => {

    const result = await BikashInfoOrder.deleteOne({_id});

    return result;
}
