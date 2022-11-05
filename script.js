let total = 0;

//if statement checking if page has loaded
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

//funtion to execute page functionality when everything is loaded
function ready() {
  let removeCartItemButtons = document.getElementsByClassName("btn-danger");
  for (let i = 0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  let quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  let addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (let i = 0; i < addToCartButtons.length; i++) {
    let button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }
  document.querySelector(".btn-purchase").disabled = true;
  document.querySelector("#checkout").style.backgroundColor = "grey";
  document.getElementsByClassName("btn-purchase")[0].addEventListener("click", purchaseClicked);
  document.querySelector(".shipping-form").style.display = "none";
}

//----------------- check out button functionality---------------------
//Generate random refrence number for order
function generateRanNum() {
  let refCode = [];
  for (let i = 0; i < 10; i++) {
    let ranNum = Math.floor(Math.random() * 10);
    refCode.push(ranNum);
  }
  return refCode.join("");
}

//function for check out button

function purchaseClicked() {
  let purchaseRefrence = generateRanNum();
  alert(`Thank you for your purchase. Your refrence number is: REF-${purchaseRefrence}`);
  let cartItems = document.getElementsByClassName("cart-items")[0];
  document.querySelector(".sub-total-price").innerText = "R0.00";
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
  newVat();
}

//-----------------------------------------------------------------

function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  updateCartTotal();
  newVat();
}

function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }

  updateCartTotal();
  newVat();
}

function addToCartClicked(event) {
  let button = event.target;
  let shopItem = button.parentElement.parentElement;
  let title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  let price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  let imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  document.querySelector("#checkout").disabled = false;
  addItemToCart(title, price, imageSrc);
  updateCartTotal();
  newVat();
}

function addItemToCart(title, price, imageSrc) {
  let cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  let cartItems = document.getElementsByClassName("cart-items")[0];
  let cartItemNames = cartItems.getElementsByClassName("cart-item-title");

  //......................change button colours to active
  document.querySelector(".delivery").style.backgroundColor = "black";
  document.querySelector(".discount-btn").style.backgroundColor = "black";
  document.querySelector("#checkout").style.backgroundColor = "black";

  for (let i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }
  let cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" >
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn-danger" type="button">Remove</button>
        </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem);
  cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChanged);

  alert(`${price} has been added to your cart`);
}

// function to updat cart total
function updateCartTotal() {
  let cartItemContainer = document.getElementsByClassName("cart-items")[0];
  let cartRows = cartItemContainer.getElementsByClassName("cart-row");
  let total = 0;
  let vat = 0;
  let subtotal = 0;
  for (let i = 0; i < cartRows.length; i++) {
    let cartRow = cartRows[i];
    let priceElement = cartRow.getElementsByClassName("cart-price")[0];

    let quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
    let price = parseFloat(priceElement.innerText.replace("R", ""));
    let quantity = quantityElement.value;

    total = total + price * quantity;
    document.querySelector(".delivery").disabled = false;

    subtotal = subtotal + price * quantity;

    document.getElementsByClassName("vat-total-price")[0].innerText = "R" + vat;
    document.getElementsByClassName("sub-total-price")[0].innerText = "R" + subtotal;
  }

  total = total.toFixed(2);
  document.getElementsByClassName("cart-total-price")[0].innerText = "R" + total;
}

// default disabled state of shipping button
if (total <= 0) {
  document.querySelector(".delivery").disabled = true;
}

//......................change button colours to inactive
document.querySelector(".delivery").style.backgroundColor = "grey";
document.querySelector(".discount-btn").style.backgroundColor = "grey";

document.querySelector(".del-display").style.display = "none";

