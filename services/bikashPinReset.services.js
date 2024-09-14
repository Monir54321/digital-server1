const BikashPinReset = require("../models/BikashPinReset")

exports.createNewBikashPinResetService = async(data) => {
    const result = await BikashPinReset.create(data);

    return result;
}

exports.getAllBikashPinResetService = async() => {
    const result = await BikashPinReset.find({});

    return result;
}

exports.getABikashPinResetService = async(_id) => {
    const result = await BikashPinReset.findOne({_id});

    return result;
}
exports.getABikashPinResetDataByEmailService = async(email) => {
    const result = await BikashPinReset.find({email});

    return result;
}

exports.updateABikashPinResetService = async({_id, data}) => {
    const result = await BikashPinReset.updateOne({_id}, {$set: {...data}}, {upsert: true});

    return result;
}

exports.deleteABikashPinResetService = async(_id) => {
    const result = await BikashPinReset.deleteOne({_id});

    return result;
}