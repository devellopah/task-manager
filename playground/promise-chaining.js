require('../src/db/mongoose')
const Task = require('../src/models/task')

Task
  .findByIdAndDelete('60fc77510cf166314a16f3f5')
  .then(task => {
    console.log(task)
    return Task.countDocuments({ completed:false })
  })
  .then(result => console.log(result))
  .catch(err => console.log(err))