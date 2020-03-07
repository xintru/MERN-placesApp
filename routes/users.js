const { Router } = require('express')
const { check } = require('express-validator')
const router = Router()

const fileUpload = require('../middleware/file-upload')
const usersController = require('../controllers/users')

// /api/users/...

router.get('/', usersController.getUsers)

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersController.signup
)

router.post('/login', usersController.login)

module.exports = router
