import * as DataTypes from "sequelize";import { sequelize } from "../db.js";import { ROLES } from "../consts/index.js";export const Users = sequelize.define("users", {  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },  email: { type: DataTypes.STRING, unique: true },  password: { type: DataTypes.STRING },  role: { type: DataTypes.STRING, defaultValue: ROLES.USER },});export const Categories = sequelize.define("categories", {  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },  name: { type: DataTypes.STRING, unique: true, allowNull: false },});export const Questions = sequelize.define("questions", {  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },  title: { type: DataTypes.STRING, allowNull: false },  answer: { type: DataTypes.STRING, allowNull: false },});export const UserQuestions = sequelize.define("user_questions", {  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },  successes_in_row: { type: DataTypes.INTEGER, defaultValue: 0 },});Categories.hasMany(Questions, { onDelete: "CASCADE" });Questions.belongsTo(Categories, {  onDelete: "CASCADE",  foreignKey: { name: "categoryId", allowNull: false, field: "category" },  constraints: true,});Questions.belongsToMany(Users, {  through: UserQuestions,  onDelete: "CASCADE",  foreignKey: { name: "questionId", allowNull: false },  constraints: true});Users.belongsToMany(Questions, {  through: UserQuestions,  onDelete: "CASCADE",  foreignKey: { name: "userId", allowNull: false },  constraints: true,});