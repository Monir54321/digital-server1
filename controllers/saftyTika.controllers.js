const { createNewSaftyTikaService, getAllSaftyTikaService, getASaftyTikaService, updateASaftyTikaService, deleteASaftyTikaService, getAUserSaftyTikaDataByEmailService } = require("../services/saftyTika.services");




exports.createNewSaftyTikaControllers = async (req, res) => {
    try {
        const data = req.body;
        const result = await createNewSaftyTikaService(data);

        if (result) {
            const amountRes = await fetch(`${process.env.backendUrl}/priceList/668f76383906559fe7ff631c`);
            const amountData = await amountRes.json();

            const amount = amountData?.data?.saftyTika;



            if (amount) {
                const bRes = await fetch(`${process.env.backendUrl}/users/bikash`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: result?.email, amount, order: true })
                });
                const data = await bRes.json();


                res.status(200).send({
                    status: "Success",
                    message: "Successfully submitted",
                    data: result
                })
            }else{
                res.status(401).send({
                    status: "Failed",
                    message: "Failed to send your request",
                    data: "Amount not found"
                })
            }
        }
    } catch (error) {
        res.status(401).send({
            status: "Failed",
            message: "Failed to send your request",
            data: error.message
        })
    }
}

exports.getAllSaftyTikaControllers = async (req, res) => {
    try {
        const result = await getAllSaftyTikaService();

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

exports.getASaftyTikaControllers = async (req, res) => {
    try {
        const _id = req.params._id;
        const result = await getASaftyTikaService(_id);

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

exports.updateASaftyTikaControllers = async(req, res) => {
    try {
        const _id = req.params._id;
        const data = req.body;
        const result = await updateASaftyTikaService({_id, data});

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

exports.deleteASaftyTikaControllers = async(req, res) => {
    try {
        const _id = req.params._id;

        const result = await deleteASaftyTikaService(_id);

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

exports.getAUserSaftyTikaDataByEmailControllers = async (req, res) => {
    try {
        const email = req.params.email;
        const result = await getAUserSaftyTikaDataByEmailService(email);

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