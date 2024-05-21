//реализация SPA

const formClientRegistrationEnt = document.querySelector(".form_reg_first")
const formClientRegistrationConfirn = document.querySelector(".form_reg_two")
const clientAccount = document.querySelector(".client")
const historyOrderPageClinet = document.querySelector(".history")

const nameValueInputFirstForm = document.getElementById('passwordEntFirst')
const emailValueInputFirstForm = document.getElementById('emailent')

const btnRegInv = document.querySelector(".promo_btn")
const btnRegEntClient = document.getElementById("btnEntry")
const btnRegistration = document.getElementById("btnReg")
const btnRegistrationTwo = document.getElementById("btnRegTwo")

const mainPageElements = document.querySelectorAll(".headers, .promo, .benefits, .mobile, .choice, .require, .world, .footer");
const mainPageHash = {
  "#main": mainPageElements
}

const forms = {
  "#form_reg_first": formClientRegistrationEnt,
  "#form_reg_two": formClientRegistrationConfirn,
  "#client": clientAccount,
  "#history": historyOrderPageClinet,
  ...mainPageHash
}

const renderTable = () => {
  const currentUserId =localStorage.getItem('currentUserId')
  const currentUser = localStorage.getItem(currentUserId)
  const summOrder = document.getElementById('summOrderCell') 
  const summAllRequest = document.getElementById('priceSumm') 
  if(currentUser){
    const user = JSON.parse(currentUser)
    const userName = document.querySelector('#nameSurname')
    userName.innerHTML = user.name
    summAllRequest.innerHTML = user.submit ? user.submit.reduce((summ, item) => +item[3] + summ, 0) : 0
    const submitCount = (user.submit ? user.submit.length : 0)
    summOrder.innerHTML = submitCount
    console.log(summAllRequest)
  }
}

const showForm = (form) => {
  renderTable()
  for (const key in forms) {
    if (key === "#main") {
      mainPageHash[key].forEach(element => element.style.display = key === form ? "block" : "none")
    } else {
      forms[key].style.display = key === form ? "block" : "none"
    }
  }
}

const handleHashChange = () => {
  const currentHash = window.location.hash;
  const formToShow = forms[currentHash];

  if (formToShow === undefined) {
    window.location.hash = "#main"
    showForm("#main")
  } else {
    showForm(currentHash)
  }
}

window.addEventListener("hashchange", handleHashChange);

for (const key in forms) {
  if (key !== "#main") {
    forms[key].style.display = "none"
  }
}

btnRegInv.addEventListener("click", function () {
  window.location.hash = "#form_reg_first"
})

btnRegEntClient.addEventListener("click", function () {
  const password = nameValueInputFirstForm.value
  const email = emailValueInputFirstForm.value
  const user = localStorage.getItem(`${email},${password}`)

  if (user) {
    window.location.hash = "#client"
    localStorage.setItem('currentUserId', `${email},${password}`)
    console.log(window.location.hash)
  } else {
    alert('Такого пользователя нет')
  }
})

btnRegistration.addEventListener("click", function () {
  window.location.hash = "#form_reg_two"
});

handleHashChange()

// валидация формы  1 - 2 для регистрации в системе
const passwordClient = document.getElementById('passwordClientTwo')
const inpBoxSave = document.querySelectorAll('.form_reg_two-control')

function emailValid(email) {
  return !/^\S+@\S+\.\S+$/.test(email)
}

function passDntRepeat(password, rePassword) {
  return password !== rePassword
}

function validateInput(input) {
  const key = input.name
  const value = input.value.trim()

  if (value === '') {
    showError(input, 'Поле обязательно для ввода')
  } else if (key === 'email' && emailValid(value)) {
    showError(input, 'Пожалуйста, введите действительный адрес электронной почты.')
  } else if (key === 're-password' && passDntRepeat(passwordClient.value, value)) {
    showError(input, 'Пароли не совпадают')
  } else {
    hideError(input)
  }
}

inpBoxSave.forEach(input => {
  input.addEventListener('blur', () => {
    validateInput(input)
  })

  input.addEventListener('focus', () => {
    hideError(input)
  })
})

function showError(input, message) {
  const errorElement = input.nextElementSibling
  errorElement.textContent = message
  errorElement.style.display = 'block'
}

function hideError(input) {
  const errorElement = input.nextElementSibling;
  errorElement.style.display = 'none'
}

//логика для формы регистрации - 2я форма
function allFieldsNotEmpty(formSelector) {
  const inputElements = document.querySelectorAll(`${formSelector} input`)
  for (const input of inputElements) {
    const value = input.value.trim()
    if (value === '') {
      return false
    }
  }
  return true
}

