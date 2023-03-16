

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri=require('./env2.js')
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
module.exports=client
