const Pdf = require('../models/knowledgebaseModel');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

exports.uploadPdf = async (req, res) => {
  try {
    // More detailed file validation
    if (!req.files && !req.file) {
      console.log('Request files:', req.files);
      console.log('Request file:', req.file);
      console.log('Request body:', req.body);
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'No file was uploaded',
        statusCode: 400 
      });
    }

    // Handle both single file and multiple files cases
    const uploadedFile = req.file || req.files.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'File must be provided with key "file"',
        statusCode: 400 
      });
    }

    const fileName = uploadedFile.originalname;
    const fileBuffer = uploadedFile.buffer;

    // Log file details for debugging
    console.log("File Details:", {
      name: fileName,
      size: fileBuffer.length,
      mimetype: uploadedFile.mimetype,
      fieldname: uploadedFile.fieldname
    });

    // Check for empty file
    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Uploaded file is empty',
        statusCode: 400 
      });
    }

    // Create FormData for VAPI
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: uploadedFile.mimetype,
    });

    console.log("Uploading file to VAPI...");

    // Send request to VAPI
    const response = await fetch('https://api.vapi.ai/file', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_TOKEN}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("VAPI Upload Error:", errorData);
      return res.status(response.status).json({ 
        error: 'Failed to upload to VAPI', 
        details: errorData 
      });
    }

    const result = await response.json();

    // Save the metadata in MongoDB
    const newPdf = new Pdf({
      name: fileName,
      url: result.fileUrl || '',
    });
    await newPdf.save();

    res.status(201).json({
      message: 'PDF uploaded successfully',
      pdf: newPdf,
      vapiResponse: result,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ 
      error: 'An error occurred', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.status(200).json(pdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};