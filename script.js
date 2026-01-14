document.addEventListener('DOMContentLoaded', () => {
  // ===== SIDEBAR TOGGLE =====
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarReopen = document.getElementById('sidebar-reopen');
  
  sidebarToggle?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });

  sidebarReopen?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-collapsed');
  });

  // ===== PAGE ROUTING =====
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.nav-item');
  const viewAllButtons = document.querySelectorAll('.view-all-btn');

  function switchPage(targetPage) {
    // Update nav items
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.page === targetPage) {
        item.classList.add('active');
      }
    });

    // Update pages
    pages.forEach(page => {
      if (page.dataset.page === targetPage) {
        page.classList.remove('active');
        // Trigger reflow
        void page.offsetWidth;
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchPage(item.dataset.page);
    });
  });

  viewAllButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetPage = btn.dataset.page;
      switchPage(targetPage);
    });
  });

  // ===== MODAL =====
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalFooterClose = document.querySelector('.modal-close-btn');

  function openModal(walletAddress) {
    document.getElementById('modal-wallet').textContent = walletAddress;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open modal on row click
  document.addEventListener('click', (e) => {
    // Don't open modal if clicking view-all button
    if (e.target.closest('.view-all-btn')) return;

    const row = e.target.closest('.data-row');
    if (!row) return;

    const walletEl = row.querySelector('.wallet-address');
    if (!walletEl) return;

    openModal(walletEl.textContent);
  });

  modalClose?.addEventListener('click', closeModal);
  modalFooterClose?.addEventListener('click', closeModal);

  // Close on overlay click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ===== GENERATE LEADERBOARD DATA =====
  function createRow({ wallet, meta, badge, value, suffix, rank }) {
    const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
    return `
      <div class="data-row" data-rank="${rank}">
        <div class="rank-badge ${rankClass}">${rank}</div>
        <div class="row-info">
          <div class="wallet-address">${wallet}</div>
          <div class="row-meta">
            <span class="meta-badge">${badge}</span>
            <span class="meta-text">${meta}</span>
          </div>
        </div>
        <div class="row-value">
          <div class="value-main ${suffix === 'PNL' ? 'positive' : ''}">${value}</div>
          <div class="value-label">${suffix}</div>
        </div>
      </div>
    `;
  }

  function generateLeaderboard(containerId, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    for (let i = 1; i <= 50; i++) {
      const signals = Math.ceil(Math.random() * 5);
      const trades = 5 + Math.ceil(Math.random() * 20);
      
      let value, suffix, badge;
      
      if (type === 'roi') {
        value = `${Math.floor(Math.random() * 600) + 50}×`;
        suffix = 'TOTAL ROI';
        badge = `${signals} SIGNALS`;
      } else if (type === 'devs') {
        value = `${(Math.random() * 95 + 5).toFixed(1)}%`;
        suffix = 'WIN RATE';
        badge = `${signals} TOKENS`;
      } else if (type === 'traders') {
        value = `+${(Math.random() * 150 + 10).toFixed(1)} SOL`;
        suffix = 'PNL';
        badge = `${signals} SIGNALS`;
      }

      html += createRow({
        wallet: `${generateRandomHash(6)}...${generateRandomHash(6)}`,
        meta: `${trades} TRADES`,
        badge: badge,
        value: value,
        suffix: suffix,
        rank: i
      });
    }

    container.innerHTML = html;
  }

  function generateRandomHash(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate leaderboards
  generateLeaderboard('roi-rows', 'roi');
  generateLeaderboard('devs-rows', 'devs');
  generateLeaderboard('traders-rows', 'traders');

  // ===== ANIMATE ON SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.data-section, .metric-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ===== SPARKLINE ANIMATION =====
  function animateSparklines() {
    const sparklines = document.querySelectorAll('.metric-sparkline');
    sparklines.forEach((sparkline, index) => {
      setTimeout(() => {
        sparkline.style.animation = `sparklineWave 3s ease-in-out infinite`;
        sparkline.style.animationDelay = `${index * 0.2}s`;
      }, index * 100);
    });
  }

  // Add sparkline animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparklineWave {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(-10px); }
    }
  `;
  document.head.appendChild(style);

  animateSparklines();

  // ===== LIVE UPDATE SIMULATION =====
  function simulateLiveUpdates() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    setInterval(() => {
      metricValues.forEach(valueEl => {
        const currentText = valueEl.textContent;
        // Add a subtle pulse effect
        valueEl.style.transform = 'scale(1.02)';
        setTimeout(() => {
          valueEl.style.transform = 'scale(1)';
        }, 200);
      });
    }, 12000); // Every 12 seconds
  }

  simulateLiveUpdates();

  // ===== PARALLAX EFFECT FOR GLOWS =====
  document.addEventListener('mousemove', (e) => {
    const sidebarGlow = document.querySelector('.sidebar-glow');
    const mainGlow = document.querySelector('.main-glow');
    
    if (sidebarGlow) {
      const x = (e.clientX / window.innerWidth) * 20;
      const y = (e.clientY / window.innerHeight) * 20;
      sidebarGlow.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    if (mainGlow) {
      const x = (e.clientX / window.innerWidth) * -15;
      const y = (e.clientY / window.innerHeight) * -15;
      mainGlow.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  // ===== SMOOTH SCROLL FOR MOBILE =====
  if (window.innerWidth <= 768) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ===== ADD STAGGER ANIMATION TO ROWS =====
  function addStaggerAnimation() {
    const rows = document.querySelectorAll('.data-row');
    rows.forEach((row, index) => {
      row.style.animationDelay = `${index * 0.03}s`;
    });
  }

  // Run on page load
  addStaggerAnimation();

  // Re-run when switching pages
  const originalSwitchPage = switchPage;
  switchPage = function(targetPage) {
    originalSwitchPage(targetPage);
    setTimeout(addStaggerAnimation, 100);
  };

  // ===== WALLET ADDRESS COPY TO CLIPBOARD =====
  document.addEventListener('click', (e) => {
    const walletAddress = e.target.closest('.wallet-address, .wallet-address-full');
    if (walletAddress && e.altKey) {
      const text = walletAddress.textContent;
      navigator.clipboard.writeText(text).then(() => {
        // Show temporary feedback
        const originalText = walletAddress.textContent;
        walletAddress.textContent = 'Copied!';
        walletAddress.style.color = 'var(--cyan)';
        
        setTimeout(() => {
          walletAddress.textContent = originalText;
          walletAddress.style.color = '';
        }, 1000);
      });
    }
  });

  // ===== KEYBOARD SHORTCUTS =====
  document.addEventListener('keydown', (e) => {
    // Only trigger if not typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
      case '1':
        switchPage('analytics');
        break;
      case '2':
        switchPage('roi');
        break;
      case '3':
        switchPage('devs');
        break;
      case '4':
        switchPage('traders');
        break;
      case 's':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          document.body.classList.toggle('sidebar-collapsed');
        }
        break;
    }
  });

  // ===== PERFORMANCE: DEBOUNCE RESIZE =====
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate any layout-dependent features
      addStaggerAnimation();
    }, 250);
  });

  // ===== INITIAL LOAD ANIMATIONS =====
  setTimeout(() => {
    document.querySelectorAll('.metric-card').forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 100);

  // ===== ADD GRADIENT ANIMATION TO HERO TEXT =====
  const gradientText = document.querySelector('.gradient-text');
  if (gradientText) {
    let hue = 0;
    setInterval(() => {
      hue = (hue + 1) % 360;
      // This creates a subtle color shift effect
    }, 50);
  }

  console.log('🚀 BagsApp Analytics loaded successfully!');
  console.log('💡 Tip: Alt + Click on wallet addresses to copy');
  console.log('⌨️ Keyboard shortcuts: 1-4 for pages, Ctrl+S for sidebar');
});
