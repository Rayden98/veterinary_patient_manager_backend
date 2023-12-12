import Veterinarian from '../models/Veterinarian.js';
import generateJWT from '../helpers/generateJWT.js';
import generateId from '../helpers/generateId.js';
import emailRegistration from '../helpers/emailRegistration.js';
import emailForgetPassword from '../helpers/emailForgetPassword.js';

const record = async (req, res) => {
    const {email, name} = req.body;

    // Prevent duplicate users
    const existUser = await Veterinarian.findOne({email})
    if(existUser){
        const error = new Error('User already recorded');
        return res.status(400).json({msg: error.message})
    }

    try{
        // Save a new veterinarian
        const veterinarian = new Veterinarian(req.body);
        const veterinarianSaved = await veterinarian.save();

        // Send the email
        emailRegistration({
            email, 
            name, 
            token: veterinarianSaved.token,
        })

        res.json(veterinarianSaved)
    }catch(error){
        console.log(error)
    }

};

const profile = (req, res) => {
    const { veterinarian } = req;
    res.json(veterinarian);
};

const confirm = async (req, res) => {
    const { token } = req.params

    const userConfirm = await Veterinarian.findOne({token})

    if(!userConfirm){
        const error = new Error('Token not valid')
        return res.status(404).json({ msg: error.message})
    }

    try{
        userConfirm.token = null;
        userConfirm.confirmed = true;
        await userConfirm.save()
        res.json({msg: 'User confirmed correctly'})
    }catch(error){
        console.log(error);
    }
    
}

const authenticate = async (req, res) =>{
    const { email, password } = req.body

    // Check if the user exist 
    const user = await Veterinarian.findOne({email})
    if(!user){
        const error = new Error('The user doesnt exist');
        return res.status(400).json({msg: error.message})
    }

    // Check if the user is confirmed or not
    if(!user.confirmed){
        const error = new Error('Your account hasnt been confirmed')
        return res.status(403).json({msg: error.message})
    }

    // Check the password
    if( await user.checkPassword(password)){

        console.log(user);
        // Authenticate
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user.id),
        });
    }else{
        const error = new Error('The password isnt correct');
        return res.status(400).json({msg: error.message})
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body
    const existVeterinarian = await Veterinarian.findOne({email})
    if(!existVeterinarian){
        const error = new Error('The user doesnt exist');
        return res.status(400).json({msg: error.message});
    }
    
    try{
        existVeterinarian.token = generateId();
        await existVeterinarian.save();

        // Send email with instructions 
        emailForgetPassword({
            email, 
            name: existVeterinarian.name,
            token: existVeterinarian.token
        })

        res.json({msg: 'We have sent an email with the instructions'});
    }catch(error){
        console.log(error);
    }
};

const checkToken = async (req, res) => {
    const { token } = req.params

    const tokenValid = await Veterinarian.findOne({ token });

    if(tokenValid){
        // The token is valid and the user exist 
        res.json({msg: "Token valid and the user exist"});
    }else{
        const error = new Error('Token not valid')
        return res.status(400).json({ msg: error.message });
    }
};

const newPassword = async (req, res) => {
    const { token } = req.params
    const { password } = req.body;

    const veterinarian = await Veterinarian.findOne({ token })
    if(!veterinarian){
        const error = new Error('There was a error');
        return res.status(400).json({ msg: error.message });
    }

    try{
        veterinarian.token = null;
        veterinarian.password = password; 
        await veterinarian.save();
        res.json({msg: 'Password modified correctly'})
    }catch(error){
        console.log(error);
    }
};

const updateProfile = async (req, res) => {
    const veterinarian = await Veterinarian.findById(req.params.id);
    if(!veterinarian){
        const error = new Error('Has been an error')
        return res.status(400).json({msg: error.message})
    }

    const { email } = req.body;
    if(veterinarian.email !== req.body.email){
        const existEmail = await Veterinarian.findOne({ email })
        if(existEmail){
            const error = new Error("That email is already taken");
            return res.status(400).json({msg: error.message})
        }
    }

    try{
        veterinarian.name = req.body.name;
        veterinarian.email = req.body.email;
        veterinarian.web = req.body.web;
        veterinarian.cellphone = req.body.cellphone;


        const veterinarianUpdated = await veterinarian.save();
        res.json(veterinarianUpdated);


    }catch(error){
        console.log(error)
    }
};

const updatePassword = async (req, res) => {
    // Read the data 
    const { id } = req.veterinarian
    const { pwd_actual , pwd_new } = req.body
    // Check that the veterinarian exist 
    const veterinarian = await Veterinarian.findById(id);
    if(!veterinarian){
        const error = new Error('Has been an error')
        return res.status(400).json({msg: error.message})
    }
    // Check the password 
    if(await veterinarian.checkPassword(pwd_actual)){
        // Store the new password
        veterinarian.password = pwd_new;
        await veterinarian.save();
        res.json({msg: 'Password store correctly'})
    }else {
        const error = new Error('The actual password is incorrect')
        return res.status(400).json({msg: error.message})
    }
    
}

export {
    record, 
    profile,
    confirm,
    authenticate,
    forgetPassword,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
};