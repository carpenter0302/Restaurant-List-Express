const express = require('express')
const app = express()

const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  const restaurantFiltered = restaurantList.results.filter((res) => {
    return (res.name.toLowerCase().includes(keyword.toLowerCase()) || res.category.includes(keyword))
  })
  if (restaurantFiltered.length === 0) {
    const message = `<h5>找不到和關鍵字: ${keyword} 相符的餐廳</h5>`
    res.render('index', { keyword: keyword, no_matched_result: message })
  }
  res.render('index', { restaurants: restaurantFiltered, keyword: keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find((res) => {
    return res.id.toString() === req.params.restaurant_id
  })
  if (restaurant === undefined) {
    const message = `<h5>找不到相符的餐廳</h5>`
    res.render('index', { no_matched_result: message })
  }
  res.render('show', { restaurant: restaurant })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})