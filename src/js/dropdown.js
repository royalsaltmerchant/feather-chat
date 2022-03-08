function Dropdown(options) {
  this.options = options

  window.getdd = function(elem) {
    var id = elem.closest('.dropdown').parentElement.id
    return window.dropdowns[id]
  }

  this.render = function() {
    this.elem = document.getElementById(this.options.id)

    var val = this.options.val
    var html = /*html */ `
      <div class="dropdown">
        <div class="dropdown_value">${val}</div>
        <div class="dropdown_arrow">▾</div>
        <div class="dropdown_panel">
          <div class="dropdown_items">
          </div>
        </div>
      </div>
    `;
    this.elem.innerHTML = html
    var elem = this.elem

    // make parent elem inline block
    this.elem.style.display = 'inline-block'

    // store a hash of dropdowns
    if(!window.dropdowns) window.dropdowns = {}
    window.dropdowns[this.options.id] = this

    // get elements
    this.items = elem.querySelector('.dropdown_items')
    this.arrow = elem.querySelector('.dropdown_arrow')
    this.value = elem.querySelector('.dropdown_value')
    // populate dropdown
    var data = this.options.data
    html = ""
    data.forEach(function(elem) {
      html += /*html */ `
        <div class="dropdown_item" onmousedown="var self = getdd(this); self.clicked(this)">${elem}</div>
      `
    })
    this.items.innerHTML = html

    var self = this

    // close on click outside
    document.addEventListener('mousedown', function() {
      self.hide()
    })

    // drop the dropdown
    this.elem.addEventListener('mousedown', function() {
      event.stopPropagation()

      if(self.isVisible) {
        self.hide()
      } else {
        self.show()
      }
    })
  }

  this.clicked = function(elem) {
    event.stopPropagation()
    this.hide()

    var newval = elem.innerHTML
    this.value.innerHTML = newval
    this.options.selectRoom(newval)
  }

  this.show = function() {

    // close all dropdowns
    for(var dd in window.dropdowns) {
      window.dropdowns[dd].hide()
    }

    this.isVisible = true
    this.items.style.transform = 'translate(0px, 0px)'
    this.arrow.style.transform = 'rotate(180deg)'
  }

  this.hide = function() {

    if(!this.isVisible) return

    this.isVisible = false
    this.items.style.transform = 'translate(0px, -200px)'
    this.arrow.style.transform = 'rotate(0deg)'
  }

  this.render()
  return this;
}

if(document.getElementById('dd1')) {
  var dd1 = new Dropdown({
    id: 'dd1',
    val: 'default',
    data: ['default', 'new', 'random'],
    selectRoom: function(value) {
      const hiddenInput = document.getElementById('room')
      hiddenInput.value = value
    }
  })
}