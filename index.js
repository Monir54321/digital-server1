const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const colors = require("colors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const FormData = require("form-data");
const usersRoutes = require("./routes/users.routes");
const bikashInfoOrdersRoutes = require("./routes/bikashInfoOrder.routes");
const orderNIdsRoutes = require("./routes/orderNId.routes");
const bikashPinResetRoutes = require("./routes/bikashPinReset.routes");
const callListOrdersRoutes = require("./routes/callListOrder.routes");
const birthCertificateFixRoutes = require("./routes/birthCertificateFix.routes");
const biometricOrderRoutes = require("./routes/biometricOrder.routes");
const nogodInfoOrderRoutes = require("./routes/nogodInfoOrder.routes");
const onlineBirthCertificateRoutes = require("./routes/onlineBirthCertificate.routes");
const rechargesRoutes = require("./routes/recharge.routes");
const saftyTikaRoutes = require("./routes/saftyTika.routes");
const serverCopysRoutes = require("./routes/serverCopy.routes");
const bikashPaymentRoutes = require("./routes/bkashPayment.routes");
const nidMakeRoutes = require("./routes/nidMake.routes");
const priceListRoutes = require("./routes/priceList.routes");
const signCopyRoutes = require("./routes/signCopy.routes");
const manageOrderButtonRoutes = require("./routes/manageOrderButton.routes");
const nameAddressesLostIdRoutes = require("./routes/nameAddressesLostId.routes");
const authRoutes = require("./routes/auth.route");
const protectedRoutes = require("./routes/protected.routes");
const whatsAppOrderRoutes = require("./routes/whatsappOrder.routes");
const sellerRoutes = require("./routes/seller.routes");
const router = require("./routes/order.routes");
const whatsAppWebhookRoutes = require("./routes/whatsappWebhook.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const automationRoutes = require("./routes/automation.routes");
const orderRoutes = require("./routes/order.routes");
const { default: axios } = require("axios");
const User = require("./models/User");
const PriceList = require("./models/PriceList");
const CallListOrder = require("./models/CallListOrder");
const bodyParser = require("body-parser");
require("./bot/whatsapp");
const fs = require("fs");
const path = require("path");
const formatAddress = require("./utils/formatAddress");


app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use("/files", express.static("files"));

// Connecting to the database

const startBot = require("./bot/whatsapp");

// ✅ Connect mongoose here
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected!");
    return startBot();
  })
  .then(() => {
    console.log("🚀 WhatsApp bot started successfully!");
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });


app.get("/", (req, res) => {
  const bkash_username = process.env.bkash_username;
  res.send(bkash_username);
});

