const asana = require('asana')
const config = require("../../config")
require('dotenv').config()

const client = asana.Client.create().useAccessToken(process.env.TOKEN)

const defaultLimit = 100;

let numTasks = 30;

const delay = 200
//helper task
function addProject(taskGid, projectGid) {
    client.tasks.addProject(taskGid, {project: projectGid, insertAfter: null, insertBefore: null})
}
//Goes through the most recent tasks of the maintenance project
//limit is set to retrieve the 100 most recent tasks
    client.projects.tasks(config.maintenanceId, {limit: numTasks || defaultLimit}).then(tasks => {

        let index = 0;
        //Putting it in an interval to prevent the rate limit enforcement
        //rules from taking place
        const interval = setInterval(function() {
            const taskName = tasks.data[index].name
            const taskId = tasks.data[index].gid
     //first 8 letters of the task name, in order that it doesn't find
    //a non-existing project in typeahead
            const queryName = tasks.data[index].name.substring(0, 8)
            console.log(queryName)
    //this searches for a project based on the name of the organization
        //result is the data of that project, includes the gid and name
            client.typeahead.typeaheadForWorkspace(config.workspaceId, {resource_type: "project", query: queryName, count: 1}).then(result => {
                const projectId = result.data[0].gid
                console.log(result.data[0].name)
                //adding the task to the project
                addProject(taskId, projectId)
                console.log(taskName + " has been added to project: " + result.data[0].name)
            })
            index++
            if (index >= tasks.data.length) {
                clearInterval(interval)
                console.log("DONE PUTTING TASKS INTO PROJECTS")
            }
        }, delay)
        
    })


