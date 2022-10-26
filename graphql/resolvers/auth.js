const User = require('../../models/user.model')
const bcrypt   = require('bcrypt')
const jwt = require('jsonwebtoken')

const {UserInputError} = require('apollo-server')
const {validateRegisterInputs, validateLoginInputs} = require('../../utils/validator')



const SECRET_KEY = "secretkey"

module.exports = {
     Query :  {
        async login(_, {email,password}) {

            const {errors,valid} = validateLoginInputs(email,password)

            if(!valid){
                throw new UserInputError('Errors', {errors})
            }

            const user =  await User.findOne({email})

            if(!user){
                errors.general = 'User not found'
                throw new UserInputError('User not found', {errors})
            }
            const match = await bcrypt.compare(password,user.password)

            if(!match){
                errors.general = 'Incorrect password'
                throw new UserInputError('Incorrect password', {errors})
            }

            const token = jwt.sign({
                id : user.id,
                email : user.email
            }, SECRET_KEY, {expiresIn : '1h'})

            return {
                ...user._doc,
                id: user._id,
                token
            }


        }
     },
     Mutation: {
        async register(_, {registerInput : {name, email, password}}){
            
            const {errors,valid}  = validateRegisterInputs(name, email, password) // validate data 

            if(!valid) {
                throw new UserInputError('Errors', {errors})
            }

            const user = await User.findOne({email})   // check if user exists

            if(user){
                throw new UserInputError('email is taken ', {
                    errors:{
                        email: 'This email is taken'
                    }
                })
            }
            
            password = await bcrypt.hash(password,10)

            const newUser = new User({
                email,
                name,
                password
            })

            const res = await newUser.save() 

            const token = jwt.sign({
                id : res.id,
                email : res.email
            }, SECRET_KEY, {expiresIn : '1h'})

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
     }
} 