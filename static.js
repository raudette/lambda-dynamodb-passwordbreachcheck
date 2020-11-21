"use strict"
const path = require("path")
const StaticFileHandler = require("serverless-aws-static-file-handler")
const clientFilesPath = path.join(__dirname, "./public_html/")
const fileHandler = new StaticFileHandler(clientFilesPath)

module.exports.html = async (event, context) => {
  event.path = "index.html" // forcing a specific page for this handler; ignore requested path
  return fileHandler.get(event, context)
}

