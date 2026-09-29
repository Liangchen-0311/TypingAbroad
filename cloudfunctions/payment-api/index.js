"use strict";

const http = require("node:http");
const cloudbaseModule = require("@cloudbase/js-sdk");
const { AlipaySdk } = require("alipay-sdk");
const { createApplication } = require("./src/app");
const { createStore } = require("./src/store");

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const config = {
  cloudbaseEnvId: required("CLOUDBASE_ENV_ID"),
  cloudbaseApiKey: required("CLOUDBASE_APIKEY"),
  alipayAppId: required("ALIPAY_APP_ID"),
  alipayPrivateKey: required("ALIPAY_APP_PRIVATE_KEY"),
  alipayPublicKey: required("ALIPAY_PUBLIC_KEY"),
  alipaySellerId: process.env.ALIPAY_SELLER_ID?.trim() || "",
  siteUrl: (process.env.SITE_URL?.trim() || "https://typeabroad.com").replace(/\/$/, ""),
};

const cloudbase = cloudbaseModule.default || cloudbaseModule;
const tcb = cloudbase.init({
  env: config.cloudbaseEnvId,
  region: "ap-shanghai",
  accessKey: config.cloudbaseApiKey,
});
const alipay = new AlipaySdk({
  appId: config.alipayAppId,
  privateKey: config.alipayPrivateKey,
  alipayPublicKey: config.alipayPublicKey,
  gateway: "https://openapi.alipay.com/gateway.do",
  signType: "RSA2",
  keyType: "PKCS8",
  timeout: 10000,
  camelcase: true,
});

const application = createApplication({
  store: createStore(tcb.rdb()),
  alipay,
  config,
});

const port = Number(process.env.PORT || 9000);
http.createServer(application).listen(port, "0.0.0.0", () => {
  console.log(`TypeAbroad payment API listening on ${port}`);
});
