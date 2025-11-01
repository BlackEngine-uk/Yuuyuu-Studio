import axios from "axios"
import WebSocket from "ws"
import crypto from "crypto"
import "dotenv/config"

const keyBase64 = "Wy0zLCAtMTEyLCAxNSwgLTEyNCwgLTcxLCAzMywgLTg0LCAxMDksIDU3LCAtMTI3LCAxMDcsIC00NiwgMTIyLCA0OCwgODIsIC0xMjYsIDQ3LCA3NiwgLTEyNywgNjUsIDc1LCAxMTMsIC0xMjEsIDg5LCAtNzEsIDUwLCAtODMsIDg2LCA5MiwgLTQ2LCA0OSwgNTZd"
const ivBase64 = "Wzk3LCAxMDksIC0xMDAsIC05MCwgMTIyLCAtMTI0LCAxMSwgLTY5LCAtNDIsIDExNSwgLTU4LCAtNjcsIDQzLCAtNzUsIDMxLCA3NF0="

const decodeBase64ToUint8Array = (base64) => {
    return new Uint8Array(JSON.parse(Buffer.from(base64, "base64").toString()))
};

const key = decodeBase64ToUint8Array(keyBase64);
const iv = decodeBase64ToUint8Array(ivBase64);

console.log("Decoded Key:", key);
console.log("Decoded IV:", iv);

let latestMessageData = null;

async function fetchData() {
  const authToken =
    "Bearer 32ev9m0qggn227ng1rgpbv5j8qllas8uleujji3499g9had6oj7f0ltnvrgi00cq";
  try {
    console.log("Fetching ticket...")
    console.log("Using Authorization Token:", authToken)
    const response = await axios.get("https://api.viewstats.com/ticket", {
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    });
    console.log("Ticket fetched successfully:", response.data);

    const encryptedData = new Uint8Array(response.data);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    );
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      cryptoKey,
      encryptedData,
    );

    console.log("Decrypted Ticket Data:", decryptedData);

    const decodedText = new TextDecoder("utf-8").decode(decryptedData);
    console.log("Decoded Ticket Text:", decodedText);

    if (isValidJSON(decodedText)) {
      const jsonData = JSON.parse(decodedText);
      const { a, b, c } = jsonData.data;

      console.log("Extracted Data:", { a, b, c });

      const decodedId = rot13Decode(a);
      const keyBytes = new Uint8Array(JSON.parse(atob(b)));
      const ivBytes = new Uint8Array(JSON.parse(atob(c)));

      console.log("Decoded ID:", decodedId);
      console.log("Key Bytes:", keyBytes);
      console.log("IV Bytes:", ivBytes);

      const wsUrl = `wss://rtscws.viewstats.com/${decodedId}`;
      const ws = new WebSocket(wsUrl);

      ws.on("message", async (data) => {
        try {
          console.log("WebSocket Message Received:", data);

          const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
          const decryptedMessage = await crypto.subtle.decrypt(
            {
              name: "AES-GCM",
              iv: ivBytes,
            },
            await crypto.subtle.importKey(
              "raw",
              keyBytes,
              { name: "AES-GCM" },
              false,
              ["decrypt"],
            ),
            new Uint8Array(buffer),
          );

          console.log("Decrypted WebSocket Message:", decryptedMessage);

          const decodedMessage = new TextDecoder("utf-8").decode(
            decryptedMessage,
          );
          console.log("Decoded WebSocket Message:", decodedMessage);

          if (isValidJSON(decodedMessage)) {
            const parsedData = JSON.parse(decodedMessage)
            console.log("Parsed Data:", parsedData)
            latestMessageData = parsedData // Update the global variable with the latest data
          };
        } catch (error) {
          console.error("Failed to decode WebSocket message:", error)
        };
      });

      ws.on("close", () => {
        console.log("WebSocket closed. Reconnecting...")
        setTimeout(fetchData, 100)
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error)
      });
    }
  } catch (error) {
    console.error("Error fetching ticket:", error)
  }
};

function isValidJSON(data) {
  try {
    JSON.parse(data);
    return true
  } catch {
    return false
  }
};

function rot13Decode(id) {
  return id
    .split("")
    .map((char) => {
      if (char >= "a" && char <= "m")
        return String.fromCharCode(char.charCodeAt(0) + 13)
      if (char >= "A" && char <= "M")
        return String.fromCharCode(char.charCodeAt(0) + 13)
      if (char >= "n" && char <= "z")
        return String.fromCharCode(char.charCodeAt(0) - 13)
      if (char >= "N" && char <= "Z")
        return String.fromCharCode(char.charCodeAt(0) - 13)
      return char
    })
    .reverse()
    .join("")
};

fetchData();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();return}

  const waitForData = async (timeoutMs, intervalMs) => {
    const maxTries = Math.floor(timeoutMs / intervalMs);
    for (let i = 0; i < maxTries; i++) {
      if (latestMessageData !== null) {
        return latestMessageData
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
    return null
  };

  const data = await waitForData(5000, 100);
  res.status(200).json({subscriberCount: data.mrbeast, source: "ViewStats"})
}