const userModel = require("../Models/user");
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET;

    return jwt.sign({_id}, jwtkey, {expiresIn: "7d"});//know about this line
};

const registerUser = async(req, res) => {
    try{
        const {username, email, password} = req.body;
        let user = await userModel.findOne({email});
        if(user)
            return res.status(400).json("Email already exists...");

        // if(!name || !email || !password)
        //    return res.status(400).json("All fields are required...");
        
        // if(!validator.isEmail(email))
        //    return res.status(400).json("Email must be a valid Email...") 

        // if(!validator.isStrongPassword(password))
        //    return res.status(400).json("Password must be a strong password...") 

        // The above three conditions should be applied so that if a user bypasses frontend
        // so he need to be verified at the backend to register

        
        user = new userModel({username, email, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);
        res.status(200).json({_id: user._id, username, email, token})
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
    
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        let user = await userModel.findOne({ email });

        if(!user)
           return res.status(400).json("Invalid email or password....");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword)
           return res.status(400).json("Invalid email or password...");

        const token = createToken(user._id);
        res.status(200).json({_id: user._id, username: user.username, email, token})

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const findUser = async(req, res) => {
    const userId = req.params.userId;
    try{
        const user = await userModel.findById(userId);

        res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};


const getUsers = async(req, res) => {
    try{
        const user = await userModel.find();

        res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

const allUsers = async(req, res) => {
    try{
        const keyword = req.query.search ? {
            $or: [
                {username: {$regex: req.query.search, $options: "i"}},
                {email: {$regex: req.query.search, $options: "i"}},
            ],
        } : {};
        
        const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id }});
        res.send(users);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { registerUser, loginUser, findUser, getUsers , allUsers};