// calculating shipping cost to order (remove add shipping toggle)
document.querySelector(".delivery").addEventListener("click", function () {
  document.querySelector(".shipping-form").style.display = "inline";
  let newTotal = parseFloat(document.querySelector(".cart-total-price").innerHTML.replace("R", ""));
  let minusVat = parseFloat(document.querySelector(".vat-total-price").innerHTML.replace("R", ""));
  document.querySelector(".del-display").innerHTML = "Delivery Selected!";
  document.querySelector(".discount-display").style.display = "none";
  document.querySelector(".discount-btn").disabled = true;

  document.querySelector(".del-display").style.display = "inline";

  //......................change button colours to inactive
  document.querySelector(".discount-btn").style.backgroundColor = "grey";

  if (document.querySelector(".delivery").value == 0) {
    newTotal = newTotal + 100 - minusVat;
    newTotal = newTotal.toFixed(2);
    document.getElementsByClassName("del-total-price")[0].innerText = "R" + "100.00";
    document.getElementsByClassName("cart-total-price")[0].innerText = "R" + newTotal;
    newVat();
    document.querySelector(".delBtn").value = 1;
  } else {
    document.querySelector(".shipping-form").style.display = "none";
    document.querySelector(".del-display").innerHTML = "Self Collection Selected";

    let newSubTotal = parseFloat(document.querySelector(".sub-total-price").innerHTML.replace("R", ""));
    newTotal = newTotal - 100 - minusVat;
    newTotal = newTotal + newTotal * 0.15;
    let reVat = newTotal - newSubTotal;
    console.log(reVat.toFixed(2));
    newTotal = newTotal.toFixed(2);
    document.getElementsByClassName("vat-total-price")[0].innerText = "R" + reVat.toFixed(2);
    document.getElementsByClassName("del-total-price")[0].innerText = "R" + "0.00";
    document.getElementsByClassName("cart-total-price")[0].innerText = "R" + newTotal;
    document.querySelector(".delBtn").value = 0;
  }
});

// calculating discount
function updateTotal() {
  document.getElementById("amtOut").innerHTML = document.getElementById("amtIn").value;
}

function applyDiscount() {
  let newSubTotal = parseFloat(document.querySelector(".sub-total-price").innerHTML.replace("R", ""));
  let newTotal = parseFloat(document.querySelector(".cart-total-price").innerHTML.replace("R", ""));
  let deliverFee = parseFloat(document.querySelector(".del-total-price").innerHTML.replace("R", ""));
  if (document.getElementById("code").value.toUpperCase() == "CODE") {
    let discount = 15;
    let disAmt = 0.85 * newSubTotal;
    let disAmtTot = newSubTotal - disAmt;
    document.getElementById("disOut").innerHTML = disAmt.toFixed(2);
    document.getElementsByClassName("dis-total-price")[0].innerText = "R" + disAmtTot.toFixed(2);
    newTotal = disAmt + disAmt * 0.15 + deliverFee;
    let discountVat = disAmt * 0.15;
    document.getElementsByClassName("cart-total-price")[0].innerText = "R" + newTotal.toFixed(2);
    document.getElementsByClassName("vat-total-price")[0].innerText = "R" + discountVat.toFixed(2);
    document.getElementsByClassName("sub-total-price")[0].innerText = "R" + newSubTotal.toFixed(2);
  } else {
    document.getElementById("disOut").innerHTML = "Sorry No Discount Today ";
  }
}

//CalculateVAT
function newVat() {
  let newTotalVat = parseFloat(document.querySelector(".cart-total-price").innerHTML.replace("R", ""));
  let finVat = newTotalVat * 0.15;

  newTotalVat = newTotalVat + finVat;
  document.getElementsByClassName("cart-total-price")[0].innerText = "R" + newTotalVat.toFixed(2);
  document.getElementsByClassName("vat-total-price")[0].innerText = "R" + finVat.toFixed(2);
}
// function checkOutValid() {
//   let checkTotal = parseFloat(document.querySelector(".cart-total-price").innerHTML.replace("R", ""));

//   if (checkTotal <= 0) {
//     document.querySelector("#checkout").disabled = false;
//   }
// }
