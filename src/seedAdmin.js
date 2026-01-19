const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const existingAdmin = await User.findOne({ email: 'joneskatarinawitt@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }
    const hashedPassword = await bcrypt.hash('9843', 10);
    const admin = await User.create({
      fullName: 'Super Admin',
      email: 'joneskatarinawitt@gmail.com',
      passwordHash: hashedPassword,
      role: 'admin'
    });
    console.log('Admin created:', admin);
    process.exit();
  })
  .catch(err => { console.error(err); process.exit(1); });
