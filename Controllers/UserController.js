const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../Models/UserModel');

// user register method
exports.register = async (req, res) => {

    const { name, phone, password } = req.body; // get requested data

    // Check if required fields are provided
    if (!(name && phone && password)) {
        return res
            .json({ error: "Invalid Request. Required fields not provided" });
    }
    try {
        //check if the user with this phone number exist or not
        const userExists = await Users.findOne({
            where: { phone }
        });

        if (userExists) {
            return res.status(400).send('Phone is already associated with an account');
        }
        // create new user if it does not exist
        var email = req.body.email || null; // Extract email from request body
        await Users.create({
            name,
            phone,
            password: await bcrypt.hash(password, 15),
            email
        });
        return res.status(200).send({ message : 'User Registered Successfully'});
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).send('Issue in registering user');
    }
};

// user login method

exports.login = async (req, res) => {
    try {

        const { phone, password } = req.body; // get requested data
        // Check if required fields are provided
        if (!(phone && password)) {
            return res
                .status(400)
                .json({ err: "Invalid Request. Required fields not provided" });
        }
        //get user with phone numer
        const user = await Users.findOne({
            where: { phone }
        });
        // check if user exists
        if (!user) {
            return res.status(404).json('User not exists with this phone number');
        }
        // Verify password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(404).json('Incorrect phone and password combination');
        }
        // Authenticate user token
        const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRATION
        });

        res.status(200).send({
            message: "Login Successfully",
            accessToken: token,
        });

    } catch (error) {
        return res.status(500).send('Login error');
    }
}
