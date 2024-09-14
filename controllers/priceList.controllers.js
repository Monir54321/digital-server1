const { createNewPriceListService, getPriceListService, updatePriceListService, getAPriceListService } = require("../services/priceList.services");




exports.createNewPriceListControllers = async (req, res) => {
    try {
        const data = req.body;
        const result = await createNewPriceListService(data);

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

exports.getPriceListControllers = async (req, res) => {
    try {
        const result = await getPriceListService();

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
exports.getAPriceListControllers = async (req, res) => {
    try {
        const _id = req.params._id;
        const result = await getAPriceListService(_id);

        res.status(200).send({
            status: "Success",
            message: "Successfully got data",
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

exports.updatePriceListControllers = async(req, res) => {
    try {
        const _id = req.params._id;
        const data = req.body;
        const result = await updatePriceListService({_id, data});

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
