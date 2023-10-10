import { Categories, UserQuestions, Questions } from "../models/models.js";import { stringToBoolean } from "../utils/index.js";class CategoriesController {  async create(req, res) {    const { name } = req.body;    const category = await Categories.create({ name });    return res.json(category);  }  async update(req, res) {  }  async get(req, res, next) {    const { withQuestions } = req.query;    const isWithQuestions = stringToBoolean(withQuestions);    const categories = await Categories.findAll(      isWithQuestions ? { include: { model: Questions, as: "questions" } } : {}    );    if (!isWithQuestions) {      res.json(categories);      return next();    }    let userQuestions = await UserQuestions.findAll({      where: { userId: req.user.id },      raw: true,    });    const questions = await Questions.findAll({      where: { id: userQuestions.map((uq) => uq.questionId) },      raw: true,    });    userQuestions = userQuestions.map((q) => {      const question = questions.find((qstn) => qstn.id === q.questionId);      return {        id: q.questionId,        successes_in_row: q.successes_in_row,        title: question.title,        answer: question.answer,        categoryId: question.categoryId,      };    });    return res.json(      categories.map((category) => {        const groupedQuestions = userQuestions.filter(          (q) => q.categoryId === category.id        );        return {          id: category.id,          name: category.name,          createdAt: category.createdAt,          updatedAt: category.updatedAt,          questionsCount: {            learned: groupedQuestions.length,            mastered: groupedQuestions.filter((q) => q.successes_in_row >= 5)              .length,            total: category.questions.length,          },        };      })    );  }  async getOne(req, res) {    const { id } = req.params;    const category = await Categories.findOne(      {  where: {id} }    );    res.json(category);  }  async delete(req, res) {}}export const categoriesController = new CategoriesController();