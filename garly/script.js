document.addEventListener("DOMContentLoaded", () => {
    
    // Animate buttons with delay
    const buttons = document.querySelectorAll(".link-button")
    buttons.forEach((button, index) => {
      setTimeout(
        () => {
          button.style.opacity = "1"
          button.style.transform = "translateY(0)"
        },
        500 + index * 100,
      )
  
      button.addEventListener("mouseover", createParticleExplosion)
      button.addEventListener("click", createRippleEffect)
    })
  
    // Profile image random movement
    const profileImage = document.querySelector(".profile-image-container")
    setInterval(() => {
      const randomX = (Math.random() - 0.5) * 10
      const randomY = (Math.random() - 0.5) * 10
      const randomRotate = (Math.random() - 0.5) * 5
  
      profileImage.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`
  
      setTimeout(() => {
        profileImage.style.transform = "translate(0, 0) rotate(0)"
      }, 500)
    }, 3000)
  
    // Create particles
    createParticles()
  
    // Add parallax effect to background
    function handleMouseMove(e) {
      const mouseX = e.clientX / window.innerWidth
      const mouseY = e.clientY / window.innerHeight
  
      const container = document.querySelector(".container")
      const orbs = document.querySelectorAll(".gradient-orb")
  
      if (container) {
        container.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`
      }
  
      orbs.forEach((orb, index) => {
        const depth = (index + 1) * 0.2
        orb.style.transform = `translate(${mouseX * 50 * depth}px, ${mouseY * 50 * depth}px)`
      })
    }
  
    document.addEventListener("mousemove", handleMouseMove)
  
    // Fix for mobile devices (disable parallax)
    if (window.innerWidth <= 768) {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  })
  
  function createRippleEffect(event) {
    const button = event.currentTarget
    const ripple = document.createElement("span")
    ripple.classList.add("ripple")
    button.appendChild(ripple)
  
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
  
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
  
    ripple.addEventListener("animationend", () => {
      ripple.remove()
    })
  }
  
  function createParticleExplosion(event) {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
  
    for (let i = 0; i < 20; i++) {
      createParticle(x, y)
    }
  }
  
  function createParticle(x, y) {
    const particle = document.createElement("div")
    particle.classList.add("particle")
    document.body.appendChild(particle)
  
    const size = Math.random() * 5 + 2
    const destinationX = x + (Math.random() - 0.5) * 2 * 75
    const destinationY = y + (Math.random() - 0.5) * 2 * 75
    const rotation = Math.random() * 520
    const delay = Math.random() * 200
  
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`
  
    const animation = particle.animate(
      [
        {
          transform: `translate(${x - size / 2}px, ${y - size / 2}px) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1000 + delay,
        easing: "cubic-bezier(0, .9, .57, 1)",
        delay: delay,
      },
    )
  
    animation.onfinish = () => {
      particle.remove()
    }
  }
  
  function createParticles() {
    const particlesContainer = document.querySelector(".particles")
    if (!particlesContainer) return
  
    const particleCount = 30
  
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.classList.add("particle")
      particlesContainer.appendChild(particle)
  
      animateParticle(particle)
    }
  }
  
  function animateParticle(particle) {
    const duration = Math.random() * 2 + 3
    const size = Math.random() * 5 + 2
    const startPositionX = Math.random() * window.innerWidth
    const startPositionY = Math.random() * window.innerHeight
    const endPositionX = Math.random() * window.innerWidth
    const endPositionY = Math.random() * window.innerHeight
  
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${startPositionX}px`
    particle.style.top = `${startPositionY}px`
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`
    particle.style.opacity = "0.6"
    particle.style.position = "absolute"
    particle.style.borderRadius = "50%"
    particle.style.pointerEvents = "none"
  
    let startTime = null
    const animationDuration = duration * 1000
  
    function animate(currentTime) {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
  
      const x = startPositionX + (endPositionX - startPositionX) * progress
      const y = startPositionY + (endPositionY - startPositionY) * progress
      const opacity = 0.6 - progress * 0.6
  
      particle.style.transform = `translate(${x - startPositionX}px, ${y - startPositionY}px)`
      particle.style.opacity = opacity.toString()
  
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        particle.remove()
        const newParticle = document.createElement("div")
        newParticle.classList.add("particle")
        const particlesContainer = document.querySelector(".particles")
        if (particlesContainer) {
          particlesContainer.appendChild(newParticle)
          animateParticle(newParticle)
        }
      }
    }
  
    requestAnimationFrame(animate)
  }
  
  