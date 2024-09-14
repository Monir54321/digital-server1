const SaftyTika = require("../models/SaftyTika");

// create a SaftyTika
exports.createNewSaftyTikaService = async (data) => {
    const result = await SaftyTika.create(data);
    return result;
}

// get all SaftyTika
exports.getAllSaftyTikaService = async () => {
    const result = await SaftyTika.find({});
    return result;
}

// get a SaftyTika
exports.getASaftyTikaService = async (_id) => {
    const result = await SaftyTika.findOne({ _id });
    return result;
}

// update a SaftyTika
exports.updateASaftyTikaService = async ({_id, data}) => {
    const result = await SaftyTika.updateOne({ _id }, { $set: { ...data } }, { upsert: true });
    return result;
}

// delete a SaftyTika
exports.deleteASaftyTikaService = async (_id) => {
    const result = await SaftyTika.deleteOne({ _id });
    return result;
}

exports.getAUserSaftyTikaDataByEmailService = async (email) => {

    const result = await SaftyTika.find({email});  

    return result;
}