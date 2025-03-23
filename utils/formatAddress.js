const convertToBanglaNumbers = require("./convertToBanglaNumbers")

 const formatAddress = (data) => {
    const findValue = (key) => {
      const item = data.find((obj) => Object.keys(obj)[0] === key)
      return item ? item[key] : null
    }
  
    const homeHolding = findValue('Home/Holding')
    const villageRoad = findValue('Village/Road')
    const postOffice = findValue('Post Office')
    const postalCode = findValue('Postal Code')
    const upozila = findValue('Upozila')
    const district = findValue('District')
  
    const formattedPostalCode = postalCode
      ? convertToBanglaNumbers(postalCode)
      : '-'
  
    return [
      `বাসা/হোল্ডিং: ${homeHolding && homeHolding !== 'NAN' ? homeHolding : '-'}`,
      villageRoad ? `গ্রাম/রাস্তাঃ ${villageRoad}` : 'গ্রাম/রাস্তাঃ -',
      postOffice ? `ডাকঘরঃ ${postOffice}-${formattedPostalCode}` : `ডাকঘরঃ -`,
      upozila ? `উপজেলা: ${upozila}` : 'উপজেলা: -',
      district ? `জেলা: ${district}` : 'জেলা: -',
    ].join(', ')
  }

  module.exports = formatAddress;