const UserModel = require('../Models/User.model');
const crypto = require('crypto');
const { organizationRegSchema } = require('../util/validation_schema');
const createError = require('http-errors');
const { sendMail } = require('../services/email')
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const { OrganizationModel } = require("../Models/Organization.model");

module.exports = {
    register: async (req, res, next) => {
        try {
            const validate = await organizationRegSchema.validateAsync(req.body);
            const doesExist = await OrganizationModel.getWithFilterOR({
                email: validate.email,
                website: validate.website
            })
            if(doesExist) throw createError.Conflict("Organization already has been registered")

            const org = new OrganizationModel(crypto.randomUUID(), validate.name, validate.email, validate.website);

            const result = await org.create();
            res.send(result);
        }
        catch (err) {
            if (err.isJoi === true) err.status = 422;
            next(err);
        }
    },
    approve: async (req, res, next) => {
        try {
            const result = await OrganizationModel.get(req.body.orgID);
            if (!result) throw createError.NotFound("Organization Not Found");
            req.org = {
                orgID: result[0].orgID,
                name: result[0].name,
                email: result[0].email,
                website: result[0].website,
            };
            if (result[0].approval == 1)
                throw createError.Conflict(`${result[0].name} is already approved. Please check your official email`);
            const password = generator.generate({
                length: 10,
                uppercase: true,
                numbers: true
            });

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const username = req.org.website.split(".")[0];

            await OrganizationModel.update({ approval: 1 }, req.body.orgID);
            const user  = new UserModel(req.org.orgID,username,req.org.email,req.org.name,hashPassword,"org");
            await user.create();
            await sendMail(result[0].email, "Organization Approval", `<p>${password}</p>`);
            res.send(req.org);
        }
        catch (err) {
            next(err);
        }
    },
}