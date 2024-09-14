const { createNewOnlineBirthCertificateService, getAllOnlineBirthCertificateService, getAOnlineBirthCertificateService, updateAOnlineBirthCertificateService, deleteAOnlineBirthCertificateService, getAOnlineBirthCertificateDataByEmailService } = require("../services/onlineBirthCertificate.services");




exports.createNewOnlineBirthCertificateControllers = async (req, res) => {
    try {
        const data = req.body;
        const result = await createNewOnlineBirthCertificateService(data);

        if(result){
            const res = await fetch(`${process.env.backendUrl}/users/bikash`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: result?.email, amount: 200, order: true })
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

exports.getAllOnlineBirthCertificateControllers = async (req, res) => {
    try {
        const result = await getAllOnlineBirthCertificateService();

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

exports.getAOnlineBirthCertificateControllers = async(req, res) => {
    try {
        const _id = req.params._id;

        const result = await getAOnlineBirthCertificateService(_id);

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
exports.getAOnlineBirthCertificateDataByEmailControllers = async(req, res) => {
    try {
        const email = req.params.email;

        const result = await getAOnlineBirthCertificateDataByEmailService(email);

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

exports.updateAOnlineBirthCertificateControllers = async(req, res) => {
    try {
        const _id = req.params._id;
        const data = req.body;

        const result = await updateAOnlineBirthCertificateService({_id, data});


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

exports.deleteAOnlineBirthCertificateControllers = async(req, res) => {
    try {
        const _id = req.params._id;

        const result = await deleteAOnlineBirthCertificateService(_id);

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