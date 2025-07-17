

const axios = require("axios");
const { parseStringPromise } = require("xml2js");

console.log("from job services, 3333")
async function fetchJobsFromXML(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/rss+xml, application/xml",
      },
    });

    const xml = response.data;

    // Check if response is HTML instead of XML
    if (typeof xml === "string" && xml.trim().startsWith("<html")) {
      console.warn(`⚠️ Skipping invalid feed (HTML received): ${url}`);
      return [];
    }

    const parsed = await parseStringPromise(xml, { explicitArray: false });
    return parsed.rss?.channel?.item || [];
  } catch (err) {
    console.error(`❌ Failed to fetch/parse feed: ${url}`);
    console.error(err.message);
    return [];
  }
}


// utils/fetchXmlFeed.js
// const axios = require('axios');
// const xml2js = require('xml2js');

async function fetchXmlFeed(url) {
  try {
    const { data: xml } = await axios.get(url);
    const result = await xml2js.parseStringPromise(xml, {
      mergeAttrs: true,
      explicitArray: false,
      trim: true,
    });
    return result.rss.channel.item || [];
  } catch (error) {
    console.error(`Error fetching/parsing feed from ${url}`, error);
    return [];
  }
}
module.exports = { fetchJobsFromXML,fetchXmlFeed };

