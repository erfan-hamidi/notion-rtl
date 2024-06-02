function applyRtlToPersianText() {
  const persianRegex = /[\u0600-\u06FF]/;
  const elements = document.querySelectorAll(
    'div[contenteditable="true"] span, ' +
    'div[contenteditable="true"] p, ' +
    'div[contenteditable="true"] div, ' +
    'div[contenteditable="true"] ul, ' +
    'div[contenteditable="true"] ol, ' +
    'div[contenteditable="true"] li, ' +
    'div[contenteditable="true"] .notion-toggle, ' +
    'div[contenteditable="true"] .notion-toggle-content'
  );

  elements.forEach(element => {
    if (persianRegex.test(element.textContent)) {
      element.style.direction = 'rtl';
      element.style.textAlign = 'right';
      element.classList.add('rtl-text');
    } else {
      element.style.direction = 'ltr';
      element.style.textAlign = 'left';
      element.classList.remove('rtl-text');
    }
  });
}

// Run the function on page load
document.addEventListener('DOMContentLoaded', applyRtlToPersianText);

// Run the function every time the DOM changes
const observer = new MutationObserver(applyRtlToPersianText);
observer.observe(document.body, { childList: true, subtree: true });
