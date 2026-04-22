import { allTasks, levelTimeLimits, levelNames } from "./levels.js"
import { achievements } from "./achievements.js"

// INIT LEVELS & TASKS
// GET TASKS FROM TASKS.JS
// GET LEVELS FROM LEVELS.JS
// CREATE EACH LEVEL.
const levelsGrid = document.querySelector(".levels-grid")
Object.keys(levelNames).forEach((level) => {
  const tasks = allTasks[level] || []
  const taskCount = tasks.length

  const card = document.createElement("button")
  card.classList.add("level-card")
  card.dataset.level = level

  card.innerHTML = `
    <div class="level-icon">📅</div>
    <div class="level-name">${levelNames[level]}</div>
    <div class="level-description">Erkunde deine ${levelNames[level]}</div>
    <div class="level-tasks">${taskCount} Tasks</div>
  `

  levelsGrid.appendChild(card)
})

let currentLevel = null
let tasks = []
let currentTask = 0
let currentPage = 1
let attempts = []
let locked = []
let completed = []
let savedCodes = []
let taskNotes = []
let lastWrongAttempt = []
const lockTimers = {}
let totalXP = 0
let everLocked = false
const firstTryTasks = new Set()
let taskStartTimes = []
let taskTimerIntervals = {}
let levelTimeRemaining = 0
let levelTimerInterval = null
let startTime = null
const timerInterval = null
let taskViewedFiles = []
const userFeedback = ""

let darkMode = localStorage.getItem("darkMode") === "true"

// DOM Elements
const levelSelection = document.getElementById("levelSelection")
const mainContent = document.getElementById("mainContent")
const title = document.getElementById("taskTitle")
const taskTotal = document.getElementById("taskTotal")
const codeInput = document.getElementById("codeInput")
const textArea = document.getElementById("notizen")
const feedback = document.getElementById("feedback")
const tracker = document.getElementById("taskTracker")
const lockOverlay = document.getElementById("lockOverlay")
const lockTimer = document.getElementById("lockTimer")
const totalXPDisplay = document.getElementById("totalXP")
const achievementCountDisplay = document.getElementById("achievementCount")
const achievementsBtn = document.getElementById("achievementsBtn")
const achievementsModal = document.getElementById("achievementsModal")
const closeModalBtn = document.getElementById("closeModal")
const achievementsGrid = document.getElementById("achievementsGrid")
const viewAchievements = document.getElementById("viewAchievements")
const timerText = document.getElementById("timerText")
const completionScreen = document.getElementById("completionScreen")
const restartBtn = document.getElementById("restartBtn")
const backToLevelsBtn = document.getElementById("backToLevels")
const levelBadge = document.getElementById("levelBadge")

const pdfViewer = document.getElementById("pdfViewer")
const htmlViewer = document.getElementById("htmlViewer")

const themeToggle = document.getElementById("themeToggle")
const themeToggleSidebar = document.getElementById("themeToggleSidebar")

function initTheme() {
  if (darkMode) {
    document.documentElement.setAttribute("data-theme", "dark")
  }
  updateThemeIcon()
}

function toggleTheme() {
  darkMode = !darkMode
  localStorage.setItem("darkMode", darkMode)
  if (darkMode) {
    document.documentElement.setAttribute("data-theme", "dark")
  } else {
    document.documentElement.removeAttribute("data-theme")
  }
  updateThemeIcon()
}

function updateThemeIcon() {
  const icon = darkMode ? "☀️" : "🌙"
  if (themeToggle) themeToggle.querySelector(".theme-icon").textContent = icon
  if (themeToggleSidebar) themeToggleSidebar.querySelector(".theme-icon").textContent = icon
}

themeToggle?.addEventListener("click", toggleTheme)
themeToggleSidebar?.addEventListener("click", toggleTheme)

// Event Listeners
document.querySelectorAll(".level-card").forEach((card) => {
  card.addEventListener("click", () => {
    const level = card.dataset.level
    startLevel(level)
    renderTracker()
  })
})

