// Netlify Function: subscribe.js
// Proxies email subscriptions to Kit (ConvertKit) API
// Env vars needed in Netlify dashboard:
//   KIT_API_SECRET = 6iDMsPq4fHVJ7jPbXh03JsNU1HnikaNkudTyH68Aios
//   KIT_FORM_ID    = (set after creating form in Kit dashboard)

const https = require("https");

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let email;
  try {
    ({ email } = JSON.parse(event.body || "{}"));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  if (!email || !email.includes("@")) {
    return { statusCode: 400, body: JSON.stringify({ error: "Valid email required" }) };
  }

  const apiSecret = process.env.KIT_API_SECRET;
  const formId    = process.env.KIT_FORM_ID;

  if (!apiSecret) {
    console.error("KIT_API_SECRET not set");
    return { statusCode: 500, body: JSON.stringify({ error: "Server misconfiguration" }) };
  }

  try {
    let kitResponse;

    if (formId) {
      // Subscribe via form (preferred — triggers welcome sequence)
      kitResponse = await postToKit(
        `/v3/forms/${formId}/subscribe`,
        { api_secret: apiSecret, email }
      );
    } else {
      // Fallback: create subscriber directly
      kitResponse = await postToKit(
        `/v3/subscribers`,
        { api_secret: apiSecret, email }
      );
    }

    const data = JSON.parse(kitResponse);

    if (data.error) {
      console.error("Kit error:", data.error);
      return { statusCode: 400, body: JSON.stringify({ error: data.error }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, message: "You're on the list!" }),
    };
  } catch (err) {
    console.error("Subscribe error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to subscribe" }) };
  }
};

function postToKit(path, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      hostname: "api.convertkit.com",
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
