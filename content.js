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
  
  // Apply RTL/LTR on numbered list blocks and pseudoBefore element (which shows the list number)
  const numberedListElements = document.querySelectorAll('.notion-numbered_list-block');
  numberedListElements.forEach(element => {
    if (persianRegex.test(element.textContent)) {
      const pseudoBefore = element.querySelector('.pseudoBefore');
      if (pseudoBefore) {
        pseudoBefore.style.direction = 'rtl';
        pseudoBefore.style.textAlign = 'right';
      }      
    } else {
      const pseudoBefore = element.querySelector('.pseudoBefore');
      if (pseudoBefore) {
        pseudoBefore.style.direction = 'ltr';
        pseudoBefore.style.textAlign = 'left';
      }
    }
  });
  // Force math elements to LTR by setting dir="ltr"
  const mathElements = document.querySelectorAll('.katex, .notion-text-equation-token');
  mathElements.forEach(elem => {
    elem.setAttribute('dir', 'ltr');
    elem.style.direction = 'ltr';
    elem.style.textAlign = 'left';
    elem.style.unicodeBidi = 'bidi-override';
  });
}

// Run the function on page load
document.addEventListener('DOMContentLoaded', applyRtlToPersianText);

// Run the function every time the DOM changes
const observer = new MutationObserver(applyRtlToPersianText);
observer.observe(document.body, { childList: true, subtree: true });
