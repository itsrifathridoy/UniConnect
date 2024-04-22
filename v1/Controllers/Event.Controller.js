const { studentVerifySchema, studentTokenVerifySchema, eventSchema } = require('../util/validation_schema');
const createError = require('http-errors');
const { sendMail } = require('../services/email')
const { } = require('../Models/University.model');
const { StudentModel } = require("../Models/Student.model");
const db = require('../services/db');
const { signAccessToken } = require('../util/jwt');
const jwt = require('jsonwebtoken');
const EventModel = require('../Models/Event.model');
const { re } = require('mathjs');
const crypto = require('crypto');

module.exports = {
    create: async (req,res,next) => {
        try {
            req.body.organizers.push(req.user.userID);
            const eventID = crypto.randomUUID();
            req.body.eventID = eventID;
            const validate = await eventSchema.validateAsync(req.body);
            console.log(validate)
            const event = new EventModel(req.body.eventID,req.body.title,req.body.description,req.body.date,req.body.time,req.body.venue,req.body.organizers,req.body.speakers);
            const result = await event.create();
            res.send(result)
        } catch (error) {
            next(error)
        }
    },
    getEventWithOrganizersAndSpeakers: async (req, res, next) => {
         try {
              const events = await EventModel.getEventWithOrganizersAndSpeakers(req.params.id)
              res.send(events);
         } catch (error) {
              next(error)
         }
    },
    getEvents: async (req, res, next) => {
        try {
             const events = await EventModel.getEvents(req.query.page, req.query.limit);
             res.send(events);
        } catch (error) {
             next(error)
        }
   }
}