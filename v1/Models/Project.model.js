const db = require('../services/db');
const helper = require('../util/helper');
const createError = require('http-errors');
class ProjectModel{
    constructor(projectID,title,shortDescription,description,owner,gitLink,liveLink,colabLink,logo,privacy,status)
    {
        this.projectID = projectID;
        this.title = title;
        this.shortDescription = shortDescription;
        this.description = description;
        this.owner = owner;
        this.gitLink = gitLink;
        this.liveLink = liveLink;
        this.colabLink = colabLink;
        this.logo = logo;
        this.privacy = privacy;
        this.status = status;
    }
    async create()
    {
        try{
            const query = `INSERT INTO projects (projectID,title,shortDescription,description,owner,gitLink,liveLink,colabLink,logo,privacy,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
            const result = await db.query(query,[this.projectID,this.title,this.shortDescription,this.description,this.owner,this.gitLink,this.liveLink,this.colabLink,this.logo,this.privacy,this.status]);
            return result;
        }
        catch(err)
        {
            throw err;
        }
    }
    static async getUserProjects(userID){
        try{
            const query = `SELECT DISTINCT projects.*
            FROM project_contributors
            JOIN projects ON project_contributors.projectID = projects.projectID
            WHERE contributorID = ? OR projects.owner = ?;
            `;
            const result = await db.query(query,[userID,userID]);
            return result;
        }
        catch(err)
        {
            throw err;
        }
    }
    static async getProject(projectID){
        try{
            const query = `SELECT 
            projects.*, 
            users.userID, 
            users.username, 
            users.email, 
            users.name, 
            users.role, 
            users.avatar,
            (
               SELECT COUNT(DISTINCT project_contributors.contributorID)
                FROM project_contributors
                WHERE project_contributors.projectID = projects.projectID
            ) AS contributor_count,
            (
                SELECT COUNT(project_contributors.contributionID)
                FROM project_contributors
                WHERE project_contributors.projectID = projects.projectID
            ) AS contribution_count
        FROM 
            projects
        JOIN 
            users ON projects.owner = users.userID        
            WHERE projectID = ?`;
            const result = await db.query(query,[projectID]);
            if(result.length === 0)
            {
                throw createError.NotFound('Project not found');
            }
            const project = {
                projectID: result[0].projectID,
                title: result[0].title,
                shortDescription: result[0].shortDescription,
                description: result[0].description,
                createdAt: result[0].createdAt,
                owner: {
                    userID: result[0].userID,
                    username: result[0].username,
                    email: result[0].email,
                    name: result[0].name,
                    role: result[0].role,
                    avatar: result[0].avatar
                },
                gitLink: result[0].gitLink,
                liveLink: result[0].liveLink,
                colabLink: result[0].colabLink,
                logo: result[0].logo,
                privacy: result[0].privacy,
                status: result[0].status,
                contributor_count: result[0].contributor_count,
                contribution_count: result[0].contribution_count
            }
            return project;
        }
        catch(err)
        {
            throw err;
        }
    }
    static async getProjects(){
        try{
            const query = `SELECT * FROM projects`;
            const result = await db.query(query);
            return result;
        }
        catch(err)
        {
            throw err;
        }
    }

    static async getCommits(projectID){
        try{
            const query = `SELECT project_contributors.*, users.userID,users.username,users.email,users.name,users.role,users.avatar
            FROM project_contributors
            JOIN users ON users.userID = project_contributors.contributorID WHERE projectID = ? ORDER BY project_contributors.date DESC;`
            const result = await db.query(query,[projectID]);

            const commits = result?.map(commit => {
                return {
                    contributionID: commit.contributionID,
                    projectID: commit.projectID,
                    contributor: {
                        userID: commit.userID,
                        username: commit.username,
                        email: commit.email,
                        name: commit.name,
                        role: commit.role,
                        avatar: commit.avatar
                    },
                    commit: commit.commit,
                    date: commit.date
                }
            })

            return commits;
        }
        catch(err)
        {
            throw err;
        }
    }

    static async getContributors(projectID){
        try{
            const query = `SELECT users.userID,users.username,users.email,users.name,users.role,users.avatar ,COUNT(project_contributors.contributionID) AS numOfContribute 
            FROM project_contributors
            JOIN users ON users.userID = project_contributors.contributorID
            WHERE project_contributors.projectID = ?
            GROUP BY project_contributors.contributorID`
            const result = await db.query(query,[projectID]);

            const contributors = {
                projectID: projectID,
                contributors: result?.map(contributor => {
                    return {
                        userID: contributor.userID,
                        username: contributor.username,
                        email: contributor.email,
                        name: contributor.name,
                        role: contributor.role,
                        avatar: contributor.avatar,
                        numOfContribute: contributor.numOfContribute
                    }
                })
            }

            return contributors;
        }
        catch(err)
        {
            throw err;
        }
    }

    static async addColabLink(fields,projectID){
        try {
            const query = `UPDATE projects SET colabLink = '${fields.colabLink}' WHERE projectID = ${projectID}`;
            console.log(query);
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        }
        
      }
      static async deleteColabLink(projectID){
        try {
            const query = `UPDATE projects SET colabLink = NULL WHERE projectID = ${projectID}`;
            console.log(query);
            const result = await db.query(query);
            return result;
        } catch (error) {
            throw error;
        }
      }
 
}
module.exports = {
    ProjectModel
}