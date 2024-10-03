import User from '../models/User.js';

export const getAllEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalEmployees = await User.countDocuments({ isAdmin: false });
  const employees = await User.find({ isAdmin: false })
    .select('-password')
    .skip(skip)
    .limit(limit);

  res.json({
    employees,
    currentPage: page,
    totalPages: Math.ceil(totalEmployees / limit),
    totalEmployees
  });
};

export const addEmployee = async (req, res) => {
  const { username, password, email, name } = req.body;
  const newEmployee = new User({ username, password, email, name });
  await newEmployee.save();
  res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
};
