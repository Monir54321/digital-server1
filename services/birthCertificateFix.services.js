const BirthCertificateFix = require("../models/BirthCertificateFix")

exports.createNewBirthCertificateFixService = async (data) => {
    const result = await BirthCertificateFix.create(data);

    return result;
}

exports.getAllBirthCertificateFixService = async () => {
    const result = await BirthCertificateFix.find({});
    return result;
}

exports.getABirthCertificateFixService = async (_id) => {
    const result = await BirthCertificateFix.findOne({ _id });
    return result;
}
exports.getABirthCertificateFixDataByEmailService = async (email) => {
    const result = await BirthCertificateFix.find({ email });
    return result;
}

// Update
exports.updateABirthCertificateFixService = async ({_id, data}) => {
    const result = await BirthCertificateFix.updateOne({ _id }, { $set: { ...data } }, { upsert: true });
    return result;
}

// delete
exports.deleteABirthCertificateFixService = async (_id) => {
    const result = await BirthCertificateFix.deleteOne({ _id });
    return result;
}