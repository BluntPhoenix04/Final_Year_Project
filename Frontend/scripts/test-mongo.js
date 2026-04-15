const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://singhsidhant28373_db_user:Z1vxfFyBKrx3SEUf@cluster1-main.puxxchj.mongodb.net/?appName=Cluster1-Main";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