btnRegistrationTwo.addEventListener('click', function (e) {
  const user = {}
  let emptyField = false
  console.log(user)

  inpBoxSave.forEach(input => {
    const key = input.name
    const value = input.value.trim()
    if (input.closest('.form_reg_two')) {
      user[key] = value
      if (value === '') {
        emptyField = true
      }
    }
  })
  if (!emptyField && allFieldsNotEmpty('.form_reg_two')) {
    localStorage.setItem(`${user.email},${user.passwordClient}`, JSON.stringify(user))
    console.log('Данные успешно сохранены в localStorage')
    confirm('Вы зарегистрированы в приложении!')
    window.location.hash = "#form_reg_first"
  } else {
    alert('Пожалуйста, заполните все поля формы')
  }  
})

//client
const divOrderClientInfo = document.getElementsByClassName('infoOrderClient')
const btnSubmitOrdProc = document.getElementsByClassName("submitOrdProces")
const btnCancOrd = document.getElementsByClassName("CancellOrder")
const btnSubtOrd = document.getElementsByClassName("submitOrder")
const sallaryButtonClient = document.getElementById("sallaryButton")
const historyButtonClient = document.getElementById("historyButton")

Array.from(btnCancOrd).forEach(button => {
  button.style.display = 'none'
})

Array.from(btnSubmitOrdProc).forEach(button => {
  button.addEventListener('click', function(e) {
    this.style.display = 'none'
    const index = Array.from(btnSubmitOrdProc).indexOf(this)
    if (index !== -1 && index < btnCancOrd.length) {
      btnCancOrd[index].style.display = 'block'
    }
  })
})

const allButtonsDeleteInfo = Array.from(btnCancOrd).concat(Array.from(btnSubtOrd));

allButtonsDeleteInfo.forEach(button => {
  button.addEventListener('click', function(e) {
    const row = this.closest('.row')
    const infoOrderClient = row ? row.querySelector('.infoOrderClient') : null
    const processButton = row ? row.querySelector('.submitOrdProces') : null

    if (infoOrderClient && processButton && processButton.dataset.processed === "true") {
      infoOrderClient.dataset.status = "completed"
      console.log(this.classList)
      const buttonType = this.classList.contains('submitOrder') ? "submit" : "cancel"
      saveOrderToLocalStorage(infoOrderClient, buttonType)
      const buttonsInSection = row ? row.querySelectorAll('.col-md-1') : null
      buttonsInSection.forEach(btn => {
        btn.remove()
      })
      infoOrderClient.remove()
    } 
    else {
      alert('Необходимо сначала обработать заказ')
    }
    renderTable()
  })
})

const processButtons = document.querySelectorAll('.submitOrdProces')
processButtons.forEach(processButton => {
  processButton.addEventListener('click', function(e) {
    this.dataset.processed = "true"
  })
})

function saveOrderToLocalStorage(infoOrderClient, buttonType) {
  const orderData = Array.from(infoOrderClient.querySelectorAll('.col-md-1')).map(td => td.textContent)
  const currentUserId = localStorage.getItem('currentUserId')
  const currentUser = localStorage.getItem(currentUserId)
  if (currentUser){
    const user = JSON.parse(currentUser)
    if(!user[buttonType]){
      user[buttonType] = []
    }
    user[buttonType].push(orderData)
    localStorage.setItem(currentUserId, JSON.stringify(user))
  }
}


sallaryButtonClient.addEventListener('click', function(e) {
  alert('Обработка выплаты произойдет в ближайшие 15 минут!')
})

historyButtonClient.addEventListener('click', function(e) {
  window.location.hash = "#history"
  const curentUserId  = localStorage.getItem('currentUserId')
  const currentUser = localStorage.getItem(curentUserId)
  if (currentUser) {
    const user = JSON.parse(currentUser)
    generateTable(user.submit)
    generateTable(user.cancel)
    }
})

function generateTable(data = []) {
  var table = document.createElement('table')
  data.forEach(function (row) {
    var tr = document.createElement('tr')
    row.forEach(function (cellData) {
      var td = document.createElement('td')
      td.appendChild(document.createTextNode(cellData))
      tr.appendChild(td)
    })
    table.appendChild(tr)
  })
  const historyTable = document.getElementById('historyContainer')
  historyTable.innerHTML = ''
  historyTable.appendChild(table)
}

const menu = document.querySelector('.menu')
    menuItem = document.querySelectorAll('.menu_item')
    hamburger = document.querySelector('.hamburger')

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active')
        menu.classList.toggle('menu_active')
    })

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active')
            menu.classList.toggle('menu_active')
        })
    })











