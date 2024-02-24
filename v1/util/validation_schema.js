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
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
    website: Joi.string().pattern(/^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/,"website").required(),

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


module.exports = {
    registerSchema,
    loginSchema,
    universityRegSchema,
    organizationRegSchema,
    clubRegSchema,
    universityAddEmailsSchema,
    verifyUniversitySchema,
    studentVerifySchema,
    studentTokenVerifySchema
}