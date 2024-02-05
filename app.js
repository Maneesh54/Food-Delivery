require('dotenv').config();


const express = require("express");
const mysql = require("mysql2");



const app = express();
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
try { app.listen(3000, () => {
    console.log("Server is running");
  });
} catch (e) {
    console.log(`Error : ${e.message}`);
  };

app.get("/", async (req, res) => {
    res.send("Hello, World!");
});

app.get("/deliveryCost/" , async(request , response) => {
    try {
        const {zone , organization_id , total_distance , item_type} = request.body;

        let total_price = 0;

        if (total_distance <= 5) {

            total_price = 10;
        } else {
            if (item_type === "perishable") {
                total_price = 10 + (total_distance-5)*(1.5)
            } else if(item_type==="non-perishable") {
                total_price = 10 + (total_distance-5)
            } else {
                return response.status(400).send("Incorrect Item Type");
            }
        }

        const result = response.status(200).send({total_price});
        return result;
        
    } catch (error) {
        return response.status(500).send("Internal Server Error");
    }
})