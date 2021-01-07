const {BusinessPartner, BusinessPartnerAddress, batch, changeset} = require("@sap/cloud-sdk-vdm-business-partner-service");
const {Client, Status} = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const googleAPIKey = process.env['GOOGLE_API_KEY']

const destConfig = {
  "url": process.env.URL,
  "authentication": process.env.Authentication,
  "username": process.env.User,
  "password": process.env.Password,
}


module.exports = { 
  main: async function (event, context) {
    try{
        console.log("received data...");
        console.log(event.data);
        const key = "10100011";
        const response = await getBPAddress(key);
        
        var bpAddress, searchtext, addressCorResult, addressResult, resultsArr = [];
        for(let i = 0; i<response.toBusinessPartnerAddress.length; i++){
            bpAddress = response.toBusinessPartnerAddress[i];
            searchtext = createSearchString(bpAddress);
            addressCorResult = await completeAddress(searchtext);

            if(addressCorrected(addressCorResult, bpAddress)){
                addressResult = BusinessPartnerAddress.builder().fromJson(addressCorResult);
                addressResult.addressId = response.toBusinessPartnerAddress[i].addressId;
                addressResult.businessPartner = response.toBusinessPartnerAddress[i].businessPartner;
                resultsArr.push(addressResult);
            }
        }
        
        //[{"responses":[{"body":{},"httpCode":204}]}]
        if(resultsArr.length > 0){
            return await updateBPAddress(resultsArr);
        }else{
            event.extensions.response.status(200).json({"message": "no corrections were necessary for the addresses.."});
        }
        
    }catch(err){
        console.log("An error occured...");
        console.log(err);
        event.extensions.response.status(200).json({"message": err.message, "error": err});
    }  
  }
}

function addressCorrected(correctedAdd, address){
    for(var key in correctedAdd){ 
        console.log(correctedAdd[key] + " === " + address[key]);

        if(address[key] !== correctedAdd[key]){
            return true;
        }
    }
    return false;
}

async function getBPAddress(key) {
    console.log("Getting BusinessPartner: ", key);
  
    return BusinessPartner.requestBuilder()
        .getByKey(key).select(
        BusinessPartner.BUSINESS_PARTNER,
        BusinessPartner.TO_BUSINESS_PARTNER_ADDRESS.select(
            BusinessPartner.BUSINESS_PARTNER,
            BusinessPartnerAddress.ADDRESS_ID,
            BusinessPartnerAddress.COUNTRY,
            BusinessPartnerAddress.POSTAL_CODE,
            BusinessPartnerAddress.CITY_NAME,
            BusinessPartnerAddress.STREET_NAME,
            BusinessPartnerAddress.HOUSE_NUMBER
        )
    ).execute(destConfig);
}

async function updateBPAddress(addressArr){
    console.log("Updating BusinessPartner address...");
    const updateRequests = addressArr.map(address => BusinessPartnerAddress.requestBuilder().update(address));
    return batch(changeset(...updateRequests)).execute(destConfig);
}

function createSearchString(address) {
    var searchtext = "";
    for (var key in address) {
        if (key !== 'addressId' && key !== 'businessPartner') // ignore addressId and businessPartner
        {
            if ((typeof address[key] !== "function") && (typeof address[key] !== "undefined")) {
                searchtext += " " + address[key];
            }
        }
    }
    return searchtext;
}

async function completeAddress(searchtext) {
    console.log("validating address...");
    console.log("------searchtext------------.");
    console.log(searchtext);
    try {
        var resp =
            await client.geocode({
                params: {
                    key: googleAPIKey,
                    address: searchtext
                },
                timeout: 2000
            })
        } catch(e) {
            throw e.response.data.error_message;
        }   

        if (resp.data.status !== Status.OK) {
            throw `could not geocode address, result ${resp.data.status} received`
        }

        console.log(resp.data);

        var response = {}
        // get address
        resp.data.results[0].address_components.forEach(element => {

            if (isElement(element, "route")) {
                response.streetName = element.long_name;
            } else if (isElement(element, "street_number")) {
                response.houseNumber = element.long_name;
            } else if (isElement(element, "locality")) {
                response.cityName =  element.long_name;
            } else if (isElement(element, "postal_code")) {
                response.postalCode =  element.long_name;
            } else if (isElement(element, "country")) {
                response.country =  element.short_name;
            }
        });
        
        return response;      
}

function isElement(element, targetQualifier) {
    return (element.types.indexOf(targetQualifier) > -1)
}

