const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv").config;
const app = express();
const port = process.env.PORT || 5100;
dotenv();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.rlegbqz.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;

// MongoClient with MongoClientOptions object
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

// MongoDB run script
async function run() {
	try {
		// Client connection with the server
		await client.connect();
		// Database connection
		const database = client.db("gardeneon");
		// Tips collection
		const tipsCollection = database.collection("tips");
		// Get tips from database
		app.get("/tips", async (req, res) => {
			const cursor = await tipsCollection.find().toArray();
			res.send(cursor);
		});
		// Create new tip in database
		app.post("/tips", async (req, res) => {
			const result = await tipsCollection.insertOne(req.body);
			res.send(result);
		});
		// Ping for successful connection confirmation
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged. Successfully connected to MongoDB.");
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

// Middlewares
app.use(express.json());
app.use(cors());

// Main page response
app.get("/", (req, res) => {
	res.send("Gardeneon Server is running groovily!");
});

// Confirmation for server running
app.listen(port, () => {
	console.log(`Gardeneon Server is running on Port ${port}`);
});
