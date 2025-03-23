const mapExtractedKeyToFormKey = (key) => {
    const keyMap = {
      "National ID": "idNumber",
      Pin: "pinNumber",
      "Name(Bangla)": "nameBangla",
      "Name(English)": "nameEnglish",
      "Father Name": "fatherNameBangla",
      "Mother Name": "motherName",
      "Spouse Name": "spouseName",
      "Birth Place": "birthLocation",
      "Date of Birth": "dateOfBirth",
      "Blood Group": "bloodGroup",
      "Voter No": "voterNumber",
      "Voter Area": "voterArea",
      Gender: "gender",
      location: "location",
      present: "presentAddress",
      permanent: "permanentAddress",
      // location: "permanentAddress",
    };
  
    return keyMap[key] || null;
  };

  module.exports = mapExtractedKeyToFormKey