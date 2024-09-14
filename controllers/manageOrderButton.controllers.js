const manageOrderButtonServices = require("../services/manageOrderButton.services");

const create = async (req, res) => {
  try {
    const data = req.body;
    const result = await manageOrderButtonServices.create(data);

    res.status(200).send({
      status: "Success",
      message: "Successfully create manage order button",
      data: result,
    });
  } catch (error) {
    res.status(401).send({
      status: "Failed",
      message: "Failed to create manage order button",
      data: error.message,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await manageOrderButtonServices.getAll();

    res.status(200).send({
      status: "Success",
      message: "Successfully retrieved all data",
      data: result,
    });
  } catch (error) {
    console.error("Error in getAllBikashInfoOrderControllers:", error);

    res.status(500).send({
      status: "Failed",
      message: "Failed to retrieve data",
      data: error.message,
    });
  }
};

// exports.getAUserBikashInfoOrderControllers = async (req, res) => {
//   try {
//     const _id = req.params._id;
//     const result = await getAUserBikashInfoOrderService(_id);

//     if (!result) {
//       return res.status(404).send({
//         status: "Failed",
//         message: "Data not found",
//       });
//     }

//     res.status(200).send({
//       status: "Success",
//       message: "Successfully retrieved data",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error in getAUserBikashInfoOrderControllers:", error);

//     res.status(500).send({
//       status: "Failed",
//       message: "Failed to retrieve data",
//       data: error.message,
//     });
//   }
// };

// exports.getAUserBikashInfoOrdersDataByEmailControllers = async (req, res) => {
//   try {
//     const email = req.params.email;
//     const result = await getAUserBikashInfoOrdersDataByEmailService(email);

//     if (!result) {
//       return res.status(404).send({
//         status: "Failed",
//         message: "Data not found",
//       });
//     }

//     res.status(200).send({
//       status: "Success",
//       message: "Successfully retrieved data",
//       data: result,
//     });
//   } catch (error) {
//     console.error(
//       "Error in getAUserBikashInfoOrdersDataByEmailControllers:",
//       error
//     );

//     res.status(500).send({
//       status: "Failed",
//       message: "Failed to retrieve data",
//       data: error.message,
//     });
//   }
// };

const updateOne = async (req, res) => {
  try {
    const _id = req.params._id;
    const data = req.body;
    const result = await manageOrderButtonServices.updateOne({ _id, data });

    res.status(200).send({
      status: "Success",
      message: "Successfully updated data",
      data: result,
    });
  } catch (error) {
    console.error("Error in updateAUserBikashInfoOrderControllers:", error);

    res.status(500).send({
      status: "Failed",
      message: "Failed to update data",
      data: error.message,
    });
  }
};

// exports.deleteAUserBikashInfoOrderControllers = async (req, res) => {
//   try {
//     const _id = req.params._id;
//     const result = await deleteAUserBikashInfoOrderService(_id);

//     if (!result) {
//       return res.status(404).send({
//         status: "Failed",
//         message: "Data not found",
//       });
//     }

//     res.status(200).send({
//       status: "Success",
//       message: "Successfully deleted data",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error in deleteAUserBikashInfoOrderControllers:", error);

//     res.status(500).send({
//       status: "Failed",
//       message: "Failed to delete data",
//       data: error.message,
//     });
//   }
// };

module.exports = {
  create,
  getAll,
  updateOne
};
