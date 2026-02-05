import UserRepository from "./user.repository.js";
import ApplicationError from "../../error-handler/ApplicationError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// controller function for user sign up and sign in.

const userRepository = new UserRepository();



// controller function for user sign up
export const userSignUp = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, phone, address, preferences } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return next(new ApplicationError("Name, Email, and Password are required", 400));
    }

    if(password != confirmPassword){
      return next(new ApplicationError("Password and Confirm Password do not match"));
    }

    // securing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // prepare new user object
    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || "attorney",   // default handled in schema too
      phone: phone || null,
      address: address || {},     // full object: street, city, state, zipCode, country
      preferences: preferences || {}, // optional
    };

    const savedUser = await userRepository.createUser(newUser);

    // generate JWT
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // send response
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        phone: savedUser.phone,
        address: savedUser.address,
        preferences: savedUser.preferences,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError("Unable to sign up user", 500));
  }
};


// controller function for user sign in.
export const userSignIn = async(req, res, next) => {
    try{

       const {email, password} = req.body;
    if(!email || !password){
        return next(new ApplicationError("All fields are required", 400));
    }

    // check if user exists 
    const user = await userRepository.findByEmail(email);
    console.log(user);
    if(!user){
        return next(new ApplicationError("Invalid credentails", 401));
    }

    // compare password.
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return next(new ApplicationError("Invalid credentails", 401));
    }

    // generate the jwt token.
    const token = jwt.sign(
        {id : user._id, email : user.email, role : user.role},
        process.env.JWT_SECRET,
        {expiresIn : process.env.JWT_EXPIRES_IN}
    )

    // send response.
    res.status(200).json({
        success : true,
        message : "Login Successfull",
        token,
        user : {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }

    })

    }catch(error){
        console.log(error);
        return next("Unable to sign in user", 500);
    }
}


// controller function for get current user profile.
export const getUserProfile = async(req, res, next) => {
    try{

        const userId = req.id;
        const user = await userRepository.getById(userId);
        
        if(!user){
            return next(new ApplicationError("User not found", 404));
        }

        res.status(200).json({
            name : user.name,
            email : user.email,
            role : user.role,
            phone : user.phone,
            address : user.address,
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError("Unable to fetch user profile", 500));
    }
}

// controller function for update user profile.
export const updateUserProfile = async(req, res, next) => {
  try{

    const userId = req.id;
    const {name, phone, address, preferences} = req.body;

    const updateData = {};
    if(name) updateData.name = name;
    if(phone) updateData.phone = phone;
    if(address) updateData.address = address;
    if(preferences) updateData.preferences = preferences;

    const updatedUser = await userRepository.updateById(userId,  updateData);

    if(!updatedUser){
      return next(new ApplicationError("User not found", 404));
    }

    res.status(200).json({
      name : updatedUser.name,
      phone : updatedUser.phone,
      address : updatedUser.address,
      preferences : updatedUser.preferences,
      message : "Profile updated successfully"
    });

  }catch(error){
    console.log(error);
    return next(new ApplicationError("Unable to update user profile", 500));
  }
}

// controller function for logout user.
export const userLogout = async(req, res,) => {
  try{
    // for jwt based auth, logout is handled on client side by deleting the token.
    const userId = req.id;

    await userRepository.logout(userId);

    res.status(200).json({
      message : "User logged out successfully",
    });
  }catch(error){
    console.log(error);
    return next(new ApplicationError("Unable to logout user", 500));
  }
}

// controller function for change-password.
export const changePassword = async(req, res, next) => {
  try{

    const userId = req.id;
    const {newPassword, confirmPassword} = req.body;

    if(!newPassword || !confirmPassword){
      return next(new ApplicationError("All fields are required", 400));  
    }

    const user = await userRepository.getByIdPass(userId);
    if(!user){
      return next(new ApplicationError("User not found", 404));
    }

    const isMatch = await bcrypt.compare(newPassword, user.password);
    if(isMatch){
      return next(new ApplicationError("New password cannot be same as current password", 404));
    }

    if(newPassword !== confirmPassword){
      return next(new ApplicationError("New password and confirm password do not match", 404));
    }
  //  hash new password.
  const salt = await bcrypt.genSalt(10);

  const updatedPassword = await bcrypt.hash(newPassword, salt);
  
  user.password = updatedPassword;
  await user.save();

  res.status(200).json({
    message  : "Password changed successfully",
  })
  
  }catch(error){
    console.log(error);
    return next(new ApplicationError("Unable to change the user password", 500));
  }
}
