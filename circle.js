
	function Circle(op){
		this.container        = op.container
		this.radius           = op.radius
		this.sections         = op.sections
		this.dots             = op.dots
		this.delay            = op.delay
		this.backgroundColors = op.backgroundColors

		this.state = 0
		this.sectionsArray = []

		this.initialization = function()
		{
			var dot, section, isBig, number, totalDots = this.dots * this.sections
			this.setContainerRadiusTo(this.radius)

			for(var i = 0 ; i < this.sections ; i++)
			{
				section = new Section(i, this)
				for(var j = 0 ; j <= this.dots -1 ; j++)
				{
					isBig = j == this.dots - 1 ? true : false
					number = i * this.dots + j
					dot = new Dot(number, isBig, this)

					dot.computeCoordForDotNumber(number, totalDots)

					section.dotsArray.push(dot)
				}
				this.sectionsArray.push(section)
			}
			this.displayCircle()
		}
		this.displayCircle = function()
		{
			for(var i = 0 ; i < this.sections ; i++)
			{
				for(var j = 0 ; j < this.dots ; j++)
				{
					var dot   = this.sectionsArray[i].dotsArray[j]
					var isBig = dot.isBig ? ' big' : ''
					var step  = dot.isBig ? ' data-step="' + (i + 1) + '"' : ''
					var offset = dot.isBig ? 8 : 4

					container.append('<div id="dot_' + dot.nb + '" class="dot' + isBig + '"' + step + '></div>')
					dot.elem = $('#dot_' + dot.nb).css("top",-dot.y+offset + 'px').css('left', dot.x-offset + 'px')
					if(isBig)
					{
						const that = this;
						dot.elem.on('click', function(){
							var target = $(this).attr('data-step')
							target = parseInt(target)
							that.changeStateTo(target)
							that.updateUI()
						})
					}
				}
			}
			var totalDots = this.dots * this.sections - 1
			$('#dot_'+ totalDots).addClass('active').css('opacity','1')
			$('#dot_'+ totalDots).attr('data-step','0')
			this.updateUI()
			console.log(this)
		}
		this.updateUI = function()
		{
			$('#state').html(this.state)
			$('body').css('background-color',this.backgroundColors[this.state])
		}
		this.changeStateTo = function(target)
		{
			var diff = target - this.state
			var tmp_state = this.state

			this.handleDots(diff, tmp_state)
			this.handleBigDots(diff, tmp_state, target)

			this.state = parseInt(target)
		}
		this.handleDots = function(diff, tmp_state)
		{
			if(diff > 0 )
			{
				for(var i = 0 ; i < diff ; i++)
				{
					this.activateSection(tmp_state + i, this.delay * i)
				}
			}
			else if(diff < 0)
			{
				for(var i = diff ; i < 0 ; i++)
				{
					this.deactivateSection(tmp_state + (diff - i) - 1, this.delay * (i - diff))
				}						
			}
		}
		this.handleBigDots = function(diff, tmp_state, target)
		{
			var that = this
			setTimeout(function(){
				if(tmp_state == 0) {
					$(".dot").last().removeClass('active')
				}
				else{
					that.sectionsArray[tmp_state - 1].deactivateBigDot()
				}
				if(target - 1 >= 0)
					that.sectionsArray[target - 1].activateBigDot()
				else
					$(".dot").last().addClass('active')	
			}, that.delay * -diff * that.dots)
		}
		this.activateSection = function(section, delayOffset)
		{
			var that = this
			setTimeout(function(){
				that.sectionsArray[section].lightUp()
			}, that.dots * delayOffset)
		}
		this.deactivateSection = function(section, delayOffset)
		{
			var that = this
			setTimeout(function(){
				that.sectionsArray[section].lightDown()
			}, that.dots * delayOffset)
		}
		this.setContainerRadiusTo = function(radius)
		{

			this.container.css("width" , this.radius * 2 + "px").css('height', this.radius * 2 + "px")
		}

		this.initialization()
	}

	function Section(nb, thisCircle){
		this.nb = nb
		this.dotsArray = []
		this.isOn = false
		this.circle = thisCircle

		this.lightUp = function(){
			$.each(this.dotsArray, function(i, val){
				setTimeout(function(){
					val.animateIn()
				}, this.circle.delay * i)
			})
		}
		this.lightDown = function(){
			var reverseArray = this.dotsArray.slice()
			reverseArray.reverse()
			$.each(reverseArray, function(i, val){
				setTimeout(function(){
					val.animateOut()
				}, this.circle.delay * i)
			})
		}
		this.activateBigDot = function(){
			this.dotsArray[this.dotsArray.length - 1].elem.addClass('active')
		}
		this.deactivateBigDot = function(){
			this.dotsArray[this.dotsArray.length - 1].elem.removeClass('active')
		}
	}

	function Dot(nb, isBig, thisCircle){
		this.isBig = isBig
		this.nb = nb
		this.x = 0
		this.y = 0
		this.circle = thisCircle

		this.animateIn = function(){
			var that = this
			that.elem.toggleClass('animate').addClass('white')
			setTimeout(function(){
				that.elem.toggleClass('animate').css('opacity','1')
			}, this.circle.delay * 1.2)
		}
		this.animateOut = function(){
			var that = this
			that.elem.toggleClass('animate')
			setTimeout(function(){
				that.elem.toggleClass('animate').removeClass('white').css('opacity','.3')
			}, this.circle.delay * 1.2)
		}
		this.computeCoordForDotNumber = function(i, totalDots){
			var x, y,
			angle = 2 * Math.PI * (i+1) / totalDots

			x = Math.cos(angle - Math.PI / 2) * this.circle.radius
			y = Math.sin(angle + Math.PI / 2) * this.circle.radius

			x += this.circle.radius
			y -= this.circle.radius

					// console.log(x, y, circle.radius)

					this.x = x
					this.y = y
		}
	}