const asana = require('asana')
const { Tasks } = require('asana/lib/resources')
const config = require("./config")
require('dotenv').config()

const client = asana.Client.create().useAccessToken(process.env.TOKEN)

//helper task
function addProject(taskGid, projectGid) {
    client.tasks.addProject(taskGid, {project: projectGid, insertAfter: null, insertBefore: null})
}

console.log("looking for events...");
client.events.stream(config.maintenanceId, {
    periodSeconds: 3
}).on('data', function(event) {
    console.log("checking for events...")
    if (event.type === 'task' && event.action === 'added') {
        console.log("task found!")
        const taskId = event.resource.gid;
       return client.typeahead.typeaheadForWorkspace(config.workspaceId, {resource_type: "project", query: event.resource.name.substring(0, 8), count: 1}).then(result => {
            const projectId = result.data[0].gid;
            console.log(result.data[0].name)

            addProject(taskId, result.data[0].gid);
        }).catch(function(error) {
            console.log("An error occured: " + error)
        })
    }
})