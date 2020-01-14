module.exports = {
  getStudent,
  modifyStudent,
  deleteStudent
}

const url = require('url')
const fs = require('fs')

async function getStudent (req, res, next) {
  let id = req.params.id
  let fileName = `./data/${id}.json`
  if (fs.existsSync(fileName) == false) {
    res.status(404).send('File Not Found')
    //fs.openSync(fileName, 'w')
    return
  }

  var path = req.params[0]
  var data = require(fileName)

  var keys = path.split('/').filter(v =>
    v != ''
  )
  
  var item = data
  var key = id
  for (element of keys) {
    item = item[element]
    key = element
    if (item == undefined) {
      break;
    }
  }

  if (item == undefined) {
    res.status(404).send('Property Not Found')
    return
  }

  res.json({ [key]: item })
}

async function modifyStudent (req, res, next) {
  let id = req.params.id
  let fileName = `./data/${id}.json`
  if (fs.existsSync(fileName) == false) {
    fs.writeFileSync(fileName, JSON.stringify({}, null, 4))
  }

  var path = req.params[0]
  var data = require(fileName)

  var keys = path.split('/').filter(v =>
    v != ''
  )

  var item = data
  var parentItem
  for (element of keys) {
    parentItem = item
    item = item[element]
    if (item == undefined) {
      item = {}
      parentItem[element] = item
    }
  }

  var newData = req.body
  for (element in newData) {
    item[element] = newData[element]
  }

  fs.writeFileSync(fileName, JSON.stringify(data, null, 4))

  res.json({ success: true })
}

async function deleteStudent (req, res, next) {
  let id = req.params.id
  let fileName = `./data/${id}.json`
  if (fs.existsSync(fileName) == false) {
    res.status(404).send('File Not Found')
    return
  }

  var path = req.params[0]
  var data = require(fileName)

  var keys = path.split('/').filter(v =>
    v != ''
  )
  
  var item = data
  var key
  var parentItem = data
  for (element of keys) {
    parentItem = item
    key = element
    item = item[element]
    if (item == undefined) {
      break;
    }
  }

  if (item == undefined) {
    res.status(404).send('Property Not Found')
    return
  }

  delete parentItem[key]
  fs.writeFileSync(fileName, JSON.stringify(data, null, 4))
  res.json({ success: true })
}