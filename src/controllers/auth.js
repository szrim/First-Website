const User = require("../database/schemas/User");
const { hashPassword, isStrongPassword } = require('../utils/helpers');

async function authRegisterController(request, response) {
  console.log('Received registration request:', request.body);
  const { email, username, password, cPassword } = request.body;

  if (!email || !username || !password) {
    response.status(400).send({ msg: 'Email and password are required.' });
    return;
  }

  try {
    const userDB = await User.findOne({ email });
    if (userDB) {
      response.status(400).send({ msg: 'User already exists!' });
    } else {
      const hashedPassword = hashPassword(password);
      console.log('Hashed password:', hashedPassword);

      const newUser = await User.create({ password: hashedPassword, email, username, loginTimes: 1 });
      request.login(newUser, (err) => {
        if(err) {
          response.status(500).send({msg: 'Error creating session'})
          return;
        }
        response.status(201).redirect('/api/v1/profile');
      })
    }
  } catch (error) {
    console.error('Error during registration:', error);
    response.status(500).send('Internal Server Error');
  }
};

module.exports = { authRegisterController };