// Test bKash authentication endpoint
app.get("/test-bkash-auth", async (req, res) => {
  try {
    console.log("Testing bKash authentication...");
    console.log("Environment variables:");
    console.log("bkash_username:", process.env.bkash_username);
    console.log("bkash_api_key:", process.env.bkash_api_key);
    console.log("bkash_secret_key:", process.env.bkash_secret_key);
    console.log("bkash_grant_token_url:", process.env.bkash_grant_token_url);

    const tokenHeaders = require("./utils/tokenHeaders");
    const headers = tokenHeaders();
    console.log("Token headers:", headers);

    const requestBody = {
      app_key: process.env.bkash_api_key || "hMTrG0l4tCAVZYAxBihvbiKvtc",
      app_secret:
        process.env.bkash_secret_key ||
        "iEXYSI99xwn9SA2LFiEnQed5nUukuwscFqoTcJH8GCIsnA5LtOJx",
    };

    const grantTokenUrl =
      process.env.bkash_grant_token_url ||
      "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant";

    const response = await fetch(grantTokenUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    res.json({
      status: response.status,
      statusText: response.statusText,
      result: result,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error) {
    console.error("Test auth error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Set up multer for file upload
const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const uploadPdf = multer({ storage: storage });

app.delete("/delete-file/:fileName", async (req, res) => {
  const { fileName } = req.params;
  // Build the full file path
  const filePath = path.join("files", fileName);
  console.log("filepath", filePath); // Adjust the path as needed

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }

    // If the file exists, delete it
    fs.unlink(filePath, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to delete file", error: err });
      }
      res.status(200).json({ message: "File deleted successfully" });
    });
  });
});

// return user balance
app.patch("/return-balance/:email", async (req, res) => {
  const email = req.params.email;
  const amount = req.body.amount;

  console.log("amount", amount, email);

  try {
    const result = await User.findOneAndUpdate(
      { email: email },
      { $inc: { amount: amount } },
      { new: true }
    );
  } catch (error) {}
});

app.post("/file-upload", uploadPdf.single("file"), async (req, res) => {
  console.log("hit");
  const fileName = req.file.filename;
  try {
    await CallListOrder.create({ pdf: fileName });
  } catch (error) {}
});

app.post("/upload-pdf", upload.single("pdf_file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Create a new FormData instance and append the file
    const formData = new FormData();
    formData.append(
      "pdf_file",
      fs.createReadStream(file.path),
      file.originalname
    );

    // Make the request to the external API
    const response = await axios.post(
      "https://eservicecenter.xyz/ext/amarkhota?type=C",

      formData,
      {
        headers: {
          ...formData.getHeaders(), // Include the headers generated by FormData
        },
      }
    );

    // Cleanup the uploaded file from the server
    fs.unlinkSync(file.path);
    res.json(response.data);
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).send("Something went wrong.");
  }
});
// app.post("/upload-pdf", upload.single("file"), async (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   try {
//     // Create a new FormData instance and append the file
//     const formData = new FormData();
//     formData.append(
//       "file",
//       fs.createReadStream(file.path),
//       file.originalname
//     );

//     // Make the request to the external API
//     const response = await axios.post(
//       "https://parser.smartshebaa.com/api/parse-pdf/",

//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(), // Include the headers generated by FormData
//         },
//       }
//     );

//     // Cleanup the uploaded file from the server
//     fs.unlinkSync(file.path);
//     // Send the response from the external API back to the client
//     const images = response?.data?.images
//     if (images.length >= 2) {
//       response?.data?.data?.push({ nidImg: images[0] }) // Push first image as nidImg
//       response?.data?.data?.push({ signatureImg: images[1] }) // Push second image as signatureImg
//     }
//     const address = formatAddress(response?.data?.data)
//     response.data?.data?.push(
//       {
//         location: address,
//       },
//       { present: address },
//       { permanent: address },
//     )
//     res.status(200).send(response.data)
//   } catch (error) {
//     console.error("Error uploading file:", error.message);
//     res.status(500).send("Something went wrong.");
//   }
// });

