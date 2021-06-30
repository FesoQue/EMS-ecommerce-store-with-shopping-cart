// SELECTORS
const menuBtn = document.querySelector('.hamburger');
const menuList = document.querySelector('.nav_list');
const nav = document.querySelector('nav');
const shoppingCart = document.querySelector('.cart');
const cartModal = document.querySelector('.cart_modal_wrapper');
const rowWrapper = document.querySelector('.cart_items');
const cartBtn1 = document.querySelector('.cart_btn1');
const cartProductEl = document.querySelectorAll('.gadgets');
const cartTotal = document.querySelector('.cart_total');
const form = document.querySelector('#myForm');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const telInput = document.querySelector('#tel');
const summaryModal = document.querySelector('.summary_modal');
const okBtn = document.querySelector('.ok-btn');

const images = document.querySelectorAll('.lazyload');

// FUNCTIONS

const handleMenu = () => {
  if (menuBtn) {
    menuBtn.classList.toggle('is-active');
    menuList.classList.toggle('show_nav');
  }
};

// ********** fixed navbar ************
window.addEventListener('scroll', () => {
  const scrollHeight = window.pageYOffset;
  const navHeight = nav.getBoundingClientRect().height;
  const widthVal = document.documentElement.clientWidth;
  if (scrollHeight > navHeight && widthVal <= 599) {
    nav.classList.add('fixed_nav');
  } else {
    nav.classList.remove('fixed_nav');
  }
});

// ********** smooth scroll ************
const scrollLinks = document.querySelectorAll('.nav_link');
scrollLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    //navigate to specific target
    const id = e.currentTarget.getAttribute('href').slice(1);
    const element = document.getElementById(id);
    //calculate the heights
    const navHeight = nav.getBoundingClientRect().height;
    const containerHeight = menuList.getBoundingClientRect().height;
    const fixedNav = nav.classList.contains('fixed_nav');
    let position = element.offsetTop - navHeight;
    if (!fixedNav) {
      position = position - navHeight;
    }
    if (navHeight > 80) {
      position = position + containerHeight;
    }
    window.scrollTo({
      left: 0,
      top: position,
    });
    menuList.classList.toggle('show_nav');
    menuBtn.classList.remove('is-active');
  });
});

// ********** handle modal display ************
const handleShoppingCart = () => {
  cartModal.classList.add('show_cart_modal');
};
cartBtn1.addEventListener('click', () => {
  cartModal.classList.remove('show_cart_modal');
});

// ********** loop through each product ************
const handleCartList = (e) => {
  cartProductEl.forEach((cartList) => {
    const cartProductInfo = cartList.children[1];
    const addToCartBtn = cartProductInfo.children[1];

    addToCartBtn.addEventListener('click', handleAddToCart);
  });
};
handleCartList();

