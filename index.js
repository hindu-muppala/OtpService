const http = require('node:http');
const client = require('./db/db');
const hostname = '127.0.0.1';
const port = 8080;
const OtpServer = http.createServer(async (req, res) => { 
    if (req.headers['content-type'] === 'application/json' && req.method === 'GET' && req.url === '/verifyOtp') {
        const buffers2 = [];
        try {
            for await (const chunk of req) {
                buffers2.push(chunk)
                const data3 = Buffer.concat(buffers2).toString()
                data2 = JSON.parse(data3)
                console.log(data2)
            }
        }
        catch(err) {
            res.statusCode = 404
            return   res.end(JSON.stringify({message:"Error"}))
        }
        try {
            console.log(data2)
            const {name,phonenumber,otp}=data2;
            await client.connect();
            console.log("Connected correctly to server");
            const db = client.db("OtpService");
            const col = db.collection("otps");
            const filteredDocs = await col.find({ "name": name,"phonenumber": phonenumber,"otp": otp}).toArray();
            if (filteredDocs.length!=0) {
                if(Date.now()-filteredDocs.data< 1,80,000){
                    console.log("Let see")
                    await col.deleteOne({"_id":filteredDocs[0]._id}).then(()=>{
                        console.log("deleted")
                    })
                    await close();
                    res.statusCode= 202
                    return  res.end(JSON.stringify({message:"sucessfully authenticated"}))
                }
                else{
                    await col.deleteOne({"_id":filteredDocs[0]._id}).then(()=>{
                    console.log("deleted")})
                    res.statusCode= 404
                    return  res.end(JSON.stringify({message:"otp valid for 3 mins"}))
                }
            }
        } catch (err) {
            await close();
            console.log(err.stack);
        }
       
    }
    else if (req.headers['content-type'] === 'application/json' && req.method === 'POST' && req.url === '/otp') {
        const buffers = [];
        //send without data and observe  // I will complete my
        for await (const chunk of req) {  // req body is in the form of stream data
            buffers.push(chunk) // chunk represents binary bit of it
        }
        console.log(buffers)
        var data = Buffer.concat(buffers).toString()
        data = JSON.parse(data)
        if (data) { // change
            console.log("data")
            const bool = await verify(data)
            // res.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);
            // res.sendDate = false // default is true
            close()
            if (bool) {
                res.statusCode = 200
                return  res.end(JSON.stringify({message:"Otp send,valid 3 mins"}))
            }
            else {
                res.statusCode = 404
                return  res.end(JSON.stringify({message:"error"}))// ended with response
            }
        }
    }
    res.statusCode = 404
    res.end(JSON.stringify({message:"error"}))
})
const verify = async (data) => {
    console.log(data)
    if (data.auth!=undefined && data.auth.name != null && data.auth.phonenumber != null) {
        const Otp_number = otp()
        const client = require('twilio')(process.env.sid, process.env.token);
        client.messages
            .create({
                body: `your seven digts verification code :${Otp_number}`,
                from:`${process.env.number}`,
                to: `${data.auth.number}`
            })
            .then(message => {
                console.log(message.sid)
                run(Otp_number, data.auth.name, data.auth.phonenumber)
            }).catch(() => {
                console.log("Unverified number")
                return false
            });
        return true
    }
}
async function run(Otp_number, name, phonenumber) {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db("OtpService");
        const col = db.collection("otps");
        const v = {  "name": name, "phonenumber": phonenumber ,"otp": Otp_number,"date": Date.now()}
        const p = await col.insertOne(v);
    } catch (err) {
        console.log(err.stack);
    }
}
async function close() {
    await client.close().then(()=>{
        console.log("connected")
    }).catch(()=>{
        console.log("error")
    });   
}
const otp = () => {
    return Math.floor(Math.random() * (10000000 - 1000001) + 1000001);
}
// OtpServer.headersTimeout = 60000// header prasing max time
// OtpServer.maxHeadersCount = 1000// maximum headers to application
// OtpServer.requestTimeout = 200000// to receive entrie application 
// OtpServer.maxRequestsPerSocket = 2
OtpServer.listen(port, hostname, () => {
    console.log('server running on port 8080')
})
module.exports=OtpServer; // for cache