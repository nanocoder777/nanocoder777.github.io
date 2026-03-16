// FATE V4 Changelog System
// Add this to your main HTML or as a separate file

const FATE_CHANGELOG = {
  version: "4.0.0",
  date: "2026-03-17",
  
  // Startup notification (brief)
  startup: {
    iconClass: "ri-fire-line",
    title: "Welcome to FATE V4",
    content: `
    🔥 <b>Brand New Build</b>
    Complete redesign with modern UI
    
    🎮 <b>Games</b>
    4000+ games across 10 sources
    
    🎵 <b>Music</b>
    New player with favorites & queue
    
    🎨 <b>Themes</b>
    Light mode + custom themes
    `,
    buttonText: "Get Started",
    showChangelogLink: true
  },

  // Full changelog (detailed)
  full: {
    iconClass: "ri-history-line",
    title: "Changelog for v4.0",
    content: `
    🔥 Core
    - Complete UI redesign from scratch
    - New floating navigation system
    - Improved performance & loading times
    - WebSocket integration for live user count
    
    🎮 Games Section
    - Added gn-math.dev integration
    - Added breadbb games collection
    - Added truffled.lol library
    - Added bog.lat arcade
    - Added Ultimate Game Stash
    - Added bubblefan games
    - Added Selenite collection
    - Added skysthelimit.dev
    - Added gn-ports emulator
    - Added Now.gg support
    - Added frogiesarcade.win
    
    🌐 Browse Features
    - Scramjet Browse integration
    - hvtrs/x8r proxy support
    - Custom browser viewport
    
    🎵 Music Player
    - Complete player redesign
    - Favorites system with localStorage
    - Queue management system
    - Shuffle & repeat functionality
    - TIDAL integration (fixed)
    - SoundCloud support
    - Equalizer improvements
    
    🎬 Media Center
    - Nova movies integration
    - YouTube player
    - Twitch stream viewer
    
    🎨 Settings & UI
    - Full settings redesign
    - Light mode support
    - Custom theme system
    - Vanta.js animated backgrounds
    - New color system
    - Updated all icons
    
    🤖 AI Chat (Coming Soon)
    - Multi-model support
    - Custom personalities
    - VAPOR knowledge base
    `,
    buttonText: "Back"
  }
};

class ChangelogSystem {
  constructor() {
    this.storageKey = "fate_v4_last_seen";
    this.overlay = null;
    this.modal = null;
    this.isOpen = false;
  }

  init() {
    // Check if we should show startup notification
    const lastSeen = localStorage.getItem(this.storageKey);
    if (lastSeen !== FATE_CHANGELOG.version) {
      // Wait for page to fully load
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.showStartup());
      } else {
        setTimeout(() => this.showStartup(), 1000);
      }
    }
  }

  processContent(content) {
    return content
      .trim()
      .split("\n")
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        
        // Category headers (emoji lines)
        if (/^[🔥🎮🌐🎵🎬🎨🤖]/.test(trimmed)) {
          return `<h3 class="changelog-category">${trimmed}</h3>`;
        }
        
        // List items
        if (trimmed.startsWith("-")) {
          return `<li class="changelog-item">${trimmed.substring(1).trim()}</li>`;
        }
        
        // Bold text
        if (trimmed.includes("<b>")) {
          return `<p class="changelog-highlight">${trimmed}</p>`;
        }
        
        return `<p>${trimmed}</p>`;
      })
      .filter(line => line)
      .join("");
  }

  createOverlay() {
    if (this.overlay) return this.overlay;
    
    this.overlay = document.createElement("div");
    this.overlay.className = "fate-overlay";
    this.overlay.innerHTML = '<div class="fate-backdrop"></div>';
    document.body.appendChild(this.overlay);
    
    // Close on backdrop click
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay || e.target.className === "fate-backdrop") {
        this.close();
      }
    });
    
    return this.overlay;
  }

  showStartup() {
    this.createModal(FATE_CHANGELOG.startup, false);
  }

  showFull() {
    this.createModal(FATE_CHANGELOG.full, true);
  }

  createModal(data, isFull) {
    this.createOverlay();
    
    // Remove existing modal
    if (this.modal) {
      this.modal.classList.add("hiding");
      setTimeout(() => {
        if (this.modal) this.modal.remove();
        this.buildModal(data, isFull);
      }, 200);
    } else {
      this.buildModal(data, isFull);
    }
  }

  buildModal(data, isFull) {
    this.modal = document.createElement("div");
    this.modal.className = `fate-modal ${isFull ? "full-changelog" : "startup-notif"}`;
    
    const processedContent = this.processContent(data.content);
    
    let buttons = "";
    if (isFull) {
      buttons = `<button class="fate-btn fate-btn-primary" onclick="changelog.close()">${data.buttonText}</button>`;
    } else {
      buttons = `
        ${data.showChangelogLink ? `<button class="fate-btn fate-btn-secondary" onclick="changelog.showFull()">View Changelog</button>` : ""}
        <button class="fate-btn fate-btn-primary" onclick="changelog.dismissStartup()">${data.buttonText}</button>
      `;
    }
    
    this.modal.innerHTML = `
      <div class="fate-modal-header">
        <i class="${data.iconClass}"></i>
        <h2>${data.title}</h2>
        ${isFull ? `<span class="version-badge">v${FATE_CHANGELOG.version}</span>` : ""}
      </div>
      <div class="fate-modal-body">
        ${processedContent}
      </div>
      <div class="fate-modal-footer">
        ${buttons}
      </div>
    `;
    
    document.body.appendChild(this.modal);
    this.isOpen = true;
    
    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add("active");
      this.modal.classList.add("active");
    });
  }

  dismissStartup() {
    localStorage.setItem(this.storageKey, FATE_CHANGELOG.version);
    this.close();
  }

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    if (this.modal) {
      this.modal.classList.remove("active");
      this.modal.classList.add("hiding");
    }
    if (this.overlay) {
      this.overlay.classList.remove("active");
    }
    
    setTimeout(() => {
      if (this.modal) {
        this.modal.remove();
        this.modal = null;
      }
    }, 300);
  }
}

// Initialize
const changelog = new ChangelogSystem();

// Manual trigger function
function showChangelog(full = false) {
  if (full) {
    changelog.showFull();
  } else {
    changelog.showStartup();
  }
}

// Auto-init on load
changelog.init();
