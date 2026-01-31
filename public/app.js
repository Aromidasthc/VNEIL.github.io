/**
 * VNEIL OS Interactive Map - Vanilla JavaScript
 * Purpose: Render and control the VNEIL OS structure map
 * Assumptions: DOM is loaded before execution
 * Invariants: Map structure matches TSVNE system architecture
 */

(function() {
  'use strict';

  // SSOT: VNEIL OS Map Data Structure
  const VNEIL_STRUCTURE = {
    root: {
      id: 'boson-o',
      label: '🌌 BOSON-O — Kotwica Istnienia',
      description: 'Fundamentalna kotwica egzystencji systemu VNEIL',
      type: 'root'
    },
    core: {
      id: 'core-0',
      label: 'CORE-0 — Aktywator Egzystencji',
      description: 'Rdzeń aktywujący egzystencję systemu',
      type: 'primary',
      children: [
        {
          id: 'invariants',
          label: 'I — Inwarianty',
          description: 'Niezmienne zasady systemowe',
          type: 'secondary'
        },
        {
          id: 'ecg',
          label: 'ECG — Przyczynowość',
          description: 'Graf przyczynowo-skutkowy',
          type: 'secondary',
          children: [
            {
              id: 'k-star',
              label: 'K* — Warunek Egzystencjalny',
              description: 'Kluczowy warunek istnienia'
            },
            {
              id: 'tvm',
              label: 'TVM — Tryb Awaryjny',
              description: 'Mechanizm bezpieczeństwa krytycznego'
            },
            {
              id: 'phi-control',
              label: 'φ-control — Kanał Decyzyjny',
              description: 'Kontrola przepływu decyzji'
            }
          ]
        },
        {
          id: 'eil-ai',
          label: 'EIL AI — Egzekutor Logiczny',
          description: 'Sztuczna inteligencja wykonawcza',
          type: 'secondary',
          children: [
            {
              id: 'witness',
              label: 'WITNESS — Rejestr Dowodów',
              description: 'System rejestracji i audytu'
            },
            {
              id: 'rules',
              label: 'R_allow / R_tunnel — Ramy Reguł',
              description: 'Mechanizmy kontroli dostępu'
            }
          ]
        }
      ]
    },
    metaCycle: {
      id: 'meta-cycle',
      label: 'META-CYCLE — Cykl Systemowy',
      description: 'Cykl życia systemu',
      type: 'primary',
      children: [
        {
          id: 'regeneration',
          label: 'Regeneracja — Naprawa',
          description: 'Proces samonaprawy systemu'
        },
        {
          id: 'reincarnation',
          label: 'Reinkarnacja — Reset',
          description: 'Pełny reset systemu'
        },
        {
          id: 'shutdown',
          label: 'Samowyłączenie — Zakończenie',
          description: 'Kontrolowane zakończenie działania'
        }
      ]
    },
    ports: {
      id: 'ports',
      label: 'PORTY SYSTEMOWE (BOX 1–10)',
      description: 'Interfejsy zewnętrzne systemu',
      type: 'primary',
      boxes: 10
    }
  };

  // State management
  let selectedNode = null;

  /**
   * Create a DOM element for a map node
   * @param {Object} node - Node configuration
   * @param {string} cssClass - Additional CSS classes
   * @returns {HTMLElement} - Created node element
   */
  function createNode(node, cssClass = '') {
    const nodeEl = document.createElement('div');
    nodeEl.className = `map-node ${cssClass}`;
    nodeEl.setAttribute('data-id', node.id);
    nodeEl.setAttribute('role', 'button');
    nodeEl.setAttribute('tabindex', '0');
    nodeEl.setAttribute('aria-label', node.label);
    nodeEl.textContent = node.label;
    
    // Click handler
    nodeEl.addEventListener('click', () => selectNode(node));
    
    // Keyboard accessibility
    nodeEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectNode(node);
      }
    });
    
    return nodeEl;
  }

  /**
   * Create connector line between levels
   * @returns {HTMLElement} - Connector element
   */
  function createConnector() {
    const connector = document.createElement('div');
    connector.className = 'connector';
    return connector;
  }

  /**
   * Handle node selection
   * @param {Object} node - Selected node
   */
  function selectNode(node) {
    selectedNode = node;
    updateSelectedInfo(node);
    
    // Visual feedback
    document.querySelectorAll('.map-node, .box-node').forEach(el => {
      el.style.borderColor = '';
    });
    
    const selectedEl = document.querySelector(`[data-id="${node.id}"]`);
    if (selectedEl) {
      selectedEl.style.borderColor = 'var(--neon-cyan)';
      selectedEl.style.boxShadow = '0 0 25px rgba(0, 212, 255, 0.6)';
    }
  }

  /**
   * Update selected node info display
   * @param {Object} node - Selected node
   */
  function updateSelectedInfo(node) {
    const infoEl = document.getElementById('selected-info');
    if (!infoEl) return;
    
    infoEl.style.display = 'block';
    infoEl.innerHTML = `
      <strong>Wybrano:</strong> ${node.label}<br>
      <span style="color: var(--text-secondary); font-size: 0.9rem;">${node.description || ''}</span>
    `;
  }

  /**
   * Render children nodes recursively
   * @param {Array} children - Child nodes array
   * @param {HTMLElement} container - Parent container
   */
  function renderChildren(children, container) {
    if (!children || children.length === 0) return;
    
    const childContainer = document.createElement('div');
    childContainer.className = 'map-children';
    
    children.forEach(child => {
      const childGroup = document.createElement('div');
      childGroup.className = 'map-group';
      
      const childNode = createNode(child, child.type || '');
      childGroup.appendChild(childNode);
      
      if (child.children) {
        renderChildren(child.children, childGroup);
      }
      
      childContainer.appendChild(childGroup);
    });
    
    container.appendChild(childContainer);
  }

  /**
   * Render complete OS map
   */
  function renderMap() {
    const mapContainer = document.getElementById('os-map');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }
    
    mapContainer.innerHTML = '';
    
    // Root node (BOSON-O)
    const rootLevel = document.createElement('div');
    rootLevel.className = 'map-level';
    const rootNode = createNode(VNEIL_STRUCTURE.root, 'primary');
    rootLevel.appendChild(rootNode);
    mapContainer.appendChild(rootLevel);
    
    mapContainer.appendChild(createConnector());
    
    // CORE-0 section
    const coreLevel = document.createElement('div');
    coreLevel.className = 'map-level';
    const coreNode = createNode(VNEIL_STRUCTURE.core, 'primary');
    coreLevel.appendChild(coreNode);
    
    if (VNEIL_STRUCTURE.core.children) {
      renderChildren(VNEIL_STRUCTURE.core.children, coreLevel);
    }
    
    mapContainer.appendChild(coreLevel);
    mapContainer.appendChild(createConnector());
    
    // META-CYCLE section
    const metaLevel = document.createElement('div');
    metaLevel.className = 'map-level';
    const metaNode = createNode(VNEIL_STRUCTURE.metaCycle, 'primary');
    metaLevel.appendChild(metaNode);
    
    if (VNEIL_STRUCTURE.metaCycle.children) {
      renderChildren(VNEIL_STRUCTURE.metaCycle.children, metaLevel);
    }
    
    mapContainer.appendChild(metaLevel);
    mapContainer.appendChild(createConnector());
    
    // PORTS section (BOX 1-10)
    const portsLevel = document.createElement('div');
    portsLevel.className = 'map-level';
    const portsNode = createNode(VNEIL_STRUCTURE.ports, 'primary');
    portsLevel.appendChild(portsNode);
    
    // Create BOX grid
    const boxGrid = document.createElement('div');
    boxGrid.className = 'box-grid';
    
    for (let i = 1; i <= VNEIL_STRUCTURE.ports.boxes; i++) {
      const boxNode = document.createElement('div');
      boxNode.className = 'box-node';
      boxNode.setAttribute('data-id', `box-${i}`);
      boxNode.setAttribute('role', 'button');
      boxNode.setAttribute('tabindex', '0');
      boxNode.textContent = `BOX-${i}`;
      
      const boxData = {
        id: `box-${i}`,
        label: `BOX-${i}`,
        description: `Port systemowy nr ${i}`
      };
      
      boxNode.addEventListener('click', () => selectNode(boxData));
      boxNode.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectNode(boxData);
        }
      });
      
      boxGrid.appendChild(boxNode);
    }
    
    portsLevel.appendChild(boxGrid);
    mapContainer.appendChild(portsLevel);
  }

  /**
   * Check system health
   */
  async function checkHealth() {
    const statusEl = document.getElementById('system-status');
    
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      if (statusEl && data.status === 'ok') {
        statusEl.innerHTML = `
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span>System operacyjny: AKTYWNY</span>
          </div>
        `;
      }
    } catch (error) {
      console.warn('Health check failed:', error);
      // Show error state to user
      if (statusEl) {
        statusEl.innerHTML = `
          <div class="status-indicator">
            <span class="status-dot" style="background: #ff4444; box-shadow: 0 0 10px #ff4444;"></span>
            <span style="color: #ff8888;">System operacyjny: BŁĄD POŁĄCZENIA</span>
          </div>
        `;
      }
    }
  }

  /**
   * Initialize the application
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        renderMap();
        checkHealth();
        initSystemLive();
      });
    } else {
      renderMap();
      checkHealth();
      initSystemLive();
    }
  }

  /**
   * ================================================
   * SYSTEM LIVE - Interactive OS Interface
   * ================================================
   */
  
  // Global log function for use by observer mode
  window.vneilAddLog = null;
  
  function initSystemLive() {
    // System metrics simulation
    let energy = 100;
    let memory = 0;
    let processCount = 0;
    const logs = [];
    
    /**
     * Add log entry to activity log
     */
    function addLog(message, type = 'info') {
      const logContent = document.getElementById('log-content');
      if (!logContent) return;
      
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.innerHTML = `
        <span class="log-time">${timeStr}</span>
        <span class="log-message ${type}">${message}</span>
      `;
      
      logContent.insertBefore(logEntry, logContent.firstChild);
      logs.push({ time: timeStr, message, type });
      
      // Keep max 50 logs
      if (logs.length > 50) {
        logs.shift();
        const entries = logContent.querySelectorAll('.log-entry');
        if (entries.length > 50) {
          entries[entries.length - 1].remove();
        }
      }
    }
    
    // Make addLog available globally for observer mode
    window.vneilAddLog = addLog;
    
    // Add initial log entry
    addLog('System VNEIL OS uruchomiony pomyślnie', 'success');
    addLog('Inicjalizacja modułów TSVNE...', 'info');
    addLog('BOSON-O: Kotwica aktywna', 'success');
    
    // Update system metrics periodically
    setInterval(() => {
      // Simulate system activity
      memory = Math.min(95, memory + Math.random() * 5);
      energy = Math.max(60, 100 - memory * 0.3);
      processCount = Math.floor(Math.random() * 3) + 8;
      
      updateMetrics(energy, memory, processCount);
      
      // Random system events
      if (Math.random() > 0.7) {
        const events = [
          { msg: 'CORE-0: Egzystencja zweryfikowana', type: 'success' },
          { msg: 'EIL AI: Przetwarzanie danych...', type: 'info' },
          { msg: 'META-CYCLE: Regeneracja w toku', type: 'info' },
          { msg: 'WITNESS: Nowy wpis w rejestrze', type: 'success' },
          { msg: 'ECG: Graf przyczynowości zaktualizowany', type: 'info' },
          { msg: 'TVM: Tryb awaryjny w gotowości', type: 'warning' }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        addLog(event.msg, event.type);
      }
    }, 3000);
    
    // Clear log button handler
    const clearLogBtn = document.getElementById('clear-log');
    if (clearLogBtn) {
      clearLogBtn.addEventListener('click', () => {
        const logContent = document.getElementById('log-content');
        if (logContent) {
          logContent.innerHTML = '';
          logs.length = 0;
          addLog('Dziennik wyczyszczony', 'info');
        }
      });
    }
    
    /**
     * Update system metrics display
     */
    function updateMetrics(energyVal, memoryVal, processVal) {
      // Update energy
      const energyStatus = document.getElementById('energy-status');
      const energyBar = document.getElementById('energy-bar');
      if (energyStatus && energyBar) {
        energyStatus.textContent = `${Math.round(energyVal)}%`;
        energyBar.style.width = `${energyVal}%`;
        
        // Change color based on level
        if (energyVal < 70) {
          energyBar.style.background = 'linear-gradient(90deg, #ffaa00, #ff6600)';
        } else {
          energyBar.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))';
        }
      }
      
      // Update memory
      const memoryStatus = document.getElementById('memory-status');
      const memoryBar = document.getElementById('memory-bar');
      if (memoryStatus && memoryBar) {
        memoryStatus.textContent = `${Math.round(memoryVal)}%`;
        memoryBar.style.width = `${memoryVal}%`;
        
        // Change color based on usage
        if (memoryVal > 80) {
          memoryBar.style.background = 'linear-gradient(90deg, #ff6600, #ff4444)';
        } else {
          memoryBar.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))';
        }
      }
      
      // Update process count
      const processCount = document.getElementById('process-count');
      if (processCount) {
        processCount.textContent = processVal;
      }
    }
    
    // Add log when user interacts with map
    const originalSelectNode = selectNode;
    selectNode = function(node) {
      originalSelectNode(node);
      addLog(`Moduł wybrany: ${node.label}`, 'info');
      
      // Disable observer mode on user interaction
      if (observerMode.isActive) {
        observerMode.disable();
      }
    };
  }

  /**
   * ================================================
   * OBSERVER MODE - Autonomous System Demo
   * ================================================
   */
  
  const observerMode = {
    isActive: false,
    intervalId: null,
    timeoutId: null,
    currentIndex: 0,
    
    // All nodes in order for the demo
    nodeSequence: [
      VNEIL_STRUCTURE.root,
      VNEIL_STRUCTURE.core,
      ...VNEIL_STRUCTURE.core.children.flatMap(child => [child, ...(child.children || [])]),
      VNEIL_STRUCTURE.metaCycle,
      ...(VNEIL_STRUCTURE.metaCycle.children || []),
      VNEIL_STRUCTURE.ports
    ],
    
    /**
     * Enable observer mode
     */
    enable() {
      if (this.isActive) return;
      
      this.isActive = true;
      this.currentIndex = 0;
      
      // Update UI
      const button = document.getElementById('observer-toggle');
      const status = document.getElementById('observer-status');
      if (button) button.classList.add('active');
      if (status) status.textContent = 'Tryb Obserwatora: ON';
      
      // Log activation
      if (window.vneilAddLog) {
        window.vneilAddLog('🔍 Tryb Obserwatora aktywowany', 'info');
        window.vneilAddLog('System rozpoczyna automatyczną prezentację...', 'info');
      }
      
      // Start the demonstration
      this.startDemo();
    },
    
    /**
     * Disable observer mode
     */
    disable() {
      if (!this.isActive) return;
      
      this.isActive = false;
      
      // Clear intervals
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      
      // Update UI
      const button = document.getElementById('observer-toggle');
      const status = document.getElementById('observer-status');
      if (button) button.classList.remove('active');
      if (status) status.textContent = 'Tryb Obserwatora: OFF';
      
      // Clear selection highlight
      document.querySelectorAll('.map-node, .box-node').forEach(el => {
        el.style.borderColor = '';
        el.style.boxShadow = '';
      });
      
      // Log deactivation
      if (window.vneilAddLog) {
        window.vneilAddLog('Tryb Obserwatora wyłączony', 'info');
      }
    },
    
    /**
     * Start the autonomous demo
     */
    startDemo() {
      // Cycle through nodes every 4 seconds
      this.intervalId = setInterval(() => {
        if (!this.isActive) return;
        
        const node = this.nodeSequence[this.currentIndex];
        if (node) {
          // Select the node
          selectNode(node);
          
          // Generate contextual log entry
          this.generateContextualLog(node);
        }
        
        // Move to next node
        this.currentIndex = (this.currentIndex + 1) % this.nodeSequence.length;
      }, 4000);
    },
    
    /**
     * Generate contextual log entries based on selected module
     */
    generateContextualLog(node) {
      const contextualLogs = {
        'boson-o': [
          'BOSON-O: Weryfikacja kotwicy egzystencji...',
          'BOSON-O: Stabilność fundamentalna potwierdzona',
          'BOSON-O: Synchronizacja z rdzeniem systemu'
        ],
        'core-0': [
          'CORE-0: Aktywacja sekwencji egzystencjalnej',
          'CORE-0: Wszystkie moduły operacyjne',
          'CORE-0: Przepływ energii optymalny'
        ],
        'invariants': [
          'Inwarianty: Reguły niezmiennicze zweryfikowane',
          'Inwarianty: Spójność systemowa zachowana'
        ],
        'ecg': [
          'ECG: Analiza grafu przyczynowo-skutkowego',
          'ECG: Wykryto 47 zależności krytycznych',
          'ECG: Łańcuch przyczynowy zaktualizowany'
        ],
        'k-star': [
          'K*: Warunek egzystencjalny spełniony',
          'K*: Próg krytyczny: BEZPIECZNY'
        ],
        'tvm': [
          'TVM: Tryb awaryjny w gotowości',
          'TVM: Protokoły bezpieczeństwa aktywne',
          'TVM: Czas reakcji: < 10ms'
        ],
        'phi-control': [
          'φ-control: Kanał decyzyjny otwarty',
          'φ-control: Przepływ poleceń: NORMALNY'
        ],
        'eil-ai': [
          'EIL AI: Przetwarzanie logiczne w toku...',
          'EIL AI: Analiza semantyczna zakończona',
          'EIL AI: Egzekucja reguł: AKTYWNA'
        ],
        'witness': [
          'WITNESS: Nowy wpis w rejestrze dowodów',
          'WITNESS: Audyt nr #' + Math.floor(Math.random() * 10000),
          'WITNESS: Integralność danych potwierdzona'
        ],
        'rules': [
          'R_allow: 248 reguł aktywnych',
          'R_tunnel: Tunelowanie bezpieczne',
          'Ramy reguł: Wszystkie w normie'
        ],
        'meta-cycle': [
          'META-CYCLE: Rozpoczęto cykl systemowy',
          'META-CYCLE: Faza: MONITOROWANIE',
          'META-CYCLE: Kondycja systemu: OPTYMALNA'
        ],
        'regeneration': [
          'Regeneracja: Skanowanie modułów...',
          'Regeneracja: Wykryto 0 błędów',
          'Regeneracja: Optymalizacja pamięci'
        ],
        'reincarnation': [
          'Reinkarnacja: Protokół resetu sprawdzony',
          'Reinkarnacja: Punkt przywracania: OK'
        ],
        'shutdown': [
          'Samowyłączenie: Procedury w gotowości',
          'Samowyłączenie: Kontrolowane zakończenie dostępne'
        ],
        'ports': [
          'PORTY: Skanowanie interfejsów zewnętrznych',
          'PORTY: BOX 1-10 w trybie nasłuchu',
          'PORTY: Bezpieczeństwo: MAKSYMALNE'
        ]
      };
      
      const logs = contextualLogs[node.id];
      if (logs && logs.length > 0 && window.vneilAddLog) {
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        // Use a small delay to ensure it's called after node selection log
        setTimeout(() => {
          window.vneilAddLog(randomLog, 'info');
        }, 500);
      }
    }
  };
  
  /**
   * Initialize Observer Mode controls
   */
  function initObserverMode() {
    const toggleButton = document.getElementById('observer-toggle');
    
    if (toggleButton) {
      // Toggle on button click
      toggleButton.addEventListener('click', () => {
        if (observerMode.isActive) {
          observerMode.disable();
        } else {
          observerMode.enable();
        }
      });
    }
    
    // Auto-enable after 25 seconds of inactivity
    let inactivityTimer = null;
    
    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      // If observer mode is active, disable it on user interaction
      if (observerMode.isActive) {
        observerMode.disable();
      }
      
      // Set new timer
      inactivityTimer = setTimeout(() => {
        if (!observerMode.isActive) {
          observerMode.enable();
        }
      }, 25000); // 25 seconds
    };
    
    // Track user interactions
    ['click', 'mousemove', 'keypress', 'touchstart', 'scroll'].forEach(event => {
      document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    // Start the initial timer
    resetInactivityTimer();
  }

  // Start the application
  init();
  
  // Initialize Observer Mode after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserverMode);
  } else {
    initObserverMode();
  }
})();
