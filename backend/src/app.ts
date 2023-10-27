import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import NoteModel from "./models/note"
import morgan from "morgan";
import session from "express-session"
import env from "./util/validateEnv"
import MongoStore from "connect-mongo";
import notesRoutes from "./routes/notes"
import usersRoutes from "./routes/users"
import { requiresAuth } from "./middlewares/auth";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge : 60 * 60 * 100
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.CONNECT_MONGO
    }),
}));

app.get("/", async(req, res, next) => {
    try{

        //throw Error("The server is off")
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
        
    }catch(error){
        next(error);
    }
});

app.use("api/notes",requiresAuth, notesRoutes)
app.use("api/users", usersRoutes)
app.use((req, res, next) => {
    next(Error("Endpoint not found"));
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) =>{
    console.log(error)
        let errorMessage = "An unknown error occured";
        if(error instanceof Error) errorMessage = error.message
        res.status(500).json({error: errorMessage});

})

export default app;