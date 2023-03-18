

const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const client = new MongoClient(process.env.url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
module.exports=client
