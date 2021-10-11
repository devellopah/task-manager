const app = require('./app')
const port = process.env.PORT || 3000

app.set('port', port)

app.listen(port, () => {
  console.log('running server on port ' + port)
})