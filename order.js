const supplyMenu = [
  { name: "Glossy", image: "images/order/glossy.png", price: 5 },
  { name: "Matte", image: "images/order/matte.png", price: 70 },
  { name: "Textured", image: "images/order/textured.png", price: 95 },
  { name: "Hewlett Packard", image: "images/order/hpp.png", price: 155 },
  { name: "Epson", image: "images/order/epep.png", price: 120 },
  { name: "Canon", image: "images/order/can.png", price: 195 },
  { name: "Saddle Stitch", image: "images/order/saddle.png", price: 60 },
  { name: "Heated Spine", image: "images/order/spine.png", price: 50 },
  { name: "Wire", image: "images/order/wired.png", price: 30 },
]

const servicesMenu = [
  { name: "Laminate", image: "images/mani.png", price: 25 },
  { name: "Cut", image: "images/mani.png", price: 10 },
]

const coldDrinksMenu = [
  { name: "Mocha Frappe", image: "images/c-1.png", price: 120 },
  { name: "Oreo Frappe", image: "images/c2.png", price: 130 },
  { name: "Cold Coffee", image: "images/c3.png", price: 170 },
  { name: "Milktea", image: "images/c4.png", price: 85 },
  { name: "Cold Ice Tea", image: "images/c5.png", price: 90 },
  { name: "Lemon Tea", image: "images/c6.png", price: 50 },
  { name: "Softdrinks", image: "images/c7.png", price: 25 },
]

const warmDrinksMenu = [
  { name: "Coffee", image: "images/w1.png", price: 130 },
  { name: "Hot Chocolate", image: "images/w2.png", price: 190 },
  { name: "Hot Tea", image: "images/w3.png", price: 170 },
  { name: "Black Coffee", image: "images/w4.png", price: 180 },
  { name: "Matcha", image: "images/w5.png", price: 120 },
]

const sandwichesMenu = [
  { name: "Double Patty Burger", image: "images/sc1.png", price: 220 },
  { name: "Vegetable Panini", image: "images/sc2.png", price: 250 },
  { name: "Bacon Clubhouse", image: "images/sc3.png", price: 230 },
  { name: "Ham Sandwich", image: "images/sc4.png", price: 180 },
  { name: "Chicken Burger", image: "images/sc5.png", price: 200 },
  { name: "Roasted Pork Subway", image: "images/sc6.png", price: 220 },
  { name: "Chicken Halfway", image: "images/sc7.png", price: 190 },
  { name: "Salami Sandwich", image: "images/sc8.png", price: 150 },
  { name: "Egg Sandwich", image: "images/sc9.png", price: 180 },
  { name: "Clubhouse Halfway", image: "images/sc10.png", price: 220 },
]

const menu = {
  'supply': supplyMenu,
  'services': servicesMenu,
  'colddrinks': coldDrinksMenu,
  'warmdrinks': warmDrinksMenu,
  'sandwiches': sandwichesMenu,
}

const order = {}
const qty = {}
const total = {}
let total_qty = 0
let total_price = 0
let total_cash = 0

function onOrderFormChangedHandler() {
  total_qty = 0
  total_price = 0
  total_cash = 0
  for (let category in menu) {
    order[ category ].forEach((item, i) => qty[ category ][ i ] = parseInt($(item).val() || 0))
    qty[ category ].forEach((item, i) => total[ category ][ i ] = item * menu[ category ][ i ].price)
    total_qty += qty[ category ].reduce((a, b) => a + b, 0)
    total_price += total[ category ].reduce((a, b) => a + b, 0)
  }
  $(".total-orders-number").text(total_qty);
  $("#bills").val(total_price);
}

function resetForm() {
  total_qty = 0
  total_price = 0
  total_cash = 0
  $('#cash').val(0)
  $('#name').val('')
  $('#address').val('')
  $('#contact').val('')
  $('#bills').val(0)
  $('.total-orders-number').text(0)
  for (let category in menu) {
    order[ category ].forEach((item) => $(item).val(0))
  }
}

function submitForm() {
  onOrderFormChangedHandler()
  $('#invoice').text('')
  total_cash = parseInt($('#cash').val() || null)
  const change = total_cash - total_price
  const change_remarks = !total_cash ? 'No payment entered' : change < 0 ? 'Money is insufficient' : change
  const data = [
    { key: "Name", value: $('#name').val() },
    { key: "Address", value: $('#address').val() },
    { key: "Contact #", value: $('#contact').val() },
    { key: "Total Bill", value: total_price, price: true },
    { key: "Payment", value: total_cash || "", price: true },
    { key: "Change", value: change_remarks, price: true },
  ]

  // add data items to invoice
  data.forEach((item) => {
    $('#invoice').append(`
      <div class="invoice-row text-left">
        <div class="label">${item.key}: </div>
        <div class="value">${item.price ? '<span>' + item.value + '</span>' : item.value}</div>
      </div>
    `)
  })
}

$(document).ready(() => {

  for (let category in menu) {
    order[ category ] = []
    qty[ category ] = []
    total[ category ] = []
    menu[ category ].forEach((item, i) => {
      $(`#menu-${category}`).append(`
        <div class="card">
          <img src="${item.image}" class="card-img-top">
          <div class="card-body">
            ${item.name} <span class="price">${item.price}</span>
          </div>
          </div>
        </div>
      `)

      $(`#qty-${category}`).append(`
        <div class="form-row">
          <label for="${item.name}">${item.name} Quantity: </label>
          <input type="number" class="form-control" name="${item.name}" id="qty-${category}-${i}" value="0">
        </div>
      `)


      order[ category ].push(`#qty-${category}-${i}`)
    })

    $(`input[type=number]`).on('change', onOrderFormChangedHandler)
  }

  // on #cash value change set total_cash
  $('#cash').on('change', () => total_cash = parseInt($('#cash').val() || 0))

  // on submit button click call submitForm function
  $('#submit-form').on('click', submitForm)

  // on reset button click call resetForm function
  $('#reset-form').on('click', resetForm)
});

