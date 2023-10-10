import { Questions, Categories } from "../models/models.js";import ApiError from "../error/apiError.js";class QuestionsController {  async create(req, res, next) {    try {      const { title, answer, categoryId } = req.body;      const category = await Categories.findOne({ where: { id: categoryId } });      if (!category)        return next(ApiError.badRequest("Категории не существует"));      const question = await Questions.create({ title, answer, categoryId });      return res.json({        id: question.id,        title: question.title,        answer: question.answer,        createdAt: question.createdAt,        updatedAt: question.updatedAt,        category,      });    } catch (e) {      return next(ApiError.internal());    }  }  async update(req, res, next) {    try {      const {        params: { id },        body: { title, answer, categoryId },      } = req;      const category = await Categories.findOne({        where: { id: categoryId },      });      if (!category)        return next(ApiError.badRequest("Категории не существует"));      const question = await Questions.findOne({ where: { id } });      if (!question) return next(ApiError.badRequest("Вопроса не существует"));      question.title = title;      question.answer = answer;      question.categoryId = categoryId;      await question.save();      return res.json({        id,        title: question.title,        answer: question.answer,        createdAt: question.createdAt,        updatedAt: question.updatedAt,        category,      });    } catch (e) {      return next(ApiError.internal());    }  }  async get(req, res, next) {    try {      const questions = await Questions.findAll({        include: Categories,        attributes: { exclude: "categoryId" },      });      return res.json(questions);    } catch (e) {      return next(ApiError.internal());    }  }  async getOne(req, res, next) {    try {      const { id } = req.params;      const question = await Questions.findOne({        include: Categories,        where: { id },        attributes: { exclude: "categoryId" },      });      if (!question) return next(ApiError.badRequest("Вопроса не существует"));      return res.json(question);    } catch (e) {      return next(ApiError.internal());    }  }  async delete(req, res, next) {    try {      const { id } = req.params;      const questionId = await Questions.destroy({ where: {id} });      if(!questionId) return next(ApiError.badRequest("Вопроса не существует"));      res.status(204).json();    } catch (e) {      return next(ApiError.internal());    }  }}export const questionsController = new QuestionsController();