backToLevelsBtn.addEventListener("click", () => {
  const darkMode = localStorage.getItem("darkMode")
  resetChallenge()
  mainContent.classList.add("hidden")
  levelSelection.classList.remove("hidden")
  localStorage.clear()
  localStorage.setItem("darkMode", darkMode)
  location.reload()
})

restartBtn.addEventListener("click", () => {
  const darkMode = localStorage.getItem("darkMode")
  resetChallenge()
  mainContent.classList.add("hidden")
  levelSelection.classList.remove("hidden")
  localStorage.clear()
  localStorage.setItem("darkMode", darkMode)
  location.reload()
})

function startLevel(level) {
  currentLevel = level
  tasks = allTasks[level]

  levelBadge.textContent = levelNames[level]

  // Reset task arrays
  attempts = Array(tasks.length).fill(0)
  locked = Array(tasks.length).fill(false)
  completed = Array(tasks.length).fill(false)
  savedCodes = Array(tasks.length).fill("")
  taskNotes = Array(tasks.length).fill("")
  lastWrongAttempt = Array(tasks.length).fill(null)
  taskStartTimes = Array(tasks.length).fill(null)
  taskViewedFiles = Array(tasks.length)
    .fill(null)
    .map(() => ({ pdf: false, html: false }))

  currentTask = 0
  currentPage = 1

  // Reset level timer
  const minutes = levelTimeLimits[level] || 10
  levelTimeRemaining = minutes * 60
  updateLevelTimerDisplay()
  startTimer()

  taskTotal.textContent = `of ${tasks.length}`

  levelSelection.classList.add("hidden")
  mainContent.classList.remove("hidden")

  loadTask(0)
  renderTracker()
}

function resetChallenge() {
  currentTask = 0
  currentPage = 1
  everLocked = false
  firstTryTasks.clear()
  startTime = null
  levelTimeRemaining = 0
  timerText.textContent = "0:00"

  Object.values(taskTimerIntervals).forEach((interval) => {
    if (interval) clearInterval(interval)
  })
  taskTimerIntervals = {}

  Object.values(lockTimers).forEach((timer) => clearInterval(timer))
  Object.keys(lockTimers).forEach((key) => delete lockTimers[key])

  completionScreen.classList.add("hidden")
  stopTimer()
}

function startTimer() {
  if (levelTimerInterval) clearInterval(levelTimerInterval)

  levelTimerInterval = setInterval(() => {
    if (levelTimeRemaining <= 0) {
      clearInterval(levelTimerInterval)
      feedback.innerHTML = "⏰ Time's up for this level!"
      feedback.classList.add("error")
      // Optionally lock all tasks
      locked = completed.map((c) => !c)
      renderTracker()
      showCompletionScreen()
      return
    }
    levelTimeRemaining--
    updateLevelTimerDisplay()
  }, 1000)
}

