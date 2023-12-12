import Patient from "../models/Patient.js";

const addPatient = async (req, res) => {

    const patient = new Patient(req.body);
    patient.veterinarian = req.veterinarian._id
    try{
        const patientStored = await patient.save()
        res.json(patientStored)
    }catch(error){
        console.log(error)
    }
};
const getPatients = async (req, res) => {
    const patients = await Patient.find().where('veterinarian').equals(req.veterinarian);

    res.json(patients)
};

const getPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id)
    
    if(!patient){
        return res.status(404).json({msg: 'Didnt found it'})
    }
    if(patient.veterinarian._id.toString() !== req.veterinarian._id.toString()){
        return res.json({msg: 'Action not valid'})
    }

    
    res.json(patient);    
};

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id)
    
    if(!patient){
        return res.status(404).json({msg: 'Didnt found it'})
    }
    if(patient.veterinarian._id.toString() !== req.veterinarian._id.toString()){
        return res.json({msg: 'Action not valid'})
    }

    // Update patient
    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;


    try{
        const patientUpdated = await patient.save();
        res.json(patientUpdated);
    }catch(error){
        console.log(error)
    }
};

const deletePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id)
    
    if(!patient){
        return res.status(404).json({msg: 'Didnt found it'})
    }
    if(patient.veterinarian._id.toString() !== req.veterinarian._id.toString()){
        return res.json({msg: 'Action not valid'})
    }

    try{
        await patient.deleteOne()
        res.json({msg: 'Patient deleted'})
    }catch(error){
        console.log(error)
    }
};



export { addPatient, getPatients, getPatient, updatePatient, deletePatient };