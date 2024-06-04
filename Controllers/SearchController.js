const express = require("express");
const Spam = require("../Models/SpamModel");
const Users = require("../Models/UserModel");
const Contacts = require("../Models/ContactModel");
const { Op, Sequelize } = require("sequelize");


// function to get all spam numbers
const getAllSpammers = async () => {

  // Find all spam numbers with their counts
  const spammers = await Spam.findAll({
    attributes: [
      "phone",
      [Sequelize.fn("COUNT", Sequelize.col("*")), "spamCount"],
    ],
    group: ["phone"],
  });

  //Create a dictionary of spam numbers with their counts
  const spamNumbersDict = spammers.reduce((dic, spamno) =>
    Object.assign(dic, { [spamno.dataValues.phone]: spamno.dataValues.spamCount }), {});

  return spamNumbersDict;
}


exports.searchByNumber = async (req, res) => {
  const { phone } = req.query;

  if (phone) {
    try {

      var spamDirectory = getAllSpammers();

      const RegUser = await Users.findOne({
        where: { phone: phone },
      });

      // Check if the number belongs to a registered user

      if (RegUser) {

        //check if the login user is in person's contact list
        const contacts = await Contacts.findAll({
          attributes: ["name", "phone"],
          where: { contactOf: RegUser.id, phone: req.user.phone }
        })

        res.json({
          data: [
            {
              name: RegUser.name,
              phone: RegUser.phone,
              isSpam: spamDirectory[RegUser.phone] > 0 ? true : false,
              email: contacts ? RegUser.email : null,  // if login user is in person's contact list show email
            },
          ],
        });
      } else {

        // if user is not registred number get all contacts
        const contacts = await Contacts.findAll({
          attributes: ["name", "phone"],
          where: { phone: phone }
        })

          if (contacts.length > 0) {
            let Result = [];
            contacts.forEach((contact) => {
              Result.push({
                name: contact.dataValues.name,
                phone: contact.dataValues.phone,
                isSpam: spamDirectory[contact.dataValues.phone] > 0 ? true : false,
              });
            });

            res.json({
              Result
            });
          }
          else {

            //check if the number is in spam only
            const spamCount = await Spam.count({
              where: { phone: phone },
            });
            if (spamCount > 0) {
              res.json({
                phone: phone,
                msg: "Phone number is marked spam by " + spamCount + " users",
              });
            } else {
              res.json({ err: "no user found with this number" });
            }
          }
      }
    } catch (error) {
      console.error("Error in search by number:", error);
      res.status(500).json({ error: "Issue occurred" });
    }
  } else {
    res.status(400).json({ err: "Invalid Request. Phone number not provided" });
  }
};

exports.searchByName = async (req, res) => {
  const { name } = req.query;
  if (name) {
    try {
      // Search users whose names start with
      const userStartData = await Users.findAll({
        attributes: ["name", "phone"],
        where: {
          name: {
            [Op.like]: name + "%",
          },
        },
      });



      // Search users whose names contains
      const userContainData = await Users.findAll({
        attributes: ["name", "phone"],
        where: {
          name: {
            [Op.notLike]: name + "%",
            [Op.like]: "%" + name + "%",
          },
        },
      });

      // Search contacts whose names start with
      const contactStartData = await Contacts.findAll({
        attributes: ["name", "phone"],
        where: {
          name: {
            [Op.like]: name + "%",
          },
        },
      });

      // Search contacts whose names contains
      const contactContainData = await Contacts.findAll({
        attributes: ["name", "phone"],
        where: {
          name: {
            [Op.notLike]: name + "%",
            [Op.like]: "%" + name + "%",
          },
        },
      });

      const spamNumbersDict = getAllSpammers();

      // Find all spam numbers with their counts
      // const spammers = await Spam.findAll({
      //   attributes: [
      //     "phone",
      //     [Sequelize.fn("COUNT", Sequelize.col("*")), "spamCount"],
      //   ],
      //   group: ["phone"],
      // });


      // //Create a dictionary of spam numbers with their counts

      // const spamNumbersDict = spammers.reduce((dic, spamno) => Object.assign(dic, { [spamno.dataValues.phone]: spamno.dataValues.spamCount }), {});

      // Merge all user and contact results and get spam like-hood
      let searchResult = [];
      userStartData.forEach((user) => {
        searchResult.push({
          name: user.dataValues.name,
          phone: user.dataValues.phone,
          isSpam: spamNumbersDict[user.dataValues.phone] > 0 ? true : false,
        });
      });

      contactStartData.forEach((contact) => {
        searchResult.push({
          name: contact.dataValues.name,
          phone: contact.dataValues.phone,
          isSpam: spamNumbersDict[contact.dataValues.phone] > 0 ? true : false,
        });
      });

      userContainData.forEach((user) => {

        searchResult.push({
          name: user.dataValues.name,
          phone: user.dataValues.phone,
          isSpam: spamNumbersDict[user.dataValues.phone] > 0 ? true : false,
        });
      });

      contactContainData.forEach((contact) => {
        searchResult.push({
          name: contact.dataValues.name,
          phone: contact.dataValues.phone,
          isSpam: spamNumbersDict[contact.dataValues.phone] > 0 ? true : false,
        });
      });

      res.status(200).json({ results: searchResult });
    } catch (error) {
      console.error("Error in search by name:", error);
      res.status(500).json({ error: "Issue occurred" });
    }
  } else {
    res.status(400).json({ err: "Invalid Request. Name not provided" });
  }
};
