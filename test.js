const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client()

const inventory = new Map(JSON.parse(fs.readFileSync('inventory.json')))
console.log(inventory)

client.on('ready', () => {
  console.log("Connected as " + client.user.tag)

  // List servers the bot is connected to.
  console.log("Servers:")
  client.guilds.forEach((guild) => {
    console.log(" - " + guild.name)

    // List all channels
    guild.channels.forEach((channel) => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
    })
  })
})

client.on('message', (receivedMessage) => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return
  }

  if (receivedMessage.content.startsWith("!")) {
    processCommand(receivedMessage)
  }
})


function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1) // Remove leading mark
  let splitCommand = fullCommand.split(" ") // Split the message
  let primaryCommand = splitCommand[0] // Command
  let arguments = splitCommand.slice(1) // Arguments

  console.log("Command received: " + primaryCommand)
  console.log("Arguments: " + arguments)

  if (primaryCommand == "add") {
    addCommand(arguments, receivedMessage)
  } else if (primaryCommand == "drop") {
    dropCommand(arguments, receivedMessage)
  } else if (primaryCommand == "list") {
    listCommand(receivedMessage)
  }
}

function addCommand(arguments, receivedMessage) {
  let item = arguments[0]
  let quantity = 0
  let totalQuantity = 0

  if (arguments.length == 1) {
    quantity = 1
  } else {
    quantity = parseInt(arguments[1])
  }

  if (!Number.isInteger(quantity)) {
    receivedMessage.channel.send("Quantity should be a number.")
  } else {
    if (inventory.has(item)) {
      totalQuantity = parseInt(inventory.get(item)) + parseInt(quantity)
      inventory.set(item, totalQuantity)
    } else {
      totalQuantity = parseInt(quantity)
      inventory.set(item, parseInt(quantity))
    }

    receivedMessage.channel.send(`Added ${quantity} of ${item}.`)
    receivedMessage.channel.send(`Currently have ${totalQuantity} of ${item}.`)

    data = JSON.stringify(Array.from(inventory.entries()));
    fs.writeFile('inventory.json', data, (err) => {
      if (err) throw err;
      console.log('Data written to file.');
    })
    console.log(inventory)
  }
}

function dropCommand(arguments, receivedMessage) {
  console.log("Drop")
  let item = arguments[0]
  let quantity = 0
  let totalQuantity = 0

  if (arguments.length == 1) {
    quantity = 1
  } else {
    quantity = parseInt(arguments[1])
  }

  if (!Number.isInteger(quantity)) {
    receivedMessage.channel.send("Quantity should be a number.")
  } else {
    if (inventory.has(item)) {
      totalQuantity = parseInt(inventory.get(item)) - parseInt(quantity)

      if (totalQuantity > 0) {
        inventory.set(item, totalQuantity)
        receivedMessage.channel.send(`Dropped ${quantity} of ${item}.`)
        receivedMessage.channel.send(`Currently have ${totalQuantity} of ${item}.`)
      } else {
        inventory.delete(item)
        receivedMessage.channel.send(`Dropped ${quantity} of ${item}.`)
        receivedMessage.channel.send(`Currently have 0 of ${item}.`)
      }
    } else {
      receivedMessage.channel.send(`No ${item} in inventory. Can't drop.`)
    }

    data = JSON.stringify(Array.from(inventory.entries()));
    fs.writeFile('inventory.json', data, (err) => {
      if (err) throw err;
      console.log('Data written to file.');
    })
    console.log(inventory)
  }
}

function listCommand(receivedMessage) {
  let sortedMap = new Map([...inventory].sort())
  receivedMessage.channel.send("Inventory:")
  sortedMap.forEach((value, key) => {
    receivedMessage.channel.send(`${value} ${key}`)
  })
}

bot_secret_token = "NjE4OTM2NTYxODMyMjk2NDQ5.XXA--g.EZlSHibXiiv-UgpC1ETj574L1mE"
client.login(bot_secret_token)
