const createError = require('http-errors');
const fs = require('fs');
const { generateDockerComposeFile } = require('../util/docker');
const cli = require('child_process');
const event = require('../util/event');

module.exports = {
    projectFromGit: async (req, res, next) => {
        const rootDir = `D:/project/`;
        const projectName = req.body.gitURL.split('/')[4];
        const userDir = `${rootDir}/${req.user.username}`
        const workspace = `${req.user.username}/${projectName}`
        if(fs.existsSync(`${userDir}/${projectName}`)) {
            next(createError.Conflict(`${projectName} already exists`));
        }
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }
        if (!fs.existsSync(`${userDir}/${projectName}Docker`)) {
            fs.mkdirSync(`${userDir}/${projectName}Docker`);
        }
        const containerConfig  = {
            FILE_PATH: `${userDir}/${projectName}Docker/docker-compose.yml`,
            CONTAINER_NAME: `${req.user.username}-${projectName}`,
            PROJECTS_PATH: workspace,
            PORT: Math.floor(Math.random() * 10000)
            }
        await generateDockerComposeFile(containerConfig);

        const data = {
            gitURL: req.body.gitURL,
            userDir,
            projectName,
            containerConfig
        }
        event.emit('project', data);
        res.send({message: `Project is being created. Check back in a few minutes. Code Server will be available at http://localhost:${containerConfig.PORT}`});
    }
}
