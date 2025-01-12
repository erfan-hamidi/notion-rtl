// Throttle the applyRtlToPersianText function to run at most once every 500ms,
// preventing performance lag during rapid DOM changes.
let rtlApplyTimeout = null;

function applyRtlToPersianTextThrottled() {
  if (rtlApplyTimeout) {
    clearTimeout(rtlApplyTimeout);
  }
  rtlApplyTimeout = setTimeout(() => {
    applyRtlToPersianText();
    rtlApplyTimeout = null;
  }, 500);
}

let fontStyle = null;

function applyFontToPersianText() {

  //if the font style element doesn't exist, create it - avoid creating multiple elements
  if (!fontStyle) {
    fontStyle = document.createElement("style");
    document.head.appendChild(fontStyle);
  }

  const fontURLs = {
    ttf: chrome.runtime.getURL("fonts/Vazirmatn-Regular.ttf"),
    woff2: chrome.runtime.getURL("fonts/Vazirmatn-Regular.woff2")
  };

  fontStyle.textContent = `
    @font-face {
        font-family: "Vazirmatn";
        src: url("${fontURLs.ttf}") format("truetype"),
        url("${fontURLs.woff2}") format("woff2");
        font-weight: normal;
        font-style: normal;
    }
    body, div[contenteditable="true"] {
        font-family: "Vazirmatn", sans-serif !important;
    }
`;
}

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
    } else {
      element.style.direction = 'ltr';
      element.style.textAlign = 'left';
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


// Adjust border and padding for RTL layout in quote blocks
  const quoteBlocks = document.querySelectorAll('.notion-quote-block blockquote');
  quoteBlocks.forEach(block => {
    const quoteContent = block.querySelector('div:first-of-type');
    if (!quoteContent) return;

    if (persianRegex.test(quoteContent.textContent)) {
      quoteContent.style.borderRight = '3px solid currentcolor';
      quoteContent.style.borderLeft = 'none';
      quoteContent.style.paddingRight = '14px';
      quoteContent.style.paddingLeft = '0';
    } else {
      quoteContent.style.borderRight = 'none';
      quoteContent.style.borderLeft = '3px solid currentcolor';
      quoteContent.style.paddingRight = '0';
      quoteContent.style.paddingLeft = '14px';
    }
  });


  applyFontToPersianText();
}

// Run the function on page load
document.addEventListener('DOMContentLoaded', applyRtlToPersianTextThrottled);

// Run the function every time the DOM changes
const observer = new MutationObserver(applyRtlToPersianTextThrottled);
observer.observe(document.body, {childList: true, subtree: true});