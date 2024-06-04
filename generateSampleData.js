const Contact = require("./Models/ContactModel.js");
const Spam = require("./Models/SpamModel.js");
const Users = require("./Models/UserModel.js");

const bcrypt = require('bcryptjs');


// method to generate users random data

const userData = async () => {

  var password = await bcrypt.hash("123456789", 15);

  var data = [
    {
      name: "divyang",
      phone: "8978564512",
      password: password,
      email: "divyang@gmail.com",
    },

    {
      name: "vardhan",
      phone: "5689784512",
      password: password,
      email: "vardhan@gmail.com",
    },

    {
      name: "Dhruvak",
      phone: "12457865252",
      password: password,
      email: "Dhruvak@gmail.com",
    },

    {
      name: "Aarush",
      phone: "1245783214",
      password: password,
      email: "Aarush@gmail.com",
    },

    {
      name: "Bhumika",
      phone: "25789456123",
      password: password,
      email: "Bhumika@gmail.com",
    },
  ]

  await Users.bulkCreate(data, { returning: true });

  contactData();

  spamData();

}

//method to generate contact data
const contactData = async () => {
  // Create contacts for each user
  for (let i = 1; i <= 5; i++) {
    const contacts = [];
    for (let j = 1; j <= 10; j++) {
      parseInt(Math.random().toFixed(10).replace("0.", ""))
      contacts.push(
        {
          name: `name ${i}`,
          phone: parseInt(Math.random().toFixed(10).replace("0.", "")).toString(),
          email: `email${i}@gmail.com`,
          contactOf: `${i}`
        }
      )
    }
    await Contact.bulkCreate(contacts);
  };
}

//method to generate spam data

const spamData = async () => {

  //Create spam numbers
  const spamNumbers = [];
  for (let i = 0; i < 10; i++) {
    // Generate 10 random spam numbers
    spamNumbers.push({
      refId: Math.floor(Math.random() * 5) + 1,  /// generate random number between 1 to 5 which is primary key id of regisetred user
      phone: parseInt(Math.random().toFixed(10).replace("0.", "")).toString(), // generate 10 digit random number
    });
  }
  await Spam.bulkCreate(spamNumbers);

}

const generateRandomData = () => {
  userData();
}


exports.generateRandomData = generateRandomData;