function updateLevelTimerDisplay() {
  const minutes = Math.floor(levelTimeRemaining / 60)
  const seconds = levelTimeRemaining % 60
  timerText.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function stopLevelTimer() {
  if (levelTimerInterval) {
    clearInterval(levelTimerInterval)
    levelTimerInterval = null
  }
}

function startTaskTimer(taskIndex) {
  // Stop all other running timers
  for (const key in taskTimerIntervals) {
    stopTaskTimer(key)
  }

  // Initialize if needed
  if (typeof taskStartTimes[taskIndex] !== "number" || isNaN(taskStartTimes[taskIndex])) {
    taskStartTimes[taskIndex] = 0
  }

  const sessionStart = Date.now()
  const display = document.getElementById("taskTimerText")

  // Immediately show the current saved time
  updateDisplay(taskIndex, display, taskStartTimes[taskIndex])

  // Save both interval and sessionStart together in an object
  const interval = setInterval(() => {
    const elapsed = taskStartTimes[taskIndex] + Math.floor((Date.now() - sessionStart) / 1000)
    updateDisplay(taskIndex, display, elapsed)
  }, 1000)

  taskTimerIntervals[taskIndex] = { interval, sessionStart }
}

function stopTaskTimer(taskIndex) {
  const timerData = taskTimerIntervals[taskIndex]
  if (!timerData) return

  const { interval, sessionStart } = timerData
  clearInterval(interval)

  if (sessionStart) {
    const sessionElapsed = Math.floor((Date.now() - sessionStart) / 1000)
    if (typeof taskStartTimes[taskIndex] !== "number" || isNaN(taskStartTimes[taskIndex])) {
      taskStartTimes[taskIndex] = 0
    }
    taskStartTimes[taskIndex] += sessionElapsed
  }

  delete taskTimerIntervals[taskIndex]
}

function updateDisplay(taskIndex, element, totalSeconds) {
  if (!element || isNaN(totalSeconds)) return
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  element.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function stopTimer() {
  if (levelTimerInterval) {
    clearInterval(levelTimerInterval)
    levelTimerInterval = null
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, "0")}`
}

function loadProgress() {
  const saved = localStorage.getItem("networkingChallengeProgress")
  if (saved) {
    const data = JSON.parse(saved)
    totalXP = data.totalXP || 0
    everLocked = data.everLocked || false
    data.achievements?.forEach((savedAch, i) => {
      if (achievements[i]) {
        achievements[i].unlocked = savedAch.unlocked
      }
    })
    updateXPDisplay()
  }
}

function saveProgress() {
  const data = {
    totalXP,
    everLocked,
    achievements: achievements.map((a) => ({ id: a.id, unlocked: a.unlocked })),
  }
  localStorage.setItem("networkingChallengeProgress", JSON.stringify(data))
}

function updateXPDisplay() {
  totalXPDisplay.textContent = `${totalXP} XP`
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  achievementCountDisplay.textContent = `${unlockedCount}/${achievements.length}`
}

function showAchievementNotification(achievement) {
  const notification = document.createElement("div")
  notification.className = "achievement-notification"
  notification.innerHTML = `
    <div class="notification-icon">${achievement.icon}</div>
    <div class="notification-content">
      <div class="notification-title">Achievement Unlocked!</div>
      <div class="notification-name">${achievement.name}</div>
    </div>
    <div class="notification-xp">+${achievement.xp} XP</div>
  `
  document.body.appendChild(notification)

  // Force a reflow to trigger animation
  notification.offsetHeight

  setTimeout(() => {
    notification.style.animation = "notificationSlideOut 0.4s ease forwards"
    setTimeout(() => notification.remove(), 400)
  }, 3000)
}

function unlockAchievement(achievementId) {
  const achievement = achievements.find((a) => a.id === achievementId)
  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true
    totalXP += achievement.xp
    updateXPDisplay()
    showAchievementNotification(achievement)
    saveProgress()
  }
}

function checkFailureMaster() {
  if (locked.every((l) => l)) {
    unlockAchievement("failure-master")
  }
}

function checkAchievements() {
  if (completed.every((c) => c)) {
    unlockAchievement("task-master")
    if (!everLocked) {
      unlockAchievement("perfect-run")
    }
    if (levelTimeRemaining > 300) {
      unlockAchievement("speedrunner")
    }
    showCompletionScreen()
  }
}

let finalSessionData = null

function showCompletionScreen() {
  viewAchievements.addEventListener("click", () => {
    renderAchievements()
    achievementsModal.classList.remove("hidden")
  })

  stopTimer()
  stopTaskTimer(currentTask)
  Object.values(taskTimerIntervals).forEach((interval) => interval && clearInterval(interval))

  const masterCode = "FIXED-CODE-2025"
  completionScreen.classList.remove("hidden")

  document.getElementById("finalTime").textContent = formatTime(levelTimeRemaining)
  document.getElementById("finalXP").textContent = `${totalXP} XP`
  document.getElementById("finalAchievements").textContent =
    `${achievements.filter((a) => a.unlocked).length}/${achievements.length}`
  document.getElementById("masterCode").textContent = masterCode

  // Populate per-task times
  const taskTimesList = document.getElementById("taskTimesList")
  taskTimesList.innerHTML = ""
  tasks.forEach((task, index) => {
    const li = document.createElement("li")
    li.textContent = `Task ${index + 1} - ${task.name}: ${formatTime(taskStartTimes[index] || 0)}`
    taskTimesList.appendChild(li)
  })

  finalSessionData = {
    level: currentLevel,
    levelName: levelNames[currentLevel],
    completionTime: new Date().toISOString(),
    timeRemaining: levelTimeRemaining,
    totalXP,
    tasks: tasks.map((task, index) => ({
      id: index + 1,
      name: task.name,
      duration: taskStartTimes[index] || 0,
      durationFormatted: formatTime(taskStartTimes[index] || 0),
      notes: taskNotes[index] || "",
      viewedFiles: taskViewedFiles[index],
      completed: completed[index],
      savedCode: savedCodes[index] || "",
      attempts: attempts[index],
    })),
    achievements: achievements
      .filter((a) => a.unlocked)
      .map((a) => ({
        name: a.name,
        description: a.description,
        xp: a.xp,
      })),
    feedback: "",
  }

    setTimeout(() => {
    const feedbackTextarea = document.getElementById("userFeedback")

    if (feedbackTextarea) {
      feedbackTextarea.addEventListener("input", () => {
        finalSessionData.feedback = feedbackTextarea.value
      })
    }
  }, 500)

  console.log("Final Session Data:", sessionData)
}

restartBtn.addEventListener("click", () => {
  // Download session data with feedback BEFORE resetting
  if (finalSessionData) {
    autoDownloadSessionData(finalSessionData)
  }

  const darkMode = localStorage.getItem("darkMode")
  resetChallenge()
  mainContent.classList.add("hidden")
  levelSelection.classList.remove("hidden")
  localStorage.clear()
  localStorage.setItem("darkMode", darkMode)
  location.reload()
})

function autoDownloadSessionData(sessionData, masterCode) {
  const feedbackTextarea = document.getElementById("userFeedback")
  sessionData.feedback = feedbackTextarea?.value || ""

  const dataText = `
========================================
SESSION DATA EXPORT
========================================

Level: ${sessionData.levelName}
Completion Time: ${sessionData.completionTime}
Time Remaining: ${formatTime(sessionData.timeRemaining)}
Total XP: ${sessionData.totalXP}
Master Code: ${masterCode}

========================================
TASKS
========================================

${sessionData.tasks
  .map(
    (task) => `
Task ${task.id}: ${task.name}
  Duration: ${task.durationFormatted}
  Completed: ${task.completed ? "Yes" : "No"}
  Saved Code: ${task.savedCode}
  Attempts: ${task.attempts}
  Viewed PDF: ${task.viewedFiles?.pdf ? "Yes" : "No"}
  Viewed HTML: ${task.viewedFiles?.html ? "Yes" : "No"}
  Notes: ${task.notes || "(none)"}
`,
  )
  .join("\n")}

========================================
ACHIEVEMENTS UNLOCKED
========================================

${sessionData.achievements
  .map(
    (ach) => `
${ach.name} (+${ach.xp} XP)
  ${ach.description}
`,
  )
  .join("\n")}

========================================
USER FEEDBACK
========================================

${sessionData.feedback || "(no feedback provided)"}

========================================
`.trim()

  const blob = new Blob([dataText], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `session-data-${sessionData.level}-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function startCountdown(taskIndex, seconds) {
  let remaining = seconds

  const updateOverlay = () => {
    if (currentTask === taskIndex && locked[taskIndex]) {
      lockTimer.textContent = `Wait ${remaining} second${remaining !== 1 ? "s" : ""}`
    }
  }

  updateOverlay()

  lockTimers[taskIndex] = setInterval(() => {
    remaining--
    updateOverlay()

    if (remaining <= 0) {
      clearInterval(lockTimers[taskIndex])
      locked[taskIndex] = false
      feedback.innerHTML = '<span style="color: #3b82f6;">🔓 Task unlocked! Try again.</span>'
      unlockAchievement("never-give-up")
      loadNextAvailableTask()
    }
  }, 1000)
}

function loadNextAvailableTask() {
  const nextUncompleted = completed.findIndex((c, i) => !c && !locked[i])
  if (nextUncompleted !== -1) {
    currentTask = nextUncompleted
    loadTask(currentTask)
    return
  }

  const nextLocked = locked.findIndex((l) => l)
  if (nextLocked !== -1) {
    currentTask = nextLocked
    loadTask(currentTask)
    return
  }

  checkAchievements()
}

function loadTask(index) {
  startTimer()
  if (currentTask !== undefined && currentTask !== index) {
    stopTaskTimer(currentTask)
    if (textArea.value.trim()) {
      taskNotes[currentTask] = textArea.value
    }
  }

  currentTask = index
  startTaskTimer(index)

  title.textContent = `Task ${index + 1}`
  feedback.textContent = ""
  feedback.classList.remove("success", "error", "warning")
  codeInput.value = completed[index] ? savedCodes[index] : ""
  codeInput.disabled = completed[index] || locked[index]

  textArea.value = taskNotes[index] || ""
  textArea.disabled = completed[index]

  const lockTaskNumber = document.getElementById("lockTaskNumber")
  if (lockTaskNumber) {
    lockTaskNumber.textContent = `Task ${index + 1}`
  }

  loadPDF(index)

  if (locked[index]) {
    lockOverlay.classList.remove("hidden")
  } else {
    lockOverlay.classList.add("hidden")
  }

  updateProgressDisplay()
  renderTracker()
}

function loadPDF(taskIndex) {
  const task = tasks[taskIndex]
  currentPage = 1

  if (task.pdfUrl) {
    pdfViewer.src = `${task.pdfUrl}#page=${currentPage}`
    pdfViewer.classList.remove("hidden")
    taskViewedFiles[taskIndex].pdf = true
  } else {
    pdfViewer.src = ""
    pdfViewer.classList.add("hidden")
  }

  if (task.htmlUrl) {
    htmlViewer.src = task.htmlUrl
    htmlViewer.classList.remove("hidden")
    taskViewedFiles[taskIndex].html = true
  } else {
    htmlViewer.src = ""
    htmlViewer.classList.add("hidden")
  }

  if (task.pdfUrl && task.htmlUrl) {
    pdfViewer.style.width = "50%"
    htmlViewer.style.width = "50%"
  } else {
    pdfViewer.style.width = "100%"
    htmlViewer.style.width = "100%"
  }
}

function renderTracker() {
  tracker.innerHTML = ""
  tasks.forEach((task, i) => {
    const box = document.createElement("div")
    box.classList.add("task-box")

    const boxNumber = document.createElement("div")
    boxNumber.classList.add("task-box-number")
    if (i === currentTask) boxNumber.classList.add("active")
    if (completed[i]) boxNumber.classList.add("completed")
    else if (locked[i]) boxNumber.classList.add("locked")
    boxNumber.textContent = i + 1
    boxNumber.addEventListener("click", () => {
      currentTask = i
      loadTask(i)
    })
    box.appendChild(boxNumber)

    if (task.hilfsmittel) {
      const hilfsmittelBadge = document.createElement("div")
      hilfsmittelBadge.classList.add("task-hilfsmittel")
      hilfsmittelBadge.textContent = "📚"
      box.appendChild(hilfsmittelBadge)
    }

    tracker.appendChild(box)
  })
}

function renderAchievements() {
  achievementsGrid.innerHTML = achievements
    .map(
      (achievement) => `
    <div class="achievement-card ${achievement.unlocked ? "unlocked" : ""}">
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-info">
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-description">${achievement.description}</div>
      </div>
      <div class="achievement-xp">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 1L10.163 5.38L15 6.12L11.5 9.54L12.326 14.36L8 12.1L3.674 14.36L4.5 9.54L1 6.12L5.837 5.38L8 1Z" fill="currentColor"/>
        </svg>
        ${achievement.xp} XP
      </div>
    </div>
  `,
    )
    .join("")
}

achievementsBtn.addEventListener("click", () => {
  renderAchievements()
  achievementsModal.classList.remove("hidden")
})

closeModalBtn.addEventListener("click", () => {
  achievementsModal.classList.add("hidden")
})

achievementsModal.querySelector(".modal-backdrop")?.addEventListener("click", () => {
  achievementsModal.classList.add("hidden")
})

function updateProgressDisplay() {
  const progress = completed.length > 0 ? Math.round((completed.filter((c) => c).length / completed.length) * 100) : 0
  const progressText = document.getElementById("progressText")
  if (progressText) {
    progressText.textContent = progress + "%"
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copyMasterCode")
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const masterCodeEl = document.getElementById("masterCode")
      const code = masterCodeEl.textContent
      navigator.clipboard.writeText(code).then(() => {
        const originalText = copyBtn.textContent
        copyBtn.textContent = "✓ Copied!"
        setTimeout(() => {
          copyBtn.textContent = originalText
        }, 2000)
      })
    })
  }

  if (textArea) {
    textArea.addEventListener("input", () => {
      if (currentTask !== undefined && currentTask !== null) {
        taskNotes[currentTask] = textArea.value
      }
    })
  }

  initTheme()
})

