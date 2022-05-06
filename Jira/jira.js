const fetch = require('node-fetch')
const fs = require('fs');
require('dotenv').config()

var map = new Map();
let props = [];
let counter  = 0;
let data = 'Organizations\tEmails\n';
console.log("starting")

async function getUsers(index) {
  const response = await fetch(`https://tenantconcierge.atlassian.net/rest/servicedeskapi/organization/${index}/user`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${process.env.encoded}`,
      Accept: 'application/json'
    }
  }).then(response => {
    if (response) {
    return response.json();
    }
  }).then(json => {
    for (let j = 0; j < json.values.length - 1; j++) {
      if (json.values[j].emailAddress != undefined) {
      data += json.values[j].emailAddress + '\n' + '\t'
      console.log(json.values[j].emailAddress);
      } 
    }
    if (json.size === 0) {
      data += '\n';
    } else {
      if (json.values[json.values.length - 1].emailAddress != undefined) {
      data += json.values[json.values.length - 1].emailAddress + '\n';
      } else {
        data += '\n'
      }
    }
  }).catch(error => {

  }).catch(error => {

  })
}

async function getOrganizations(index) {
const response = await fetch(`https://tenantconcierge.atlassian.net/rest/servicedeskapi/organization/${index}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${process.env.encoded}`,
      Accept: 'application/json'
    }
  }).then(response => {
    if (response) {
    return response.json();
    }
  }).then(json => {
    if (json.name != undefined) {
    counter++;
    props.push(json.name);
    map.set(json.name, index);
   // data += json.name + '\t';
    console.log(json.name);
    }
  }).catch(error => {

  }).catch(error => {

  })
}

(async() => {
  console.log("before getting orgs")
  for (let i = 1; i < 1000; i++) {
    await getOrganizations(i);
  }

  props.sort();

  for (let k = 0; k < props.length; k++) {
    data += props[k] + '\t'

    await getUsers(map.get(props[k]));
  }

  fs.appendFile('../test.xls', "Organizations\tEmails\n", err => {
    if (err) throw err;
  })
  fs.appendFile('./test.xls', data, (err) => {
    if (err) throw err;
    console.log('File created');
  })
  console.log("counter: "+ counter)

  console.log("after getting orgs")
})();

