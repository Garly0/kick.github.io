window.addEventListener("load", () => {
    for (const widget of document.getElementsByTagName("discord-widget")) {
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
      //body
      const body = document.createElement("widget-body")
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
      fetch(`https://discord.com/api/guilds/1343896960377028650/widget.json`).then((data) => {
        data.json().then((data) => {
          //member count
          count.innerHTML = `<strong>${data.presence_count || 0}</strong> Üye Çevrimiçi`
          //join button
  
          // Check if GARLYbot exists, if not, add it
          const garlyBotExists = data.members.some((member) => member.username === "GARLYbot")
          if (!garlyBotExists) {
            data.members.unshift({
              username: "GARLYbot",
              status: "online",
              avatar_url: "https://cdn.discordapp.com/avatars/1214433179516018738/151a16074f3bbfb2253cbd8755f313fe.webp?size=80", // Default avatar
            })
          }
  
          // Check if Garly exists, if not, add him
          const garlyExists = data.members.some((member) => member.username === "Garly")
          if (!garlyExists) {
            data.members.push({
              username: "Garly",
              status: "online",
              avatar_url: "https://images-ext-1.discordapp.net/external/WI0lLrcydokdICkNi7JmRlcrR2_BngGao4MnSiMDC8Q/https/cdn.discordapp.com/avatars/981572455434948638/980b74c526e45cde1df8f8a63a1273da.webp", // Different default avatar
            })
          }
  
          // Sort members to put GARLYbot at the top, followed by Garly
          data.members.sort((a, b) => {
            if (a.username === "Garly") return -1
            if (b.username === "Garly") return 1
            if (a.username === "GARLYbot") return -1
            if (b.username === "GARLYbot") return 1
            return 0
          })
  
          //users
          data.members.forEach((user) => {
            const member = document.createElement("widget-member")
            const avatar = document.createElement("widget-member-avatar")
            const avatarIMG = document.createElement("img")
            const status = document.createElement(`widget-member-status-${user.status}`)
            const name = document.createElement("widget-member-name")
            const statusText = document.createElement("widget-member-status-text")
  
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
              name.innerText += " - Server owner"
              member.classList.add("server-owner")
            } else if (user.username === "GARLYbot") {
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
          })
        })
      })
    }
  })
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
  
  