function handleAddToCart(e) {
  const btn = e.target;
  // access all product info
  const el1 = btn.parentElement.previousElementSibling;
  const productName = btn.previousElementSibling.innerText;
  const el2 = el1.children[1];
  const productPrice = el2.children[1].innerText;

  if (btn && btn.innerText === 'Add to cart') {
    btn.innerText = 'Remove from cart';
    btn.style.background = '#ffcd9e';

    // create cart DOM elements
    const cartRow = document.createElement('div');
    cartRow.className = 'cart_row cart_item_row';
    cartRow.setAttribute('data-amount', '1');
    // item serial no
    const sNo = document.createElement('p');
    sNo.className = 'col-1';
    // cart item name
    const cartPName = document.createElement('p');
    cartPName.className = 'col-2';
    cartPName.innerText = productName;
    // cart item price
    const cartPPrice = document.createElement('p');
    cartPPrice.className = 'col-3';
    cartPPrice.innerText = productPrice;
    // cart item qty
    const inputQtyEl = document.createElement('input');
    inputQtyEl.className = 'col-4 qty';
    inputQtyEl.setAttribute('type', 'number');
    inputQtyEl.setAttribute('value', 1);
    inputQtyEl.setAttribute('name', 'item_qty');

    inputQtyEl.addEventListener('change', handleQtyNo);

    // remove cart item btn
    const removeBtn = document.createElement('button');
    removeBtn.className = 'col-5 remove-btn cta-btn';
    removeBtn.innerText = 'Remove';
    // append child el
    cartRow.append(sNo, cartPName, cartPPrice, inputQtyEl, removeBtn);
    rowWrapper.appendChild(cartRow);
    removeBtn.addEventListener('click', (e) => {
      btn.innerText = 'Add to cart';
      btn.style.background = '#ff7a00';
      handleRemoveItem(cartRow);
    });
  }
  updatePrice();
  updateCartItem();
  resetCartBtn(btn);
}
// ********** remove item(s) from cart ************
const handleRemoveItem = (el) => {
  el.remove();
  updatePrice();
  updateCartItem();
};
// ********** handle item quantity ************
const handleQtyNo = (e) => {
  if (isNaN(e.target.value) || e.target.value <= 0) {
    e.target.value = 1;
  }
  updatePrice();
};
// ********** update price ************
const updatePrice = () => {
  const cart_row = rowWrapper.children;
  let priceTotal = 0;
  for (let i = 0; i < cart_row.length; i++) {
    const element = cart_row[i];
    element.children[0].innerText = i + 1; //get cart items serial num
    const price = element.querySelector('.col-3').innerText.replace('₦', '');
    let priceVal = parseFloat(price);
    let qtyVal = element.children[3].value;
    let itemQty = parseFloat(qtyVal);
    let totalAmt = priceVal * itemQty;
    priceTotal += totalAmt;
  }
  //format number to have comma as a thousand seperator
  cartTotal.innerText = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(priceTotal).split(".")[0];;
  //Delete .split(".")[0] if you want two decimal places to appear.
};

// ********** update shopping cart item count ************
const updateCartItem = () => {
  const cart_row = rowWrapper.children;
  const cartItemNo = document.querySelector('.cart_no');
  let cartItemTotal = 0;
  for (let el = 0; el < cart_row.length; el++) {
    const element = cart_row[el];
    const cartVal = parseFloat(element.dataset.amount);
    cartItemTotal += cartVal;
  }
  cartItemNo.innerText = cartItemTotal;
  return cartItemTotal;
};

// ********** handle form ************
const handleFormInfo = (e) => {
  e.preventDefault();

  const nameValue = nameInput.value;
  const emailValue = emailInput.value;
  const telValue = telInput.value;
  const validateTelNum = /^[0]\d{10}$/gm;
  const parentEl1 = nameInput.parentElement.parentElement;
  const parentEl2 = emailInput.parentElement.parentElement;
  const parentEl3 = telInput.parentElement.parentElement;

  nameValue === ''
    ? setErrMsg(nameInput, 'Name cannot be blank')
    : setSuccessMsg(nameInput);

  emailValue === '' || !validateEmail(emailValue)
    ? setErrMsg(emailInput, 'Enter valid email')
    : setSuccessMsg(emailInput);

  telValue.match(validateTelNum)
    ? setSuccessMsg(telInput)
    : setErrMsg(telInput, 'Enter valid 11 digits number');

  if (
    parentEl1.classList.contains('success') &&
    parentEl2.classList.contains('success') &&
    parentEl3.classList.contains('success') &&
    rowWrapper.innerHTML !== ''
  ) {
    // display item summary (directly from the cart)
    const cartRows = document.querySelectorAll('.cart_item_row');
    cartRows.forEach((row) => {
      showSummary(row);
    });

    //by passing in required info such as: amount & email, paystack transaction will be initialized
    const amount = cartTotal.innerText.replace('₦', '');
    const amountVal = parseFloat(amount);
    payWithPaystack(e, emailValue, amountVal);
  } else if (rowWrapper.innerHTML === '') {
    alert('Cart cannot be empty');
  }
};

