document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.page');
  const navItems = document.querySelectorAll('.nav-item');
  const viewAll = document.querySelectorAll('.view-all');

  function switchPage(page) {
    navItems.forEach(n => n.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');
    document.querySelector(`.page[data-page="${page}"]`)?.classList.add('active');
  }

  navItems.forEach(n => n.addEventListener('click', () => switchPage(n.dataset.page)));
  viewAll.forEach(b => b.addEventListener('click', () => switchPage(b.dataset.page)));

  function createRow(label, value, suffix) {
    return `
      <div class="row">
        <div class="wallet">${label}</div>
        <div class="row-right">${value}<span class="suffix">${suffix}</span></div>
      </div>
    `;
  }

  function fill(containerId, type) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = '';
    for (let i = 1; i <= 30; i++) {
      if (type === 'roi') html += createRow(`roi${i}....`, `${Math.floor(Math.random()*600)}×`, 'ROI');
      if (type === 'devs') html += createRow(`dev${i}....`, `${(Math.random()*2).toFixed(2)}%`, 'WIN');
      if (type === 'traders') html += createRow(`tr${i}....`, `${(Math.random()*5).toFixed(2)} SOL`, 'PNL');
    }
    el.innerHTML = html;
  }

  fill('analytics-roi', 'roi');
  fill('analytics-devs', 'devs');
  fill('analytics-traders', 'traders');

  fill('devs-rows', 'devs');
  fill('roi-rows', 'roi');
  fill('traders-rows', 'traders');
});