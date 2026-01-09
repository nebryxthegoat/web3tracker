document.addEventListener('DOMContentLoaded', () => {
  // ===== SIDEBAR =====
  const sidebarToggle = document.getElementById('sidebar-toggle');
  sidebarToggle?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
  });

  // ===== PAGE ROUTING =====
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.nav-item');
  const viewAllButtons = document.querySelectorAll('.view-all');

  function switchPage(targetPage) {
    navItems.forEach(i => i.classList.remove('active'));
    document
      .querySelector(`.nav-item[data-page="${targetPage}"]`)
      ?.classList.add('active');

    pages.forEach(page => {
      page.classList.remove('active');
      if (page.dataset.page === targetPage) {
        page.classList.add('active');
      }
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchPage(item.dataset.page);
    });
  });

  viewAllButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();          // 🔒 stop bubbling
    const targetPage = e.currentTarget.dataset.page; // ✅ always correct
    switchPage(targetPage);
  });
});

  // ===== MODAL =====
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalFooterClose = document.querySelector('.modal-close-btn');

  function closeModal() {
    modal.classList.remove('active');
  }

  document.addEventListener('click', (e) => {
  if (e.target.closest('.view-all')) return;

  const row = e.target.closest('.row');
  if (!row) return;

  const walletEl = row.querySelector('.wallet');
  if (!walletEl) return;

  document.getElementById('modal-wallet').innerText = walletEl.innerText;
  modal.classList.add('active');
});

  modalClose?.addEventListener('click', closeModal);
  modalFooterClose?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ===== METRICS CAROUSEL (MOBILE) =====
  const metrics = document.querySelector('.metrics');
  const dots = document.querySelectorAll('.metrics-dots .dot');
  let currentIndex = 0;
  let startX = 0;

  function goToMetric(index) {
    metrics.scrollTo({
      left: metrics.offsetWidth * index,
      behavior: 'smooth'
    });

    dots.forEach(d => d.classList.remove('active'));
    dots[index]?.classList.add('active');
  }

  if (metrics && dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        currentIndex = i;
        goToMetric(i);
      });
    });

    metrics.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    metrics.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 50) return;

      if (diff > 0 && currentIndex < dots.length - 1) currentIndex++;
      if (diff < 0 && currentIndex > 0) currentIndex--;

      goToMetric(currentIndex);
    });

    goToMetric(0);
  }

// ===== UTILITY FUNCTIONS (GLOBAL) =====

function createRow({ wallet, meta, signal, value, suffix }) {
  return `
    <div class="row">
      <div>
        <div class="wallet">${wallet}</div>
        <div class="meta">${meta}</div>
      </div>
      <span class="signal">${signal}</span>
      <div class="row-right">
        ${value}
        <span class="suffix">${suffix}</span>
      </div>
    </div>
  `;
}

function generateRows(containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';

  for (let i = 1; i <= 50; i++) {
    html += createRow({
      wallet: `${type}${i}....${1000 + i}`,
      meta: `${Math.ceil(Math.random() * 5)} SIGNALS • ${10 + i} TRADES`,
      signal: `${Math.ceil(Math.random() * 5)} SIGNALS`,
      value:
  type === 'roi'
    ? `${Math.floor(Math.random() * 600)}×`
    : type === 'traders'
    ? `${(Math.random() * 5).toFixed(2)} SOL`
    : `${(Math.random() * 2).toFixed(2)}%`,
      suffix:
        type === 'roi'
          ? 'TOTAL ROI'
          : type === 'traders'
          ? 'PNL'
          : 'WIN RATE'
    });
  }

  container.innerHTML = html;
}

generateRows('devs-rows', 'devs');
generateRows('roi-rows', 'roi');
generateRows('traders-rows', 'traders');})