// ********** handle form success ************
const setSuccessMsg = (el) => {
  const formControl = el.parentElement.parentElement;
  formControl.className = 'form_control success';
};

// ********** handle form error ************
const setErrMsg = (el, msg) => {
  const formControl = el.parentElement.parentElement;
  formControl.className = 'form_control error';
  const small = el.parentElement.nextElementSibling;
  small.innerText = msg;
};

// ********** validate email ************
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// ********** handle cart summary ************
const showSummary = (foo) => {
  const s_No = foo.children[0].innerText;
  const s_Name = foo.children[1].innerText;
  const s_qty = foo.children[3].value;
  const summaryItems = document.querySelector('.summary_items');
  const userName = document.querySelector('#user');

  // remove item from summary
  const removeBtn = foo.children[4];
  removeBtn.addEventListener('click', () => {
    handleRemoveItem(row);
  });

  // create summary DOM elements
  const row = document.createElement('div');
  row.className = 'cart_row';
  // s/no
  const summarySno = document.createElement('p');
  summarySno.className = 'col-1';
  summarySno.innerText = s_No;
  // item
  const summaryPName = document.createElement('p');
  summaryPName.className = 'col-2';
  summaryPName.innerText = s_Name;
  // qty
  const summaryQty = document.createElement('p');
  summaryQty.className = 'col-3';
  summaryQty.innerText = s_qty;

  row.append(summarySno, summaryPName, summaryQty);
  summaryItems.appendChild(row);

  const name_value = nameInput.value;
  userName.innerText = name_value;
};

// ********** show cart summary ************
const showSummaryModal = () => {
  summaryModal.classList.add('show_summary_modal');
  cartModal.classList.remove('show_cart_modal');
};

// ********** close summary modal and reset cart btn ************

function resetCartBtn(btn) {
  okBtn.addEventListener('click', () => {
    // reset cart btn
    btn.innerText = 'Add to cart';
    btn.style.background = '#ff7a00';

    summaryModal.classList.remove('show_summary_modal');

    // clear summary
    const summaryItems = document.querySelector('.summary_items');
    summaryItems.innerHTML = '';
  });
}

// ********** reset cart after payment ************
const resetStatus = () => {
  const cartItemNo = document.querySelector('.cart_no');

  emailInput.value = '';
  nameInput.value = '';
  telInput.value = '';
  const parentEl1 = nameInput.parentElement.parentElement;
  const parentEl2 = emailInput.parentElement.parentElement;
  const parentEl3 = telInput.parentElement.parentElement;
  if (
    emailInput.value === '' &&
    nameInput.value === '' &&
    telInput.value === ''
  ) {
    parentEl1.classList.remove('success');
    parentEl2.classList.remove('success');
    parentEl3.classList.remove('success');
  }

  rowWrapper.innerHTML = '';

  cartTotal.innerText = '₦0.00';
  cartItemNo.innerText = '0';
  serialNo = 0;
};

// ********** lazyload with intersection observer ************
const options = {
  rootMargin: '0px',
  threshold: 0.4,
};

let observer = new IntersectionObserver(handleLazyload, options);

images.forEach((img) => {
  observer.observe(img);
});

function handleLazyload(entries, obs) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
}

// ********** pay with paystack ************
function payWithPaystack(e, arg1, arg2) {
  e.preventDefault();
  let handler = PaystackPop.setup({
    key: 'pk_test_fccce0bd935b9aa330b4cc1576cd0adeb194c4c6', // Replace with your public key
    email: arg1,
    amount: arg2 * 100,
    ref: '' + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
    // label: "Optional string that replaces customer email"
    onClose: function () {
      alert('Window closed.');
    },
    callback: function () {
      showSummaryModal();
      resetStatus();
    },
  });
  handler.openIframe();
}

// EVENT LISTENERS
menuBtn.addEventListener('click', handleMenu);
shoppingCart.addEventListener('click', handleShoppingCart);
form.addEventListener('submit', handleFormInfo);
// okBtn.addEventListener('click', closeSummaryModal);
