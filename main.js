const supplyMenu = [
  { name: "Glossy", image: "order/glossy.png", price: 5 },
  { name: "Matte", image: "order/matte.png", price: 70 },
  { name: "Textured", image: "order/textured.png", price: 95 },
  { name: "Hewlett Packard", image: "order/hpp.png", price: 155 },
  { name: "Epson", image: "order/epep.png", price: 120 },
  { name: "Canon", image: "order/can.png", price: 195 },
  { name: "Saddle Stitch", image: "order/saddle.png", price: 60 },
  { name: "Heated Spine", image: "order/spine.png", price: 50 },
  { name: "Wire", image: "order/wired.png", price: 30 },
  { name: "Laminate", image: "order/mani.png", price: 25 },
  { name: "Cut", image: "order/mani.png", price: 10 },
]

const coldDrinksMenu = [
  { name: "Mocha Frappe", image: "images/order/c1.png", price: 120 },
  { name: "Oreo Frappe", image: "images/order/c2.png", price: 130 },
  { name: "Cold Coffee", image: "images/order/c3.png", price: 170 },
  { name: "Milktea", image: "images/order/c4.png", price: 85 },
  { name: "Cold Ice Tea", image: "images/order/c5.png", price: 90 },
  { name: "Lemon Tea", image: "images/order/c6.png", price: 50 },
  { name: "Softdrinks", image: "images/order/c7.png", price: 25 },
]

const warmDrinksMenu = [
  { name: "Coffee", image: "images/order/w1.png", price: 130 },
  { name: "Hot Chocolate", image: "images/order/w2.png", price: 190 },
  { name: "Hot Tea", image: "images/order/w3.png", price: 170 },
  { name: "Black Coffee", image: "images/order/w4.png", price: 180 },
  { name: "Matcha", image: "images/order/w5.png", price: 120 },
]

const sandwichesMenu = [
  { name: "Double Patty Burger", image: "images/order/sc1.png", price: 220 },
  { name: "Vegetable Panini", image: "images/order/sc2.png", price: 250 },
  { name: "Bacon Clubhouse", image: "images/order/sc3.png", price: 230 },
  { name: "Ham Sandwich", image: "images/order/sc4.png", price: 180 },
  { name: "Chicken Burger", image: "images/order/sc5.png", price: 200 },
  { name: "Roasted Pork Subway", image: "images/order/sc6.png", price: 220 },
  { name: "Chicken Halfway", image: "images/order/sc7.png", price: 190 },
  { name: "Salami Sandwich", image: "images/order/sc8.png", price: 150 },
  { name: "Egg Sandwich", image: "images/order/sc9.png", price: 180 },
  { name: "Clubhouse Halfway", image: "images/order/sc10.png", price: 220 },
]

const menu = {
  'supply': supplyMenu,
  'warmdrinks': warmDrinksMenu,
  'colddrinks': coldDrinksMenu,
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




const footerEl = document.getElementsByTagName('footer')[0];
footerEl.setAttribute('class', 'container-fluid text-light py-4');
footerEl.innerHTML = `


<!-- row 1  -->
<section class="footer">
		<div class="box-container text-center text-md-left">
			<div class="row">
		<div class="box col-md-3 mt-md-0 mt-3">
			<h3>Work With Us</h3>
			<p>Our clients have developed long-term partnerships as a result of our consistent delivery of high-quality prints. 
			We are dedicated in providing high-quality custom printing services. Our motto is high-quality printing and on-time delivery. 
			Vitaly Tea provides high-quality print services at a reasonable cost.</p>
		</div>
		<div class="box col-md-3 mb-md-0 mb-3">
			<h3>Contact Information</h3>
			<p>We are open and glad to serve you starting at 7AM – 5PM, Monday - Saturday only. 
			We are happy to assist our clients in any way we can, so please call us at 2-333-267-2974, email us 
			at vitalyTea@gmail.com</p>
			<a href="terms.html">Terms</a>&nbsp; &nbsp; &nbsp; &nbsp;<a href="privacy.html">Privacy Policy</a>
		</div>
		<div class="box col-md-3 mb-md-0 mb-3">
			<div class="social-media">
                <a href="https://www.facebook.com/" class= "fab fa-facebook-f"></a>
                <a href="https://twitter.com/home" class= "fab fa-twitter"></a>
                <a href="https://www.instagram.com/" class= "fab fa-instagram"></a>
                <a href="https://www.linkedin.com/feed/" class= "divide fab fa-linkedin"></a>
				<a href="https://www.youtube.com/" class= "fab fa-youtube"></a>
                <a href="https://www.pinterest.ph/" class= "fab fa-pinterest"></a>
            </div>
		</div>
		<div class="box col-md-3 mb-md-0 mb-3">
			<label for="email">Subscribe to our Newsletter</label>
            <input type="email" class="email form-control mb-4" name="email" placeholder="example@email.com">
            <button class="btn btn-success" onclick="alert('Thank you for Subscribing!')">Submit</button>
		</div>
		</div>
		</div>
	</section>
`
