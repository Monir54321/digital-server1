const OnlineBirthCertificate = require("../models/OnlineBirthCertificate");

// create OnlineBirthCertificate
exports.createNewOnlineBirthCertificateService = async (data) => {
    const result = await OnlineBirthCertificate.create(data);
    return result;
}

// get all OnlineBirthCertificate
exports.getAllOnlineBirthCertificateService = async () => {
    const result = await OnlineBirthCertificate.find({});
    return result;
}

// get a OnlineBirthCertificate
exports.getAOnlineBirthCertificateService = async (_id) => {
    const result = await OnlineBirthCertificate.findOne({_id});
    return result;
}
exports.getAOnlineBirthCertificateDataByEmailService = async (email) => {
    const result = await OnlineBirthCertificate.find({email});
    return result;
}

// update a OnlineBirthCertificate
exports.updateAOnlineBirthCertificateService = async ({_id, data}) => {
    const result = await OnlineBirthCertificate.updateOne({ _id }, { $set: { ...data } }, { upsert: true });
    return result;
}

// delete a OnlineBirthCertificate
exports.deleteAOnlineBirthCertificateService = async (_id) => {
    const result = await OnlineBirthCertificate.deleteOne({_id});
    return result;
}