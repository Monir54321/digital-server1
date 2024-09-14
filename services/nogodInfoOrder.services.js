const NogodInfoOrder = require("../models/NogodInfoOrder");

// create
exports.createNewNogodInfoOrderService = async (data) => {
    const result = await NogodInfoOrder.create(data);
    return result;
}

// get all
exports.getAllNogodInfoOrderService = async () => {
    const result = await NogodInfoOrder.find({});
    return result;
}

// get a
exports.getANogodInfoOrderService = async (_id) => {
    const result = await NogodInfoOrder.findOne({_id});
    return result;
}
exports.getANogodInfoOrderDataByEmailService = async (email) => {
    const result = await NogodInfoOrder.find({email});
    return result;
}

// update a
exports.updateANogodInfoOrderService = async ({_id, data}) => {
    const result = await NogodInfoOrder.updateOne({ _id }, { $set: { ...data } }, { upsert: true });
    return result;
}

// delete a
exports.deleteANogodInfoOrderService = async (_id) => {
    const result = await NogodInfoOrder.deleteOne({ _id });
    return result;
}