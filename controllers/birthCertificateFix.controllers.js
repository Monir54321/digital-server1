const { createNewBirthCertificateFixService, getAllBirthCertificateFixService, getABirthCertificateFixService, updateABirthCertificateFixService, deleteABirthCertificateFixService, getABirthCertificateFixDataByEmailService } = require("../services/birthCertificateFix.services");


exports.createNewBirthCertificateFixControllers = async (req, res) => {
    try {
        const data = req.body;
        const result = await createNewBirthCertificateFixService(data);

        if(result){
            const res = await fetch(`${process.env.backendUrl}/users/bikash`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: result?.email, amount: 900, order: true })
              });
              const data = await res.json();
        }

        res.status(200).send({
            status: "Success",
            message: "Successfully ordered",
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

exports.getAllBirthCertificateFixControllers = async (req, res) => {
    try {
        const result = await getAllBirthCertificateFixService();

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

exports.getABirthCertificateFixControllers = async(req, res) => {
    try {
        const _id = req.params._id;

        const result = await getABirthCertificateFixService(_id);

        res.status(200).send({
            status: "Success",
            message: "Successfully got your data",
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
exports.getABirthCertificateFixDataByEmailControllers = async(req, res) => {
    try {
        const email = req.params.email;

        const result = await getABirthCertificateFixDataByEmailService(email);

        res.status(200).send({
            status: "Success",
            message: "Successfully got your data",
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

exports.updateABirthCertificateFixControllers = async(req, res) => {
    try {
        const _id = req.params._id;
        const data = req.body;

        const result = await updateABirthCertificateFixService({_id, data});


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

exports.deleteABirthCertificateFixControllers = async(req, res) => {
    try {
        const _id = req.params._id;

        const result = await deleteABirthCertificateFixService(_id);

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