const Joi = require('joi');
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
})
const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
})
const universityRegSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
    website: Joi.string().required(),
    description: Joi.string()
})
const universityApproveSchema = Joi.object({
    uniID: Joi.string().required(),
})
const verifyUniversitySchema = Joi.object({
    accessToken: Joi.string().required(),
})
const universityAddEmailsSchema = Joi.object({
    emails: Joi.array().items(Joi.string().email().lowercase()).required()
})

const organizationRegSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    website: Joi.string().pattern(/^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/,"website").required(),
    password: Joi.string().min(6).required(),
    description: Joi.string()
})
const clubRegSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
})

const studentVerifySchema = Joi.object({
    uniID: Joi.string().required(),
    eduMail: Joi.string().email().lowercase().required(),
    department: Joi.string().required(),
    enrollmentDate: Joi.date().required(),
    graduationDate: Joi.date().required(),

})

const studentTokenVerifySchema = Joi.object({
    accessToken: Joi.string().required(),
})

const questionSchema = Joi.object({
    quesText: Joi.string().required(),
    imgPath: Joi.string(),
    status: Joi.string(),
})
const answerSchema = Joi.object({
    quesID: Joi.number().required(),
    ansText: Joi.string().required(),
    imgPath: Joi.string(),
})
const answerUpdateSchema = Joi.object({
    ansText: Joi.string().required(),
    imgPath: Joi.string(),
})
const feedbackSchema = Joi.object({
    ansID: Joi.number().required(),
    comment: Joi.string().required()
})
const feedbackUpdateSchema = Joi.object({
    comment: Joi.string(),
})

module.exports = {
    registerSchema,
    loginSchema,
    universityRegSchema,
    universityApproveSchema,
    organizationRegSchema,
    clubRegSchema,
    universityAddEmailsSchema,
    verifyUniversitySchema,
    studentVerifySchema,
    studentTokenVerifySchema,
    questionSchema,
    answerSchema,
    answerUpdateSchema,
    feedbackSchema,
    feedbackUpdateSchema
}