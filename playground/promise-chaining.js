require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task
//   .findByIdAndDelete('60fc77510cf166314a16f3f5')
//   .then(task => {
//     console.log(task)
//     return Task.countDocuments({ completed:false })
//   })
//   .then(result => console.log(result))
//   .catch(err => console.log(err))

const deleteTaskAndCount = async (id) => {
  await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({ completed: false })
  return count
}

deleteTaskAndCount('60fddf7985b74f221cc1b2e0')
  .then(count => console.log(count))
  .catch(err => console.log(err))
