const PhoneNumber = require("../models/phonenumberModel");
exports.createPhoneNumber = async (req, res) => {
  const { provider, number, twilioAccountSid, twilioAuthToken, name } = req.body;

  // Validate required fields
  if (!provider || !number || !twilioAccountSid || !twilioAuthToken || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the phone number already exists in the database
    const existingPhoneNumber = await PhoneNumber.findOne({ number });
    if (existingPhoneNumber) {
      return res.status(409).json({ error: "Phone number already exists in the database" });
    }

    // Make API call to VAPI
    const response = await fetch("https://api.vapi.ai/phone-number", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VAPI_TOKEN}`,
      },
      body: JSON.stringify({
        provider,
        number,
        twilioAccountSid,
        twilioAuthToken,
        name,
      }),
    });

    // Parse the response data
    const data = await response.json();

    // Handle non-OK responses from VAPI
    if (!response.ok) {
      // Check for specific error message from VAPI
      if (data.statusCode === 400 && data.message) {
        return res.status(400).json({
          error: "Bad Request",
          message: data.message, // Include the specific error message from VAPI
        });
      }

      // Handle other errors from VAPI
      return res.status(response.status).json({
        error: "Failed to create phone number with VAPI",
        details: data,
      });
    }

    // Save the phone number in the database
    const phoneNumber = new PhoneNumber(data);
    await phoneNumber.save();

    // Return success response
    res.status(201).json({
      message: "Phone number created successfully",
      data: phoneNumber,
    });
  } catch (error) {
    console.error("Error creating phone number:", error.message);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

exports.fetchPhoneNumbers = async (req, res) => {
  try {
    const response = await fetch("https://api.vapi.ai/phone-number", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_TOKEN}`,
      },
    });
    const data = await response.json();

    // Send the phone numbers back to the client
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching phone numbers from VAPI:", error.message);
    res.status(500).json({
      error: "Failed to fetch phone numbers from VAPI.",
      details: error.message,
    });
  }
};