renderTracker()
loadProgress()

document.getElementById("prevTask").addEventListener("click", () => {
  if (currentTask > 0) {
    currentTask--
    loadTask(currentTask)
  }
})

document.getElementById("nextTask").addEventListener("click", () => {
  if (currentTask < tasks.length - 1) {
    currentTask++
    loadTask(currentTask)
  }
})

document.getElementById("submitCode").addEventListener("click", () => {
  if (locked[currentTask] || completed[currentTask]) return

  const inputCode = codeInput.value.trim()
  if (!inputCode) {
    feedback.innerHTML = "⚠️ Enter a code!"
    feedback.classList.remove("success", "error")
    feedback.classList.add("warning")
    return
  }

  const normalizeCode = (code) => {
    return String(code)
      .replace(/[\s/-]/g, "")
      .replace(/,/g, ".")
      .toLowerCase()
  }

  const expectedCode = normalizeCode(tasks[currentTask].code)
  const userCode = normalizeCode(inputCode)

  if (userCode === expectedCode) {
    feedback.innerHTML = "✅ Correct! Task completed."
    feedback.classList.remove("error", "warning")
    feedback.classList.add("success")
    completed[currentTask] = true
    savedCodes[currentTask] = codeInput.value
    taskNotes[currentTask] = textArea.value
    codeInput.disabled = true
    textArea.disabled = true

    if (attempts[currentTask] === 0) {
      firstTryTasks.add(currentTask)
      unlockAchievement("first-try")
    }

    updateProgressDisplay()

    setTimeout(() => {
      if (completed.every((c) => c)) {
        checkAchievements()
      } else {
        loadNextAvailableTask()
      }
    }, 1000)
  } else {
    if (lastWrongAttempt[currentTask] === userCode) {
      unlockAchievement("double-failure")
    }
    lastWrongAttempt[currentTask] = userCode

    attempts[currentTask]++
    if (attempts[currentTask] >= 3) {
      locked[currentTask] = true
      attempts[currentTask] = 0
      everLocked = true
      saveProgress()
      feedback.innerHTML = "❌ Too many attempts. Task locked."
      feedback.classList.remove("success", "warning")
      feedback.classList.add("error")
      loadTask(currentTask)
      startCountdown(currentTask, 30)
      checkFailureMaster()
    } else {
      feedback.innerHTML = `❌ Wrong code (${attempts[currentTask]}/3 attempts)`
      feedback.classList.remove("success", "warning")
      feedback.classList.add("error")
    }
  }

  renderTracker()
})
