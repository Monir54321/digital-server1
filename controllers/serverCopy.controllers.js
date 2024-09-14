const { createNewServerCopyService, getAllServerCopyService, getAServerCopyService, updateAServerCopyService, deleteAServerCopyService, getAServerCopyDataByEmailService } = require("../services/serverCopy.services");



exports.createNewServerCopyControllers = async (req, res) => {
    try {
        const data = req.body;
        const result = await createNewServerCopyService(data);

        res.status(200).send({
            status: "Success",
            message: "Successfully submitted",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to send your request",
            data: error.message
        })
    }
}

exports.getAllServerCopyControllers = async (req, res) => {
    try {
        const result = await getAllServerCopyService();

        res.status(200).send({
            status: "Success",
            message: "Successfully get all data",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to get data",
            data: error.message
        })
    }
}

exports.getAServerCopyControllers = async (req, res) => {
    try {
        const _id = req.params._id;
        const result = await getAServerCopyService(_id);

        res.status(200).send({
            status: "Success",
            message: "Successfully got data",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to got data",
            data: error.message
        })
    }
}
exports.getAServerCopyDataByEmailControllers = async (req, res) => {
    try {
        const email = req.params.email;
        const result = await getAServerCopyDataByEmailService(email);

        res.status(200).send({
            status: "Success",
            message: "Successfully got data",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to got data",
            data: error.message
        })
    }
}

exports.updateAServerCopyControllers = async(req, res) => {
    try {
        const _id = req.params._id;
        const data = req.body;
        const result = await updateAServerCopyService({_id, data});

        res.status(200).send({
            status: "Success",
            message: "Successfully updated data",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to update data",
            data: error.message
        })
    }
}

exports.deleteAServerCopyControllers = async(req, res) => {
    try {
        const _id = req.params._id;

        const result = await deleteAServerCopyService(_id);

        res.status(200).send({
            status: "Success",
            message: "Successfully deleted data",
            data: result
        })
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to delete data",
            data: error.message
        })
    }
}