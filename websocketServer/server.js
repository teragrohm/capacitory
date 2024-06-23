const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3100 });
//const wss = new WebSocket.Server();
const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
  
let moist;

const sensorData = {
};

// Creating connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
 
    // sending message to client
    ws.send('Welcome, you are connected!');
 
    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    /*
        sensorData.push(parseFloat(data))
        console.log(sensorData)
    */
        //wss.clients.forEach((client) => {
          //  client.send(parseInt(data));
        //});
        //ws.send(String(data));
        

        //sensorData.push(parseInt(data))
        //console.log(sensorData)
        
        if (data.includes("Moisture")) {

            if (!(data.includes("Percent"))) {
                moistArr = String(data).split(":")
                sensorData.moisture = moistArr[1]
            }
        }

        if (data.includes("Percent")) {
            mPercentArr = String(data).split(":")
            sensorData.moistPercent = mPercentArr[1]
        }

        if (data.includes("Temperature")) {
            tempArr = String(data).split(":")
            sensorData.temperature = tempArr[1]
        }

        if (data.includes("Manual")) {
            wss.clients.forEach((client) => {
                client.send("Manual Mode");
            });
        }

        if (data.includes("Auto")) {
            wss.clients.forEach((client) => {
                client.send("Auto Mode");
            });
        }

        if (data.includes("Holder")) {

            if (data.includes("true")) {

                wss.clients.forEach((client) => {
                    client.send("Enable Holder");
                  });
                  console.log("h enabled");
            }
            else if (data.includes("false")) {

                wss.clients.forEach((client) => {
                    client.send("Disable Holder");
                  });
                  console.log("h disabled");
            }

            //wss.clients.forEach((client) => {
              //  client.send("Activate Holder");
            //});
            console.log(data);
        }

        wss.clients.forEach((client) => {
            client.send(JSON.stringify(sensorData));
        });

        console.log(JSON.stringify(sensorData))
    });
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has disconnected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 3100");
