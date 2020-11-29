"use strict"
const path = require("path")
const StaticFileHandler = require("serverless-aws-static-file-handler")
const clientFilesPath = path.join(__dirname, "./public_html/")
const fileHandler = new StaticFileHandler(clientFilesPath)

//This function serves up the demo page
module.exports.html = async (event, context) => {
  event.path = "index.html" 
  return fileHandler.get(event, context)
}

