const { Router } = require('express');

const express = require('express');
const path = require('path');

const router = Router(); 

router.use(express.static(path.join(__dirname, '..', 'public', 'groceries')));


router.use((req, res, next) => {
  console.log('Inside Groceries Auth Check Middleware')
  console.log(req.user)
  if (req.isAuthenticated()) next();
  else res.sendStatus(401);
});


router.get('/', (req, res) => {
  router.use(express.static(path.join(__dirname, '..', 'public', 'groceries')))
  res.sendFile(path.join(__dirname, '..', 'public', 'groceries', 'groceries.html'))
});

router.get('/items', async (req, res) => {
  const items = await getAllGroceries();
  console.log(items);
  return res.send(items);
});

router.get('/:item', (request, response) => {
  console.log(request.cookies);
  const { item } = request.params;
  const groceryItem = groceryList.find((g) => g.item === item);
  response.send(groceryItem);
});

router.post('/', (request, response) => {
  console.log(request.body);
  groceryList.push(request.body);
  response.send(201);
});

router.get('/shopping/cart', (request, response) => {
  const { cart } = request.session;
  console.log('Cart');
  if (!cart) {
    response.send('You have no cart session');
  } else {
    response.send(cart);
  }
});

router.post('/shopping/cart/item', (request, response) => {
  const { item, quantity } = request.body;
  const cartItem = { item, quantity };
  const { cart } = request.session;
  if (cart) {
    request.session.cart.items.push(cartItem);
  } else {
    request.session.cart = {
      items: [cartItem],
    };
  }
  response.sendStatus(201);
});

module.exports = router;