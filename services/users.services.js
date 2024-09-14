const User = require("../models/User");

exports.createNewUserService = async (data) => {
    const user = await User.create(data);
    return user;
}

exports.getAUserDataService = async (email) => {
    const user = await User.findOne({ email });
    return user;
}


exports.getAllUsersService = async () => {
    const users = await User.find({});
    return users;
}


exports.deleteAUserDataServices = async (email) => {

    return result = await User.deleteOne({ email });
}

exports.updateAUserDataServices = async (email, data) => {

    return result = await User.updateOne({ email }, { $set: { ...data } }, { upsert: true });
}
exports.updateAUserBkashPaymentServices = async (data) => {

    const oldAmount = await User.findOne({ email: data?.email });

    if(data?.order){
        const result = await User.updateOne({ email: data?.email }, { $set: { amount: parseInt(oldAmount?.amount) - parseInt(data?.amount) } }, { upsert: true });
        return result;
    }else{
        const result = await User.updateOne({ email: data?.email }, { $set: { amount: parseInt(oldAmount?.amount) + parseInt(data?.amount) } }, { upsert: true });
        return result;
    }


    
}