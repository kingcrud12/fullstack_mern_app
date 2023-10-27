import app from "./app"
import env from "./util/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

mongoose.connect(env.CONNECT_MONGO)
.then(()=>{
    console.log("Connected to the databse")
    app.listen(port, () => {
        console.log("Server is running on port : " + port)
    });
})
.catch(console.error)