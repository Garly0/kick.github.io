window.addEventListener("load", () => {
  for (const widget of document.getElementsByTagName("discord-widget")) {
    // Add loading animation
    setTimeout(() => {
      widget.classList.add("loaded")
    }, 1000)
    //getting attributes
    const id = widget.getAttribute("id") ?? null
    const width = widget.getAttribute("width") ?? "350px"
    const height = widget.getAttribute("height") ?? "500px"
    const footerText = widget.getAttribute("footerText") ?? ""
    const color = widget.getAttribute("color") ?? "#5865f2"
    const backgroundColor = widget.getAttribute("backgroundColor") ?? "#0c0c0d"
    const textColor = widget.getAttribute("textColor") ?? "#fff"
    const statusColor = widget.getAttribute("statusColor") ?? "#858585"
    //header
    const head = document.createElement("widget-header")
    const logo = document.createElement("widget-logo")
    const count = document.createElement("widget-header-count")
    head.append(logo, count)

    // Add animation class to header
    head.classList.add("animated-header")

    //body
    const body = document.createElement("widget-body")

    // Add members title with animation
    const membersTitle = document.createElement("div")
    membersTitle.className = "members-title"
    membersTitle.textContent = "Sunucu Üyeleri"
    body.appendChild(membersTitle)

    if (!id) body.innerHTML = "No Discord server ID was specified."
    //footer
    const footer = document.createElement("widget-footer")
    const footerInfo = document.createElement("widget-footer-info")

    footer.style.backgroundColor = "#1e1f22" // Dark background color

    footerInfo.innerText = footerText
    footer.append(footerInfo)

    widget.style.setProperty("--color", color)
    widget.style.setProperty("--bgColor", backgroundColor)
    widget.style.setProperty("--textColor", textColor)
    widget.style.setProperty("--buttonColor", `#${LDColor(color.replace("#", ""), -10)}`)
    widget.style.setProperty("--statusColor", statusColor)

    //appending head, body and footer to the widget
    widget.append(head, body, footer)
    //data
    fetch(`https://discord.com/api/guilds/1343896960377028650/widget.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        // Log the data to help with debugging
        console.log("Discord data received:", data)

        // Check if members array exists and has items
        if (!data.members || data.members.length === 0) {
          console.log("No members found in the data")
          // Add mock data for testing
          data.members = [
            {
              username: "Garly",
              status: "online",
              avatar_url:
                "https://images-ext-1.discordapp.net/external/WI0lLrcydokdICkNi7JmRlcrR2_BngGao4MnSiMDC8Q/https/cdn.discordapp.com/avatars/981572455434948638/980b74c526e45cde1df8f8a63a1273da.webp",
            },
            {
              username: "GarlyBot",
              status: "online",
              avatar_url:
                "https://cdn.discordapp.com/avatars/1214433179516018738/151a16074f3bbfb2253cbd8755f313fe.webp?size=80",
            },
            {
              username: "User1",
              status: "online",
              avatar_url: "/placeholder.svg?height=80&width=80",
            },
            {
              username: "User2",
              status: "idle",
              avatar_url: "/placeholder.svg?height=80&width=80",
            },
            {
              username: "User3",
              status: "dnd",
              avatar_url: "/placeholder.svg?height=80&width=80",
            },
          ]
          // Remove the no members message if we added it
          body.querySelector("div:last-child").remove()
        } else {
          //member count
          count.innerHTML = `<strong>${data.presence_count || 0}</strong> Üye Çevrimiçi`

          // Add count animation
          count.classList.add("animated-count")

          // Check if GARLYbot exists, if not, add it
          const garlyBotExists = data.members.some((member) => member.username === "GarlyBot (Alpha Test)")
          if (!garlyBotExists) {
            data.members.unshift({
              username: "GarlyBot (Alpha Test)",
              status: "online",
              avatar_url:
                "https://cdn.discordapp.com/avatars/1214433179516018738/151a16074f3bbfb2253cbd8755f313fe.webp?size=80", // Default avatar
            })
          }

          // Check if Garly exists, if not, add him
          const garlyExists = data.members.some((member) => member.username === "Garly")
          if (!garlyExists) {
            data.members.push({
              username: "Garly",
              status: "online",
              avatar_url:
                "https://images-ext-1.discordapp.net/external/WI0lLrcydokdICkNi7JmRlcrR2_BngGao4MnSiMDC8Q/https/cdn.discordapp.com/avatars/981572455434948638/980b74c526e45cde1df8f8a63a1273da.webp", // Different default avatar
            })
          }

          // Sort members to put GARLYbot at the top, followed by Garly
          data.members.sort((a, b) => {
            if (a.username === "Garly") return -1
            if (b.username === "Garly") return 1
            if (a.username === "GarlyBot (Alpha Test)") return -1
            if (b.username === "GarlyBot (Alpha Test)") return 1
            return 0
          })

          // Add staggered animation delay for members
          let delay = 0.1

          //users
          data.members.forEach((user) => {
            const member = document.createElement("widget-member")
            const avatar = document.createElement("widget-member-avatar")
            const avatarIMG = document.createElement("img")
            const status = document.createElement(`widget-member-status-${user.status}`)
            const name = document.createElement("widget-member-name")
            const statusText = document.createElement("widget-member-status-text")

            // Add staggered animation delay
            member.style.animationDelay = `${delay}s`
            delay += 0.1

            avatarIMG.src = user.avatar_url
            status.classList.add("widget-member-status")
            name.innerText = user.username

            // Create a container for the text elements
            const textContainer = document.createElement("div")
            textContainer.style.display = "flex"
            textContainer.style.flexDirection = "column"
            textContainer.style.flex = "1"
            textContainer.style.overflow = "hidden"

            if (user.username === "Garly") {
              name.innerText += " - Sunucu Sahibi"
              member.classList.add("server-owner")
            } else if (user.username === "GarlyBot (Alpha Test)") {
              member.classList.add("garlybot")
              status.style.backgroundColor = "#57f287" // Online status color
            }

            if (user.game) {
              statusText.innerText = user.game.name
            }

            textContainer.appendChild(name)
            textContainer.appendChild(statusText)

            avatar.append(avatarIMG, status)
            member.append(avatar, textContainer)
            body.append(member)

            // Add hover animations with JavaScript
            member.addEventListener("mouseenter", () => {
              avatarIMG.style.transform = "rotate(360deg)"
              name.style.textShadow = "0 0 5px rgba(255, 255, 255, 0.5)"
            })

            member.addEventListener("mouseleave", () => {
              avatarIMG.style.transform = "rotate(0deg)"
              name.style.textShadow = "none"
            })
          })

          // Add floating particles
          addFloatingParticles(widget)
        }
      })
      .catch((error) => {
        console.error("Error fetching Discord data:", error)
        // Add error message to the widget
        const errorMessage = document.createElement("div")
        errorMessage.style.textAlign = "center"
        errorMessage.style.padding = "20px"
        errorMessage.style.color = "#fff"
        errorMessage.innerHTML = "Unable to load Discord members. Please check your connection and try again."
        body.appendChild(errorMessage)
      })
  }
})

// Function to add floating particles
function addFloatingParticles(widget) {
  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles-container"
  particlesContainer.style.position = "absolute"
  particlesContainer.style.top = "0"
  particlesContainer.style.left = "0"
  particlesContainer.style.width = "100%"
  particlesContainer.style.height = "100%"
  particlesContainer.style.overflow = "hidden"
  particlesContainer.style.pointerEvents = "none"
  particlesContainer.style.zIndex = "1"

  // Create particles
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.position = "absolute"
    particle.style.width = `${Math.random() * 5 + 2}px`
    particle.style.height = particle.style.width
    particle.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
    particle.style.borderRadius = "50%"
    particle.style.top = `${Math.random() * 100}%`
    particle.style.left = `${Math.random() * 100}%`
    particle.style.animation = `floatingParticle ${Math.random() * 10 + 10}s linear infinite`

    // Create keyframes for this specific particle
    const keyframes = `
            @keyframes floatingParticle {
                0% {
                    transform: translate(0, 0);
                    opacity: ${Math.random() * 0.5 + 0.1};
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    opacity: ${Math.random() * 0.5 + 0.1};
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                }
                100% {
                    transform: translate(0, 0);
                    opacity: ${Math.random() * 0.5 + 0.1};
                }
            }
        `

    // Add keyframes to document
    const style = document.createElement("style")
    style.innerHTML = keyframes
    document.head.appendChild(style)

    particlesContainer.appendChild(particle)
  }

  widget.appendChild(particlesContainer)
}

function LDColor(color, percent) {
  const num = Number.parseInt(color, 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const B = ((num >> 8) & 0x00ff) + amt
  const G = (num & 0x0000ff) + amt
  return (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
    (G < 255 ? (G < 1 ? 0 : G) : 255)
  )
    .toString(16)
    .slice(1)
}
