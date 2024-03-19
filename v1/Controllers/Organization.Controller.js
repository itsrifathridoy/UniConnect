const UserModel = require('../Models/User.model');
const crypto = require('crypto');
const { organizationRegSchema } = require('../util/validation_schema');
const createError = require('http-errors');
const { sendMail } = require('../services/email')
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const { OrganizationModel } = require("../Models/Organization.model");
const { signAccessToken, signRefreshToken } = require('../util/jwt');

module.exports = {
    register: async (req, res, next) => {
        try {
            const validate = await organizationRegSchema.validateAsync(req.body);
            const doesExist = await OrganizationModel.getWithFilterOR({
                email: validate.email,
                website: validate.website
            })
            if(doesExist) throw createError.Conflict("Organization already has been registered")
            const orgID = crypto.randomUUID();
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(validate.password, salt);

            const username = validate.website.split(".")[0];

            const user  = new UserModel(orgID,username,validate.email,validate.name,hashPassword,"guestOrg");
            await user.create();

            const org = new OrganizationModel(orgID,validate.name,validate.email,validate.website,0,validate.description);

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

            await OrganizationModel.update({ approval: 1 }, req.body.orgID);
            const accessToken = await signAccessToken(req.org.orgID);
            const refreshToken = await signRefreshToken(req.org.orgID);
            const hostname = process.env.HOSTNAME || 'localhost';
            const port = process.env.PORT || 2000;
            const emailURL = `http://${hostname}:${port}/v1/org/verify?token=${accessToken}`;
            await sendMail(req.org.email, "Organization Account Approved", `<p>Click <a href="${emailURL}">here</a> to verify your account</p>`);
            res.send({ accessToken, refreshToken });
            res.send(req.org);
        }
        catch (err) {
            next(err);
        }
    },
}