// Navigation and carousel behavior from the supplied page template.
function closeContents() {
  document.getElementById('moreWorksDropdown').classList.remove('show');
  const button = document.querySelector('.more-works-btn');
  button.classList.remove('active');
  button.setAttribute('aria-expanded', 'false');
}
function toggleMoreWorks() {
  const dropdown = document.getElementById('moreWorksDropdown');
  const open = dropdown.classList.toggle('show');
  const button = document.querySelector('.more-works-btn');
  button.classList.toggle('active', open);
  button.setAttribute('aria-expanded', String(open));
}
document.addEventListener('click', event => {
  if (!event.target.closest('.more-works-container') || event.target.closest('.work-item')) closeContents();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeContents(); });
async function copyBibTeX() {
  const text = document.getElementById('bibtex-code').textContent;
  const button = document.querySelector('.copy-bibtex-btn');
  const label = button.querySelector('.copy-text');
  let copied = false;
  try { if (navigator.clipboard) { await navigator.clipboard.writeText(text); copied = true; } } catch (_) {}
  if (!copied) {
    const area = document.createElement('textarea');
    area.value = text; area.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(area); area.select();
    try { copied = document.execCommand('copy'); } catch (_) {}
    area.remove(); button.focus();
  }
  if (!copied) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('bibtex-code'));
    selection.removeAllRanges(); selection.addRange(range);
  }
  label.textContent = copied ? 'Copied!' : 'Text selected';
  button.classList.toggle('copied', copied);
  setTimeout(() => { label.textContent = 'Copy'; button.classList.remove('copied'); }, 2500);
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
window.addEventListener('scroll', () => document.querySelector('.scroll-to-top').classList.toggle('visible', window.scrollY > 300), { passive: true });
document.addEventListener('DOMContentLoaded', () => {
  bulmaCarousel.attach('.carousel', {
    slidesToScroll: 1, slidesToShow: 1, loop: true, infinite: false,
    autoplay: false, navigation: true, pagination: true
  });
  document.querySelectorAll('.slider-navigation-next').forEach(button => { button.setAttribute('aria-label', 'Next figure'); button.setAttribute('role', 'button'); button.tabIndex = 0; });
  document.querySelectorAll('.slider-navigation-previous').forEach(button => { button.setAttribute('aria-label', 'Previous figure'); button.setAttribute('role', 'button'); button.tabIndex = 0; });
  document.querySelectorAll('.slider-navigation-next, .slider-navigation-previous').forEach(button => button.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); button.click(); } }));
});
