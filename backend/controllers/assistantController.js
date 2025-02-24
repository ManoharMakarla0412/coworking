const https = require('https');
const User = require('../models/userModel');
const Assistant = require('../models/assistantModel')
const { createAssistantAPI } = require('../utils/apiClient')

// Create Assistant API
const createAssistant = async (req, res) => {
  try {
    // Extract necessary fields from the request body
    const { firstMessage, modelProvider, modelName, content, knowledgeBaseUrl, endCallMessage,messages, name, toolIds } = req.body;

    const userId = req.user.id;  // Assume the user is authenticated via JWT

    // Check if user already has an assistant
    const user = await User.findById(userId);
    if (user.assistant) {
      return res.status(400).json({ error: 'You have already created an assistant' });
    }

    // Ensure message content is not too large
    if (content.length > 100000000) {
      return res.status(400).json({ error: 'Content is too large' });
    }

    // Call the API to create the assistant
    const response = await createAssistantAPI(firstMessage, modelProvider, modelName, messages, knowledgeBaseUrl, endCallMessage, name, toolIds);
    res.status(200).json({ message: 'Assistant created successfully', response });
  } catch (error) {
    console.error('Error creating assistant:', error);
    res.status(500).json({ error: 'Failed to create assistant' });
  }
};


// Get Assistant API
const getAssistant = async (req, res) => {
  try {
    // VAPI API endpoint to list assistants
    const options = {
      hostname: 'api.vapi.ai',
      path: '/assistant', // Endpoint for listing assistants
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_TOKEN}`, // Your VAPI token
        'Content-Type': 'application/json',
      },
    };

    // Make the HTTPS request
    const vapiRequest = https.request(options, (vapiResponse) => {
      let responseData = '';

      // Collect data chunks
      vapiResponse.on('data', (chunk) => {
        responseData += chunk;
      });

      // Handle the complete response
      vapiResponse.on('end', () => {
        try {
          // Parse and send the response back to the client
          const vapiData = JSON.parse(responseData);
          if (vapiResponse.statusCode === 200) {
            res.status(200).json(vapiData);
          } else {
            console.error('VAPI API error:', vapiData);
            res.status(vapiResponse.statusCode).json({ error: vapiData });
          }
        } catch (err) {
          console.error('Error parsing VAPI response:', err);
          res.status(500).json({ error: 'Failed to parse VAPI response' });
        }
      });
    });

    // Handle request errors
    vapiRequest.on('error', (error) => {
      console.error('Error fetching assistants from VAPI:', error);
      res.status(500).json({ error: 'Failed to retrieve assistants from VAPI' });
    });

    // End the request
    vapiRequest.end();
  } catch (error) {
    console.error('Error in getAssistant API:', error);
    res.status(500).json({ error: 'Failed to retrieve assistants' });
  }
};

const updateAssistant = async () => {
  const assistantId = "5798ddb9-ad7b-44e1-a07a-2ddf6b65de24"; // Replace with your assistant ID
  const apiUrl = `https://api.vapi.ai/assistant/${assistantId}`;

  const updatedTool = {
    type: "make",
    metadata: {
      scenarioId: 0,
      triggerHookId: 0,
    },
    function: {
      strict: false,
      name: "AppointmentBooking",
      description: "An appointment booking event for meetings",
      parameters: {
        type: "object",
        properties: {
          additionalProp1: {
            type: "string",
            description: "string",
            required: ["string"],
          },
          additionalProp2: {
            type: "string",
            description: "string",
            required: ["string"],
          },
          additionalProp3: {
            type: "string",
            description: "string",
            required: ["string"],
          },
        },
        required: ["string"],
      },
    },
    server: {
      timeoutSeconds: 20,
      url: "https://hook.us2.make.com/vhdou3ejrtbha9gs7fheoss71137nnlk",
      secret: "praveenkumartalari",
      headers: {},
    },
  };

  const updatedAssistantData = {
    id: assistantId,
    name: "Mary",
    voice: {
      voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d",
      provider: "cartesia",
    },
    model: {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a voice assistant for Mary's Dental, a dental office located at 123 North Face Place, Anaheim, California. The hours are 8 AM to 5PM daily, but they are closed on Sundays.\n\nMary's dental provides dental services to the local Anaheim community. The practicing dentist is Dr. Mary Smith.\n\nYou are tasked with answering questions about the business, and booking appointments. If they wish to book an appointment, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:\n\n1. Ask for their full name.\n2. Ask for the purpose of their appointment.\n3. Request their preferred date and time for the appointment.\n4. Confirm all details with the caller, including the date and time of the appointment.\n\n- Be sure to be kind of funny and witty!\n- Keep all your responses short and simple. Use casual language, phrases like \"Umm...\", \"Well...\", and \"I mean\" are preferred.\n- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.",
        },
      ],
      provider: "openai",
    },
    recordingEnabled: true,
    firstMessage: "Hello, this is Mary from Mary's Dental. How can I assist you today?",
    voicemailMessage: "Hey this is Mary from Mary's Dental. Please call back when you're available.",
    endCallMessage: "Thank you for contacting Mary's Dental. Have a great day!",
    transcriber: {
      model: "nova-2",
      provider: "deepgram",
    },
    clientMessages: [
      "transcript",
      "hang",
      "function-call",
      "speech-update",
      "metadata",
      "conversation-update",
    ],
    serverMessages: ["end-of-call-report", "status-update", "hang", "function-call"],
    endCallPhrases: ["goodbye", "talk to you soon"],
    modelOutputInMessagesEnabled: false,
    tools: [updatedTool], // Only the "Make" tool is included here
  };

  try {
    const response = await fetch(apiUrl, {
      method: "PUT", // Or PATCH, based on the API documentation
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`, // Replace with your API key
      },
      body: JSON.stringify(updatedAssistantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to update assistant:", errorData);
      return;
    }

    const data = await response.json();
    console.log("Assistant updated successfully:", data);
  } catch (error) {
    console.error("Error updating assistant:", error.message);
  }
};


module.exports = { createAssistant, getAssistant, updateAssistant };
