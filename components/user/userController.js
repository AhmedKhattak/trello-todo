const express = require('express')
const User = require('./userModel')
const {
  userRegisterValidator,
  userLoginValidator,
  userPasswordChangeValidator
} = require('./userValidators')
const router = express.Router()
const protectResource = require('../middlewares')
const UserService = require('./userService')
const { AppError } = require('../utilities')

// register a new user
// router.post('/register', async (req, res) => {
//   try {
//     let user = await userRegisterValidator.validateAsync(req.body)
//     const password = await bcrypt.hash(user.password, saltRounds)
//     console.log(user)
//     const emailExists = await User.query().select('email').where('email', user.email).limit(1)
//     if (emailExists.length > 0) {
//       return res.status(400).json({
//         status: 'fail',
//         reason: 'email is already taken'
//       })
//     } else {
//       user.password = password
//       await User.query().insert(user)
//       res.status(201).json({
//         status: 'success',
//         result: 'user registered successfully'
//       })
//     }

//   } catch (err) {
//     console.log(err)
//     res.status(500).json({
//       status: 'failed',
//       reason: 'Internal Server Error'
//     })
//   }

// });

router.post('/register', async (req, res, next) => {
  try {
    // do buisness logic
    const dataObj = {
      body: req.body,
      userRegisterValidator
    }

    const userService = new UserService(User)
    const result = await userService.registerUser(dataObj)

    // send success response job of express
    res.status(201).json({
      status: 'success',
      result: 'registered user successfully',
      user: result
    })
  } catch (err) {
    next(err)
  }
})

// login user
// router.post('/login', async (req, res) => {
//   try {
//     const user = await userLoginValidator.validateAsync(req.body)
//     const doesUserExist = await User.query().select().where({
//       email: user.email
//     })

//     // no user or email
//     if (doesUserExist.length === 0) {
//       return res.status(401).json({
//         status: 'fail',
//         reason: 'email or password is incorrect'
//       })
//     }

//     // user does exist
//     const passwordCheck = await bcrypt.compare(user.password, doesUserExist[0].password)

//     if (passwordCheck === false) {
//       return res.status(401).json({
//         status: 'fail',
//         reason: 'email or password is incorrect'
//       })
//     }

//     // user password is correct generate the jwt
//     const jwtToken = jwt.sign({
//       xid: doesUserExist[0].user_id,
//       name: `${doesUserExist[0].fname} ${doesUserExist[0].lname}`,
//       email: doesUserExist[0].email
//     }, config.security.JWT_SECRET, {
//       expiresIn: '1h'
//     })

//     // return response with jwt token

//     res.status(200).json({
//       status: 'success',
//       result: 'login successful',
//       access_token: jwtToken
//     })
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({
//       status: 'failed',
//       reason: 'Internal Server Error'
//     })
//   }
// })

router.post('/login', async (req, res, next) => {
  try {
    const dataObj = {
      body: req.body,
      userLoginValidator
    }

    const userService = new UserService(User)
    const jwtToken = await userService.loginUser(dataObj)

    res.status(200).json({
      status: 'success',
      result: 'login successful',
      access_token: jwtToken
    })
  } catch (err) {
    next(err)
  }
})

// change password belonging to current user
// router.post('/change-password', protectResource, async (req, res) => {
//   try {
//     const userID = req.body._jwt_.xid
//     // validate payload
//     const resetPassword = await userPasswordChangeValidator.validateAsync(req.body, {
//       stripUnknown: true
//     })

//     const dataObj = {
//       body: req.body,
//       userPasswordChangeValidator
//     }
//     console.log(resetPassword)
//     // check if user even exists !
//     const user = (await User.query().select('user_id', 'password').where('user_id', userID).limit(1))[0]
//     // no user exists exit
//     if (typeof user === 'undefined') {
//       return res.status(404).json({
//         status: 'failed',
//         reason: 'user no longer exists'
//       })
//     }

//     const passwordCheck = await bcrypt.compare(resetPassword.old_password, user.password)
//     if (passwordCheck === false) {
//       return res.status(400).json({
//         status: 'failed',
//         reason: 'incorrect password'
//       })
//     }

//     // check if both new and new again passwords match
//     if (resetPassword.new_password_again !== resetPassword.new_password) {
//       return res.status(400).json({
//         status: 'failed',
//         reason: 'new passwords must match'
//       })
//     }

//     // check if old password and new passwords match
//     if (resetPassword.old_password === resetPassword.new_password ||
//       resetPassword.old_password === resetPassword.new_password_again) {
//       return res.status(400).json({
//         status: 'failed',
//         reason: 'new password cannot be same as old password'
//       })
//     }

//     // password checks completed user is allowed to change their password
//     console.log(user)
//     // hash the new password
//     const newPassword = await bcrypt.hash(resetPassword.new_password, saltRounds)

//     // https://vincit.github.io/objection.js/api/query-builder/mutate-methods.html#insertwithrelatedandfetch
//     // update it
//     const passwordUpdated = await User.query().patch({
//       password: newPassword
//     }).findById(userID)

//     // if updated
//     if (passwordUpdated === 1) {
//       res.status(200).json({
//         status: 'success',
//         result: 'password changed'
//       })
//     } else {
//       // other wise something went wrong
//       res.status(500).json({
//         status: 'failed',
//         reason: 'Internal server error'
//       })
//     }
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({
//       status: 'failed',
//       reason: 'Internal server error'
//     })
//   }
// })

router.post('/change-password', protectResource, async (req, res, next) => {
  try {
    const dataObj = {
      body: req.body,
      userPasswordChangeValidator
    }
    // check if user even exists !
    const userService = new UserService(User)
    const passwordUpdated = await userService.changePassword(dataObj)
    // if updated
    if (passwordUpdated === 1) {
      res.status(200).json({
        status: 'success',
        result: 'password changed'
      })
    } else {
      // other wise something went wrong
      throw AppError('Internal server error', 500)
    }
  } catch (err) {
    next(err)
  }
})

// TODO: Add Deactivate or Delete account wont be needed for myjobportal
// TODO: Add forgot password that will be need for myjobportal

module.exports = router
