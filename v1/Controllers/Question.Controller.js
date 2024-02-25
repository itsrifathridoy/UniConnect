const {questionSchema} = require('../util/validation_schema');
const db = require('../services/db');
const {QuestionModel} = require('../Models/Question.model');
const createError = require('http-errors');
function generateQuestionId() {
    return Math.floor(Math.random() * 1000000);
}


module.exports = {
    create: async (req,res,next) => {
        try {
            const validate = await questionSchema.validateAsync(req.body);
            const question = new QuestionModel(generateQuestionId(),req.user.userID,validate.quesText,validate.imgPath); 
            const result = await question.create(); 
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    update: async (req,res,next) => {
        try {
            const validate = await questionSchema.validateAsync(req.body);
            const result = await QuestionModel.update(validate,req.query.quesID);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    delete: async (req,res,next) => {
        try {
            const doesExist = await QuestionModel.get(req.query.quesID);
            if(!doesExist) throw next(createError.NotFound('Question does not exist'))
            const result = await QuestionModel.delete(req.query.quesID);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    get: async (req,res,next) => {
        try {
            const result = await QuestionModel.get(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    getUsersQuestions: async (req,res,next) => {
        try {
            const result = await QuestionModel.getWithFilter({userID:req.params.id})
            if(!result) throw next(createError.NotFound('Questions not found for this user'))
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    getOwnQuestions: async (req,res,next) => {
        try {
            const result = await QuestionModel.getWithFilter({userID:req.user.userID})
            if(!result) throw next(createError.NotFound('Questions not found for this user'))
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    getAll: async (req,res,next) => {
        try {
            req.query.page = (req.query.page && parseInt(req.query.page)) || 1;
           req.query.limit = (req.query.limit && parseInt(req.query.limit)) || 10;
            const result = await QuestionModel.getMultiple(req.query.page,req.query.limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }


}