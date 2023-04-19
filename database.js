const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

//Creating table where userinfo will contain. 
// Password, encrypts the password and then stores it to the database. 
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(value, salt);
      this.setDataValue("password", hashedPassword);
    },
  },
});

sequelize.sync();

module.exports = { User };
