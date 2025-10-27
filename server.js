// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Your HubSpot details
const HUBSPOT_PORTAL_ID = "244214299";
const HUBSPOT_FORM_ID = "5211285c-2da2-4ee4-84e8-b5e26108450c";

// 🔹 Endpoint to receive form data and send to HubSpot
app.post("/api/hubspot-contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    const hubspotResponse = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: [
            { name: "firstname", value: name },
            { name: "email", value: email },
            { name: "mobilephone", value: phone },
            { name: "message", value: message },
          ],
        }),
      }
    );

    const result = await hubspotResponse.text(); // 👈 capture response text
    console.log("HubSpot response:", result); // 👈 log to terminal

    if (!hubspotResponse.ok) {
      return res.status(400).json({ success: false, error: result });
    }

    res.json({ success: true, message: "Saved to HubSpot CRM", hubspot: result });
  } catch (err) {
    console.error("Error submitting to HubSpot:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(5000, () => console.log("✅ Server running on port 5000"));
