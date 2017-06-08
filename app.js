const app = {
  init(selectors) {
    this.flicks = []
    this.max = 0
    this.list = document.querySelector(selectors.listSelector)
    this.template = document.querySelector(selectors.templateSelector)
    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addFlickViaForm.bind(this))
    this.load()
  },

  // load saved data when browser refreshes
  load(){
    //Get JSON string out of localStorage
    const flicksJSON = localStorage.getItem('flicks')
    //Turn that into an array
    const flicksArray = JSON.parse(flicksJSON)
    //Set this.flicks to that array
    if (flicksArray){
      flicksArray
        .reverse()
        .map(this.addFlick.bind(this))
    }
  },

  addFlick(flick) {
    const listItem = this.renderListItem(flick)
    this.list
      .insertBefore(listItem, this.list.firstChild)
    
    ++ this.max
    this.flicks.unshift(flick)
    this.save()
  },

  addFlickViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const flick = {
      id: this.max + 1,
      name: f.flickName.value,
    }

    const listItem = this.renderListItem(flick)
    var promoteButton = document.createElement('button')
    var deleteButton = document.createElement('button')
    var upButton = document.createElement('button')
    var downButton = document.createElement('button')

    upButton.classList.add('up')
    downButton.classList.add('down')
    deleteButton.classList.add('del')
    promoteButton.classList.add('promo')
    promoteButton.classList.add('notclicked')
    promoteButton.textContent = '❤'
    deleteButton.textContent = '🗑'
    upButton.textContent = '👆'
    downButton.textContent = '👇'

    this.list.appendChild(listItem)
    listItem.appendChild(promoteButton)
    listItem.appendChild(deleteButton)
    listItem.appendChild(upButton)
    listItem.appendChild(downButton)

    upButton.addEventListener("click", upFunction.bind(this))
    downButton.addEventListener("click", downFunction.bind(this))
    deleteButton.addEventListener("click", anotherFunction.bind(this))
    promoteButton.addEventListener("click", myFunction)
    
    function upFunction(e){
      const text = e.target.parentNode.textContent[0]
      var index = 0;
      for (var i=0; i<this.flicks.length; i++){
        if (this.flicks[i].name === text) {
          index = i
          break
        }
      }
      this.save()
      
      if (index === 0){
        const curr = this.flicks[index]
        this.flicks.splice(0,1)
        this.flicks.push(curr)
      }else{
        const next = this.flicks[index-1]
        const curr = this.flicks[index]
        this.flicks[index-1] = curr
        this.flicks[index] = next
      }
      
      this.list.insertBefore(e.target.parentNode, e.target.parentNode.previousSibling)
        
    }

    function downFunction(e){
      const text = e.target.parentNode.textContent[0]
      var index = 0;
      for (var i=0; i<this.flicks.length; i++){
        if (this.flicks[i].name === text) {
          index = i
          break
        }
      }
      this.save()

      if (index !== this.flicks.length-1){
        const next = this.flicks[index+1]
        const curr = this.flicks[index]
        this.flicks[index+1] = curr
        this.flicks[index] = next
      }else{
        return;
      }

      if (e.target.parentNode.nextSibling){
        this.list.insertBefore(e.target.parentNode, e.target.parentNode.nextSibling.nextSibling)
      }
  }
   
    //delete
    function anotherFunction(ev){
      for (let i=0; i < this.flicks.length; i++){ //don't use var
        if (this.flicks[i].name === flick.name) {
          this.flicks.splice(i,1);
          break;
        }
      }
      this.list.removeChild(listItem)
      this.save()
      //Alternative:
      //const lisItem = ev.target.closest('.flick')
      //listItem.remove()
    }

    //promote
    function myFunction(){
        if (promoteButton.classList.contains('notclicked')){
            this.classList.add('clicked')
            listItem.style.backgroundColor = 'yellow'
            listItem.style.textTransform = "uppercase"
            listItem.style.fontSize = '25px'
            this.classList.remove('notclicked')
        }else{
            listItem.style.backgroundColor = '#DDA0DD'
            this.classList.add('notclicked')
            listItem.style.textTransform = "none"
            listItem.style.fontSize = '18px'
            this.classList.remove('clicked')
        }
    }

    //Add flick to this.flicks
    //this.flicks.unshift(flick)
    
    //this.save()
    //unshift method adds element to start of array and returns new length
    //shift method rmeoves first element from array and returns that element
    
    this.addFlick(flick)

    f.reset()
    

  },
 
  //stores info in browsers wuhuuuuu  
  save(){
    localStorage
      .setItem('flicks', JSON.stringify(this.flicks))
  },

  renderListItem(flick) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = flick.id
    item
      .querySelector('.flick-name')
      .textContent = flick.name
    return item
  },
}

app.init({
  formSelector: '#flick-form',
  listSelector: '#flick-list',
  templateSelector: '.flick.template',
})