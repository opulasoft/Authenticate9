const express = require("express"); // Import Express framework
const Contact = require("../Models/ContactModel"); // Import Contact model
const User = require("../Models/UserModel"); // Import User model

// Controller function to add a contact
exports.addContact = async (req, res) => {
  const { name, phone, email } = req.body;

  const { id } = req.user;

  // Check if required fields are provided
  if (!id || !name || !phone) {
    return res
      .status(400)
      .json({ err: "Invalid Request. Required fields not provided" });
  }

  try {
    // Check if the contact already exists
    const contact = await Contact.findOne({
      where: { phone: phone, contactOf: id },
    });

    if (contact) {
      return res.status(400).json({ err: "Contact already exists." });
    }

    // Create a new contact
    await Contact.create({
      contactOf: id,
      name,
      phone,
      email,
    });

    // Send success response
    res.status(200).json({ message: "Contact created." });
  } catch (error) {
    console.error("Error in adding contact info:", error);
    res.status(500).json({ error: "Issue occurred" });
  }
};

// Controller function to get all contacts of a user
exports.fetchContact = async (req, res) => {
  const { id } = req.user;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(400).json({
        error: "Invalid Request.",
      });
    }

    // Get all contacts of the user
    const contacts = await Contact.findAll({ where: { contactOf: id } });

    // Send success response with the list of contacts
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error while fetching contacts:", error);
    res.status(500).json({ error: "Issue occurred" });
  }
};