app.get("/api/nid", async (req, res) => {
  const { nid, dob } = req.query;
  console.log("this is working");
  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(
      `https://api.taka0nai.com/Json.php?key=MoNiR&pass=MoNiR321&nid=${nid}&dob=${dob}`
      // `https://api.taka0nai.com/Json.php?key=MoNiR&nid=${nid}&dob=${dob}`
      // `https://backup.taka0nai.my.id/Json.php?key=MoNiR&nid=${nid}&dob=${dob}`
    );
    // const response = await fetch(
    //   `https://servercopy.nai0taka.xyz/Json.php?key=MoNiR&nid=${nid}&dob=${dob}`
    // );

    const data = await response.json();
    if (data?.message === "সার্ভারে খুঁজে পাওয়া যায়নি" || !data?.nationalId) {
      // throw new Error("সার্ভারে খুঁজে পাওয়া যায়নি");
      return res.json({
        message: "সার্ভারে খুঁজে পাওয়া যায়নি",
        success: false,
      });
    }

    if (data?.nationalId) {
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// app.get("/channelTwo", async (req, res) => {
//   // console.log("hit channelTwo");
//   const { nid, dob } = req.query;
//   // console.log("query", nid, dob);
//   try {
//     const fetch = (await import("node-fetch")).default;

//     const response = await fetch(
//       `https://osmiumworld.xyz/Api/?n=${nid}&d=${dob}`
//     );

//     // const apiResponse2 = await response.json();
//     const apiResponse2 = {
//       code: 200,
//       status: true,
//       message: "তথ্য সফলভাবে পাওয়া গেছে..!",
//       data: {
//         requestId: "8acee922-9722-42e3-8fb8-03f7562398ff",
//         nationalId: "6023633537",
//         dateOfBirth: "2002-11-10",
//         nameBangla: "লামিয়া বেগম",
//         nameEnglish: "LAMIA BEGUM",
//         motherName: "ফাতেমা বেগম",
//         motherNid: "0616213054926",
//         fatherName: "মোঃ জালাল আকন",
//         fatherNid: "4628626790",
//         spouse: "মোঃ আল আমিন",
//         gender: "female",
//         bloodGroup: "O+",
//         voterArea: "খান সড়ক",
//         voterAreaCode: "060354",
//         religion: null,
//         birthPlace: "বরিশাল",
//         photo: "https://example.com/servercopy/images/6023633537.png",
//         permanentAddress: {
//           division: "বরিশাল",
//           district: "বরিশাল",
//           region: "বরিশাল",
//           rmo: "1",
//           upozila: "মেহেন্দীগঞ্জ",
//           postOffice: "শ্রীপুর",
//           postCode: "৮২৭৪",
//           unionOrWard: "শ্রীপুর",
//           mouzaOrMoholla: "বাহেরচর",
//           villageOrRoad: "বাহেরচর",
//           houseOrHoldingNo: "-",
//           addressLine:
//             "বাসা/হোল্ডিং: -, গ্রাম/রাস্তা: বাহেরচর, মৌজা/মহল্লা: বাহেরচর, ইউনিয়ন ওয়ার্ড: শ্রীপুর, ডাকঘর: শ্রীপুর - ৮২৭৪, উপজেলা: মেহেন্দীগঞ্জ, জেলা: বরিশাল, বিভাগ: বরিশাল",
//         },
//         presentAddress: {
//           division: "বরিশাল",
//           district: "বরিশাল",
//           region: "বরিশাল",
//           rmo: "9",
//           upozila: "বরিশাল সদর",
//           postOffice: "বরিশাল সদর",
//           postCode: "৮২০০",
//           unionOrWard: "ওয়ার্ড নং-১৩",
//           mouzaOrMoholla: "",
//           villageOrRoad: "দক্ষিন আলেকান্দা, খান সড়ক",
//           houseOrHoldingNo: "৯৭৫",
//           addressLine:
//             "বাসা/হোল্ডিং: ৯৭৫, গ্রাম/রাস্তা: দক্ষিন আলেকান্দা, খান সড়ক, মৌজা/মহল্লা: বগুড়া আলেকান্দা, ইউনিয়ন ওয়ার্ড: ওয়ার্ড নং-১৩, ডাকঘর: বরিশাল সদর - ৮২০০, উপজেলা: বরিশাল সদর, জেলা: বরিশাল, বিভাগ: বরিশাল",
//         },
//       },
//       Developer: "HIDDEN ARMY 1337",
//       System: "SERVER COPY API",
//     };

//     if (
//       apiResponse2?.message !== "Success" ||
//       !apiResponse2?.data?.nationalId ||
//       apiResponse2?.status == 0
//     ) {
//       // throw new Error("সার্ভারে খুঁজে পাওয়া যায়নি");
//       return res.json({
//         message: "সার্ভারে খুঁজে পাওয়া যায়নি",
//         success: false,
//       });
//     }

//     const channelTwoData = {
//       nameBangla: apiResponse2.data.name,
//       nameEnglish: apiResponse2.data.nameEn,
//       dateOfBirth: new Date(apiResponse2.data.dateOfBirth).toLocaleDateString(
//         "en-GB",
//         {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }
//       ), // Converts date to "03 Jun 2000" format
//       dateOfToday: new Date().toLocaleDateString("bn-BD", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }), // Current date in Bangla
//       nationalId: apiResponse2.data.nationalId,
//       pin: apiResponse2.data.pin,
//       voterNumber: apiResponse2.data.voter_no,
//       voterSlNo: apiResponse2.data.sl_no,
//       voterAreaCode: apiResponse2.data.voterAreaCode,
//       gender: apiResponse2.data.gender,
//       genderBn: apiResponse2.data.gender === "male" ? "পুরুষ" : "মহিলা", // Gender in Bangla
//       occupation: apiResponse2.data.profession,
//       occupationEn: apiResponse2.data.profession === "কৃষক" ? "FARMER" : "", // Map profession to English
//       religion: apiResponse2.data.religion,
//       bloodGroup: apiResponse2.data.bloodGroup,
//       fatherName: apiResponse2.data.father,
//       fatherNameEn: "FOYSUL ALAM", // Translating for consistency
//       nidFather: apiResponse2.data.nidFather,
//       motherName: apiResponse2.data.mother,
//       motherNameEn: "HADICHA BEGUM", // Translating for consistency
//       nidMother: apiResponse2.data.nidMother,
//       spouseName: apiResponse2.data.spouse,
//       spouseNameEn: apiResponse2.data.spouse,

//       // Present Address
//       presentHomeOrHoldingNo: apiResponse2.data.presentAddress.homeHolding,
//       presentAdditionalVillageOrRoad:
//         apiResponse2.data.presentAddress.villageOrRoad,
//       presentMouzaOrMoholla: apiResponse2.data.presentAddress.mouzaMoholla,
//       presentAdditionalMouzaOrMoholla: "", // Not provided in second API
//       presentWardForUnionPorishod:
//         apiResponse2.data.presentAddress.wardForUnionPorishod,
//       presentPostalCode: apiResponse2.data.presentAddress.postalCode,
//       presentPostOffice: apiResponse2.data.presentAddress.postOffice,
//       presentUnionOrWard: apiResponse2.data.presentAddress.unionOrWard,
//       presentUpozila: apiResponse2.data.presentAddress.upozila,
//       presentCityCorporationOrMunicipality: "", // Not provided
//       presentRmo: apiResponse2.data.presentAddress.rmo,
//       presentDistrict: apiResponse2.data.presentAddress.district,
//       presentDivision: apiResponse2.data.presentAddress.division,
//       presentRegion: apiResponse2.data.presentAddress.region,

//       // Permanent Address
//       permanentHomeOrHoldingNo: apiResponse2.data.permanentAddress.homeHolding,
//       permanentAdditionalVillageOrRoad:
//         apiResponse2.data.permanentAddress.villageOrRoad,
//       permanentMouzaOrMoholla: apiResponse2.data.permanentAddress.mouzaMoholla,
//       permanentAdditionalMouzaOrMoholla: "", // Not provided
//       permanentWardForUnionPorishod:
//         apiResponse2.data.permanentAddress.wardForUnionPorishod,
//       permanentPostalCode: apiResponse2.data.permanentAddress.postalCode,
//       permanentPostOffice: apiResponse2.data.permanentAddress.postOffice,
//       permanentUnionOrWard: apiResponse2.data.permanentAddress.unionOrWard,
//       permanentUpozila: apiResponse2.data.permanentAddress.upozila,
//       permanentCityCorporationOrMunicipality: "", // Not provided
//       permanentRmo: apiResponse2.data.permanentAddress.rmo,
//       permanentDistrict: apiResponse2.data.permanentAddress.district,
//       permanentDivision: apiResponse2.data.permanentAddress.division,
//       permanentRegion: apiResponse2.data.permanentAddress.region,
//       photo: apiResponse2.data.photo,
//     };

//     if (apiResponse2?.data?.nationalId) {
//       res.json(channelTwoData);
//     }
//   } catch (error) {
//     console.log("object error: ", error);
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// });
app.get("/image-proxy/:filename", async (req, res) => {
  const fetch = (await import("node-fetch")).default;
  const { filename } = req.params;

  try {
    const response = await fetch(`https://apisell24.fun/images/${filename}`);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.setHeader("Content-Type", contentType);
    const buffer = await response.buffer();
    res.send(buffer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Image fetch failed", error: error.message });
  }
});

// sell api of channel two

app.get("/server-copy", async (req, res) => {
  const { nid, dob, key } = req.query;
  if (key !== "sunny2025") {
    return res.json({
      message: "আপনি ভুল এপিআই কি দিয়েছেন",
      success: false,
    });
  }
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(
    `https://apisell24.fun/server-copy/sv.php?key=BFT-u3SuTZ6pA6AB&nid=${nid}&dob=${dob}`
  );

  const apiResponse2 = await response.json();
  const result = apiResponse2?.data;
  // Image URL proxy করে পরিবর্তন করছি
  if (result?.photo) {
    const imageName = result.photo.split("/").pop(); // ফাইল নামটি বের করলাম
    result.photo = `https://digital-server1.onrender.com/image-proxy/${imageName}`;
  }
  result.requestId = key;
  res.json(result);
});

app.get("/channelTwo", async (req, res) => {
  const { nid, dob } = req.query;
  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(
      `https://apisell24.fun/server-copy/sv.php?key=BFT-u3SuTZ6pA6AB&nid=${nid}&dob=${dob}`
      // `http://apisell24.store/server-copy/sv.php?key=BFT-u3SuTZ6pA6AB&nid=${nid}&dob=${dob}`
      // `http://blackfiretools.my.id/server-copy/sv.php?key=BFT-s6JnD82xknfS&nid=${nid}&dob=${dob}`
      // `https://api.blackfiretools.my.id/server/MONIR.php?key=742545&nid=${nid}&dob=${dob}`
      // `https://api.blackfiretools.my.id/server/MONIR.php?key=MONIR&nid=${nid}&dob=${dob}`
      // `https://api.blackfiretools.my.id/server/sell1.php?nid=${nid}&dob=${dob}`
    );

    const apiResponse2 = await response.json();

    if (apiResponse2?.code !== 200 || !apiResponse2?.data?.nationalId) {
      return res.json({
        message: "সার্ভারে খুঁজে পাওয়া যায়নি",
        success: false,
      });
    }
    if (apiResponse2?.data?.genderEnglish) {
      apiResponse2.data.gender =
        apiResponse2.data.genderEnglish === "Unknown"
          ? "Male/Female"
          : apiResponse2.data.genderEnglish;
      delete apiResponse2.data.genderEnglish;
    }
    const result = apiResponse2?.data;
    // const channelTwoData = {
    //   nameBangla: result.nameBangla,
    //   nameEnglish: result.nameEnglish,
    //   dateOfBirth: new Date(result.dateOfBirth).toLocaleDateString("en-GB", {
    //     day: "2-digit",
    //     month: "short",
    //     year: "numeric",
    //   }),
    //   dateOfToday: new Date(result.dateOfToday).toLocaleDateString("bn-BD", {
    //     day: "2-digit",
    //     month: "2-digit",
    //     year: "numeric",
    //   }),
    //   nationalId: result.nationalId,
    //   pin: result.pin,
    //   voterNumber: result.voterArea,
    //   voterSlNo: result.sl_no,
    //   voterAreaCode: result.voterAreaCode || "", // Add default if not provided
    //   gender: result.genderEnglish,
    //   genderBn: result.genderBangla,
    //   occupation: result.occupationBangla,
    //   occupationEn: result.occupationEnglish,
    //   religion: result.religion || "", // Add default if not provided
    //   bloodGroup: result.bloodGroup,
    //   fatherName: result.fatherName,
    //   fatherNameEn: "FOYSUL ALAM", // Placeholder
    //   nidFather: "", // Not provided
    //   motherName: result.motherName,
    //   motherNameEn: "HADICHA BEGUM", // Placeholder
    //   nidMother: "", // Not provided
    //   spouseName: result.spouse,
    //   spouseNameEn: result.spouse,

    //   // Present Address
    //   presentHomeOrHoldingNo: result.presentHouseHolding,
    //   presentAdditionalVillageOrRoad: "",
    //   presentMouzaOrMoholla: result.presentMouzaMoholla,
    //   presentAdditionalMouzaOrMoholla: "",
    //   presentWardForUnionPorishod: "",
    //   presentPostalCode: "", // Not provided
    //   presentPostOffice: "", // Not provided
    //   presentUnionOrWard: "",
    //   presentUpozila: result.presentUpozila,
    //   presentCityCorporationOrMunicipality: "",
    //   presentRmo: "",
    //   presentDistrict: result.presentDistrict,
    //   presentDivision: result.presentDivision,
    //   presentRegion: "",
    //   presentFullAddress:result.presentFullAddress,

    //   // Permanent Address
    //   permanentHomeOrHoldingNo: result.permanentHouseHolding,
    //   permanentAdditionalVillageOrRoad: "",
    //   permanentMouzaOrMoholla: result.permanentMouzaMoholla,
    //   permanentAdditionalMouzaOrMoholla: "",
    //   permanentWardForUnionPorishod: "",
    //   permanentPostalCode: "", // Not provided
    //   permanentPostOffice: "", // Not provided
    //   permanentUnionOrWard: "",
    //   permanentUpozila: result.permanentUpozila,
    //   permanentCityCorporationOrMunicipality: "",
    //   permanentRmo: "",
    //   permanentDistrict: result.permanentDistrict,
    //   permanentDivision: result.permanentDivision,
    //   permanentRegion: "",
    //   photo: result.photo,
    //   permanentFullAddress:result.permanentFullAddress
    // };

    res.json(result);
  } catch (error) {
    console.log("object error: ", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/nid2", async (req, res) => {
  const { nid, dob } = req.query;
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `https://api.rafixt.xyz/server.php?nid=${nid}&dob=${dob}`
    );
    const data = await response.json();
    // console.log("data", data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// api for reduce amount for auto nid
app.post("/autoNid", async (req, res) => {
  console.log("req autoNid ", req?.body);
  const data = req.body;
  // Validate input
  if (!data || !data.email) {
    return res
      .status(400)
      .json({ error: "Invalid request: Email is required." });
  }

  try {
    const isExistUser = await User.findOne({ email: data.email });

    console.log("isExistUser auto nid ", isExistUser);

    if (!isExistUser) {
      return res.status(404).json({ error: "User does not exist." });
    }

    const priceList = await PriceList.find();
    console.log("price list", priceList);
    if (priceList.length === 0) {
      return res.status(404).json({ error: "Price list is empty." });
    }

    const price = priceList[0]?.autoNid;
    console.log("auto nid price", price);

    const amount = isExistUser?.amount;

    if (amount < price) {
      return res.status(400).json({ error: "Insufficient funds." });
    }

    await User.updateOne(
      { email: data.email },
      { $inc: { amount: -price } },
      { new: true }
    );

    res.status(200).json({
      message: "User amount updated successfully.",
      status: "Success",
    });
  } catch (error) {
    console.error("Error creating auto nid:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.use("/signCopy", signCopyRoutes);
app.use("/priceList", priceListRoutes);
app.use("/api/bkash", bikashPaymentRoutes);
app.use("/users", usersRoutes);
app.use("/bikashInfoOrders", bikashInfoOrdersRoutes);
app.use("/nogodInfoOrders", nogodInfoOrderRoutes);
app.use("/orderNIds", orderNIdsRoutes);
app.use("/bikashPinResets", bikashPinResetRoutes);
app.use("/callListOrders", callListOrdersRoutes);
app.use("/birthCertificateFixs", birthCertificateFixRoutes);
app.use("/biometricOrders", biometricOrderRoutes);
app.use("/onlineBirthCertificates", onlineBirthCertificateRoutes);
app.use("/bkash", rechargesRoutes);
app.use("/saftyTikas", saftyTikaRoutes);
app.use("/serverCopys", serverCopysRoutes);
app.use("/nidMakes", nidMakeRoutes);
app.use("/manage-order-button", manageOrderButtonRoutes);
app.use("/nameAddressesLostId", nameAddressesLostIdRoutes);
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/whatsapp-orders", whatsAppOrderRoutes);
app.use("/sellers", sellerRoutes);
app.use("/whatsapp-webhook", whatsAppWebhookRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/automation", automationRoutes);
app.use("/orders", orderRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
