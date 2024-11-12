const Contact = require("../models/contactModel");

const addContact = async (req, res) => {
    try {
        const { email, subject, msg } = req.body;

        if (!email || !subject || !msg) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await Contact.create({ email, subject, msg });
        return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error saving contact message:", error.message, error.stack);
        return res.status(500).json({ message: "Message not delivered" });
    }
};



module.exports = addContact;