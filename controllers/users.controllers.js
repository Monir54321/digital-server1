const { createNewUserService, getAUserDataService, getAllUsersService, deleteAUserDataServices, updateAUserDataServices, updateAUserBkashPaymentServices } = require("../services/users.services");

exports.createNewUserControllers = async (req, res) => {
    try {
        const user = req.body;

        if (user?.email) {
            
            const result = await createNewUserService(user);

            res.status(200).send({
                status: "Success",
                message: "Successfully created your account",
                data: result
            })

        }else{
            res.status(401).send({
                status: "Failed",
                message: "Failed to create your account",
                data: error.message
            })
        }

    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to create your account",
            data: error.message
        })
    }
}


exports.getAUserDataControllers = async (req, res) => {
    try {
        const email = req?.params?.email;

        const result = await getAUserDataService(email);

        res.status(200).json({
            status: "Success",
            message: "Successfully got the user data",
            data: result
        })

    } catch (error) {
        res.status(404).send({
            status: "Failed",
            message: "Failed to get the user data",
            data: error.message
        })
    }
}

exports.getAllUsersDataControllers = async (req, res) => {
    try {
        
        const result = await getAllUsersService();

        res.status(200).send({
            status: "Success",
            message: "Successfully got all users",
            data: result
        })
    } catch (error) {
        res.status(404).send({
            status: "Failed",
            message: "Failed to get all users",
            data: error.message
        })
    }
}


exports.deleteAUserDataControllers = async (req, res) => {
    try {
        const email = req.params.email;
        const result = await deleteAUserDataServices(email);

        res.status(200).send({
            status: "Success",
            message: "Successfully deleted the user data",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to delete the user data",
            data: error.message
        })
    }
}


exports.updateAUserDataControllers = async (req, res) => {
    try {
        const email = req.params.email;
        const result = await updateAUserDataServices(email, req.body);

        res.status(200).send({
            status: "Success",
            message: "Successfully updated the user data",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to update the user data",
            data: error.message
        })
    }
}
exports.updateAUserBkashPaymentControllers = async (req, res) => {
    try {

        const data = req.body;
        
        if(data?.email && data?.amount){
            if(data?.order){

                const result = await updateAUserBkashPaymentServices({email: data.email, amount: data.amount, order: data.order});
                res.status(200).send({
                    status: "Success",
                    message: "Successfully added money",
                    data: result
                })
            }else {
                const result = await updateAUserBkashPaymentServices({email:  data.email, amount: data.amount});
                res.status(200).send({
                    status: "Success",
                    message: "Successfully added money",
                    data: result
                })
            }
        }
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Something went wrong please try again",
            data: error.message
        })
    }
}