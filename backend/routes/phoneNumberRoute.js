const express = require("express");
const { createPhoneNumber,fetchPhoneNumbers } = require("../controllers/phoneNumberController");

const router = express.Router();

router.post("/createphonenumber", createPhoneNumber);
router.get("/getphonenumbers", fetchPhoneNumbers);

module.exports = router;
