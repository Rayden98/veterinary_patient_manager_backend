import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import conectDB from "./config/db.js";
import veterinarianRoutes from './routes/veterinarianRoutes.js'; 
import patientRoutes from './routes/patientRoutes.js'; 


const app = express();
app.use(express.json())

dotenv.config();

conectDB();

const domainsPermitted = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(domainsPermitted.indexOf(origin) !== -1){
            // The origin of the request is permitted
            callback(null, true)
        }else(new Error('Not permitted for CORS'))
    }
}

app.use(cors(corsOptions))
app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/patients', patientRoutes);


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server working in the port ${PORT}`)
});
