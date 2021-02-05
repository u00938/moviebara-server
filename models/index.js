"use strict";

const fs = require("fs");
const path = require("path");
const { monitorEventLoopDelay } = require("perf_hooks");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const { user, post, scrap, movie } = sequelize.models;

user.hasMany(post);
post.belongsTo(user, { 
  foreignKey: 'user_id', targetKey: 'id'
  });

movie.hasMany(post);
post.belongsTo(movie, { 
  foreignKey: 'movie_id', targetKey: 'id'
  });

user.hasMany(scrap);
scrap.belongsTo(user, { 
  foreignKey: 'user_id', targetKey: 'id'
  });

post.hasMany(scrap);
scrap.belongsTo(post, { 
  foreignKey: 'post_id', targetKey: 'id'
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
