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
    enrollmentDate: Joi.string().required(),
    graduationDate: Joi.string().optional(),

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

const projectSchema = Joi.object({
    title: Joi.string().required(),
    shortDescription: Joi.string().default(null),
    description: Joi.string().default(null),
    owner: Joi.string().required(),
    gitLink: Joi.string().required(),
    liveLink: Joi.string().default(null),
    colabLink: Joi.string().default(null),
    logo: Joi.string().default(null),
    privacy: Joi.string().required().default('public')
})

const eventSchema = Joi.object({
    eventID: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    poster: Joi.string(),
    time: Joi.string().isoDate().required(),
    venue: Joi.string().required(),
    organizers: Joi.array().items(Joi.string()).required(),
    speakers: Joi.array().items(Joi.number()).required()
});


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
    feedbackUpdateSchema,
    projectSchema,
    eventSchema
}