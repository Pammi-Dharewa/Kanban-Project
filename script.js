const addBtn = document.querySelector('.add-btn')
const modalCont = document.querySelector('.modal-cont')
const mainCont = document.querySelector('.main-cont')
const allpriorityColors = document.querySelectorAll('.priority-color')
const textAreaCont = document.querySelector('.textArea-cont')
const removeBtn = document.querySelector('.remove-btn')
const toolBoxColors = document.querySelectorAll('.color-box')

let addTaskflag = false
let removeTaskflag = false
let modalPriorityColor = 'black'
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']
let ticketsArr = []

const ticketFromLocalStorage = JSON.parse(localStorage.getItem('ticketsArr'))
if(ticketFromLocalStorage){
  ticketsArr = ticketFromLocalStorage
  ticketsArr.forEach(function(create){
    createTicket(create.id, create.ticketColor, create.ticketTask)
  })
}

//adding event in add button, when pressed modal should appear
addBtn.addEventListener('click', 
  function(){
    addTaskflag =  !addTaskflag
    if(addTaskflag == true){
      modalCont.style.display = 'flex'
    }else{
      modalCont.style.display = 'none'
    }
  }
)

// creating new ticket
function createTicket(ticketId,ticketColor, ticketTask){
  let id;
  if(!ticketId){
    id = shortid()
  }else{
    id = ticketId
  }

  let ticketCont = document.createElement('div')
  ticketCont.setAttribute('class', 'task-ticket')

  ticketCont.innerHTML= `
   <div class="ticket-color ${ticketColor} "></div>
   <div class="ticket-id">${id}</div>
   <div class="ticket-area">${ticketTask}</div>
   <div class="ticket-lock"> 
   <i class="fa-solid fa-lock"></i>
   </div>  
`

   mainCont.appendChild(ticketCont)
   console.log(ticketCont)
   handleRemove(id, ticketCont)
   handleLock(id, ticketCont)
   handleColor(id, ticketCont)
   
   if(!ticketId){
    ticketsArr.push({id, ticketColor, ticketTask})
    localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr))
   }
   console.log(ticketsArr)
}



// when pressing shift key creating new ticket
modalCont.addEventListener('keydown',
  function(e){
    let key = e.key
    if(key == 'Shift'){
      let taskContent = textAreaCont.value
     
      createTicket(null, modalPriorityColor, taskContent)
      modalCont.style.display = 'none'
      textAreaCont.value = ''
    } 
  }
)


//getting the color for new ticket

allpriorityColors.forEach(function(colorElem){
  colorElem.addEventListener('click', function(){
    //remove the active from other colors
    allpriorityColors.forEach(function(priorityColorElem){
      priorityColorElem.classList.remove('active')
    })
    colorElem.classList.add('active')
    modalPriorityColor = colorElem.classList[1]
  })
})

//to Show alert msg when we activate dlt button 

removeBtn.addEventListener('click', 
  function(){
    removeTaskflag = !removeTaskflag
    if(removeTaskflag){
      alert('The dlt button is activated')
      removeBtn.style.color = 'yellow'
    }else{
      alert('The dlt button is deactivated')
      removeBtn.style.color = 'red'
    }
  }
)

// to dlt entire ticket if dlt buttn is activated

function handleRemove(id, ticket){
ticket.addEventListener('click', function(){
  if(removeTaskflag){
    ticket.remove();

    //updated tickets in array
    ticketsArr = ticketsArr.filter(function(ticket){
      return ticket.id !== id
    })
    localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr))


  }else{
    return
  }
})
}


//to change the lock img
let closeLock = "fa-lock"
let openLock = "fa-lock-open"

function handleLock(id, ticket){
  let tickLockElem = ticket.querySelector('.ticket-lock')
  let ticketLockIcon = tickLockElem.children[0];

  let ticketTaskArea = document.querySelector('.ticket-area');


  ticketLockIcon.addEventListener('click', function(){
    if(ticketLockIcon.classList.contains(closeLock)){
      ticketLockIcon.classList.remove(closeLock)
      ticketLockIcon.classList.add(openLock)
      ticketTaskArea.setAttribute('contenteditable', 'true')
    }else{
      ticketLockIcon.classList.remove(openLock)
      ticketLockIcon.classList.add(closeLock)
      ticketTaskArea.setAttribute('contenteditable', 'false')
      
      let idx = ticketsArr.findIndex(function(ticket){
        return ticket.id == id
      })
      ticketsArr[idx].ticketTask = ticketTaskArea.textContent;
      localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr))
      console.log(ticketsArr)
    }
  })
}


// to change the color of ticket

function handleColor(id, ticket){
  let ticketColorBand = ticket.querySelector('.ticket-color')
  ticketColorBand.addEventListener('click', 
    function(){
      let currentColor = ticketColorBand.classList[1]
      let currentColorIndx = colors.findIndex(function (color){
        return currentColor == color
      })

      currentColorIndx++;
      let newTicketColorIndx = currentColorIndx % colors.length
      let newTicketColor = colors[newTicketColorIndx]

      ticketColorBand.classList.remove(currentColor)
      ticketColorBand.classList.add(newTicketColor)

      //updates ticket in ticketarray
      let idx = ticketsArr.findIndex(function(ticket){
        return ticket.id == id
      })
      
      ticketsArr[idx].ticketColor = newTicketColor
      localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr))


  })
}



//toolbox filter wrt colors

toolBoxColors.forEach(function(ele, i){
  ele.addEventListener('click', function(){
    let selectedToolBoxColor = toolBoxColors[i].classList[1]
    
    let filteredTickets = ticketsArr.filter(function(ticket){
      return selectedToolBoxColor == ticket.ticketColor
    })

    mainCont.innerHTML = ''

    filteredTickets.forEach(function(filteredTicket){
      createTicket(filteredTicket.id, filteredTicket.ticketColor, filteredTicket.ticketTask)
    })
  })
})

toolBoxColors.forEach(function(ele){
  ele.addEventListener('dblclick' , function(){
    mainCont.innerHTML = ''

    ticketsArr.forEach(function(create){
      createTicket(create.id, create.ticketColor, create.ticketTask)
    })
  })
})


//for localstorage
function updateLocalStorage(){
  localStorage.setItem("ticketsArr", JSON.stringify(ticketsArr))
}