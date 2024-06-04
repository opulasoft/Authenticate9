
const Users = require("../Models/UserModel");
const Spams = require("../Models/SpamModel");
const { Sequelize } = require("sequelize");

exports.addSpam = async (req, res) => {

  const { phone } = req.body; // get reqested data
  const { id } = req.user; // get login user data

  if (!id) {
    return res
      .status(400)
      .json({ err: "Invalid Request. Login Again!" });
  }

  if (!phone) { // validate the required field
    return res
      .status(400)
      .json({ err: "Invalid Request. Required fields not provided" });
  }

  try {
    
    // find user with id
    const user = await Users.findOne({ where: { id: id } }); 

    // check if user exists
    if (!user) {
      return res
        .status(400)
        .json({ err: "Only registered user can create a spam number" });
    }

    // Check if the phone number is already marked as spam by the user

    console.log("uesrs data : ", id )

    const spam = await Spams.findOne({
      where: { refId: id, phone: phone },
    });
    if (spam) {
      return res
        .status(400)
        .json({ err: "you already created spam with this number" });
    }

    // Create a new entry in the Spam table for the phone number
    await Spams.create({  phone: phone, refId: id });

    // Send success response
    return res
      .status(200)
      .json({ message: "spam created successfully" });
  } catch (error) {
    console.error("Error in marking number as spam:", error);
    return res.status(500).json({ error: "Issue occurred" });
  }
};

// method to get all spam numbers reported by a specific user
exports.fetchSpam = async (req, res) => {
  const { id } = req.user; // get login user data

  // Check if user is login
  if (!id) {
    return res
      .status(400)
      .json({ err: "Invalid Request. Login Again!" });
  }

  try {
    // Find the user by id
    const user = await Users.findOne(
      { where: { id: id } });
    // check if user exist
    if (!user) {
      return res
        .status(400)
        .json({ err: "Only Registered Users can view spam numbers" });
    }

    // get all spam number added by login user
    const spammers = await Spams.findAll({attributes: ["phone"]},{ where: { refId: id } }); 

    res.status(200).json(spammers);
  } catch (error) {
    console.error("Error fetching spam numbers:", error);
    res.status(500).json({ error: "Issue occurred" });
  }
};

//method to get all spam numbers
exports.getAllSpammers = async (req, res) => {
  try {

    // get all spam marked by all user with count
    const spammers = await Spams.findAll({
      attributes: [
        "phone",
        [Sequelize.fn("COUNT", Sequelize.col("*")), "noOfUserReported"],
      ],
      group: ["phone"],
    });

    // Send success response with the list of spam numbers and their counts
    res.status(200).json(spammers);
  } catch (error) {
    console.error("Error while fetching spam numbers:", error);
    res.status(500).json({ error: "Issue occurred" });
  }
};

