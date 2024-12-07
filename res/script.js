// SPDX-FileCopyrightText: Copyright 2024 Fabio Iotti
// SPDX-License-Identifier: AGPL-3.0-only

// @ts-check

const page = /** @type {HTMLDivElement} */(document.getElementById('page'));
const pageImg = /** @type {HTMLImageElement} */(page.querySelector('img'));
const pageWordTemplate = /** @type {HTMLDivElement} */(page.querySelector('.word'));
const pageSymbolTemplate = /** @type {HTMLDivElement} */(page.querySelector('.symbol'));
const pageLinkTemplate = /** @type {HTMLDivElement} */(page.querySelector('.link'));

const nav = /** @type {HTMLDivElement} */(document.getElementById('nav'));

const prevPageButton = /** @type {HTMLButtonElement} */(document.getElementById('prev_page'));
const nextPageButton = /** @type {HTMLButtonElement} */(document.getElementById('next_page'));
const goToTocButton = /** @type {HTMLButtonElement} */(document.getElementById('go_to_toc'));
const pageSelect = /** @type {HTMLSelectElement} */(document.getElementById('page_select'));
const pageSelectOptionTemplate = /** @type {HTMLOptionElement} */(pageSelect.querySelector('option'));

const modeViewButton = /** @type {HTMLButtonElement} */(document.getElementById('mode_view'));
const modeWordButton = /** @type {HTMLButtonElement} */(document.getElementById('mode_word'));
const modeSymbolButton = /** @type {HTMLButtonElement} */(document.getElementById('mode_symbol'));
const modeLinkButton = /** @type {HTMLButtonElement} */(document.getElementById('mode_link'));

//#region Page selection

const TOC_PAGE_ID = "pg02";

/** @type {{ [id: string]: { src: string, label: string } }} */
const PAGES = {
  "pg02": { src: "res/manual/page02.png", label: "02" },
  "pg03": { src: "res/manual/page03-04.png", label: "03-04" },
  "pg05": { src: "res/manual/page05-06.png", label: "05-06" },
  "pg07": { src: "res/manual/page07-08.png", label: "07-08" },
  "pg09": { src: "res/manual/page09-10.png", label: "09-10" },
  "pg11": { src: "res/manual/page11-12.png", label: "11-12" },
  "pg13": { src: "res/manual/page13-14.png", label: "13-14" },
  "pg15": { src: "res/manual/page15-16.png", label: "15-16" },
  "pg17": { src: "res/manual/page17-18.png", label: "17-18" },
  "pg19": { src: "res/manual/page19-20.png", label: "29-20" },
  "pg21": { src: "res/manual/page21-22.png", label: "21-22" },
  "pg23": { src: "res/manual/page23-24.png", label: "23-24" },
  "pg25": { src: "res/manual/page25-26.png", label: "25-26" },
  "pg27": { src: "res/manual/page27-28.png", label: "27-28" },
  "pg29": { src: "res/manual/page29-30.png", label: "29-30" },
  "pg31": { src: "res/manual/page31-32.png", label: "31-32" },
  "pg33": { src: "res/manual/page33-34.png", label: "33-34" },
  "pg35": { src: "res/manual/page35-36.png", label: "35-36" },
  "pg37": { src: "res/manual/page37-38.png", label: "37-38" },
  "pg39": { src: "res/manual/page39-40.png", label: "39-40" },
  "pg41": { src: "res/manual/page41-42.png", label: "41-42" },
  "pg43": { src: "res/manual/page43-44.png", label: "43-44" },
  "pg45": { src: "res/manual/page45-46.png", label: "45-46" },
  "pg47": { src: "res/manual/page47-48.png", label: "47-48" },
  "pg49": { src: "res/manual/page49-50.png", label: "49-50" },
  "pg51": { src: "res/manual/page51-52.png", label: "51-52" },
  "pg53": { src: "res/manual/page53-54.png", label: "53-54" },
  "pg55": { src: "res/manual/page55.png", label: "55" },
};

const goToPage = (id) => {
  pageImg.src = PAGES[id]?.src;

  if (pageSelect.value != id)
    pageSelect.value = id;

  localStorage.setItem('tunic_manual_translation.page', id);

  loadPageElements(pageSelect.value);
};

for (const id in PAGES) {
  const opt = /** @type {HTMLOptionElement} */(pageSelectOptionTemplate.cloneNode(true));
  opt.value = id;
  opt.textContent = PAGES[id].label;

  pageSelectOptionTemplate.parentElement?.insertBefore(opt, pageSelectOptionTemplate);
}
pageSelectOptionTemplate.remove();

pageSelect.addEventListener('change', ev => {
  ev.preventDefault();
  goToPage(pageSelect.value);
});

const goToPrevPage = () => {
  const pageIds = Object.keys(PAGES);
  const pageIndex = pageIds.indexOf(pageSelect.value);
  goToPage((pageIndex == 0 || pageIndex == -1) ? pageIds[pageIds.length - 1] : pageIds[pageIndex - 1]);
};

const goToNextPage = () => {
  const pageIds = Object.keys(PAGES);
  const pageIndex = pageIds.indexOf(pageSelect.value);
  goToPage((pageIndex == pageIds.length - 1 || pageIndex == -1) ? pageIds[0] : pageIds[pageIndex + 1]);
};

prevPageButton.addEventListener('click', ev => {
  ev.preventDefault();
  goToPrevPage();
});

nextPageButton.addEventListener('click', ev => {
  ev.preventDefault();
  goToNextPage();
});

goToTocButton.addEventListener('click', ev => {
  ev.preventDefault();
  goToPage(TOC_PAGE_ID);
});

pageSelect.value = localStorage.getItem('tunic_manual_translation.page') ?? Object.keys(PAGES)[0];

//#endregion

//#region Edit mode selection

/** @typedef {'VIEW' | 'WORD' | 'SYMBOL' | 'LINK'} EditMode */
/** @type {EditMode} */
let currentEditMode = 'VIEW';

/** @type {Record<EditMode, HTMLButtonElement>} */
const MODE_BUTTON = {
  'VIEW': modeViewButton,
  'WORD': modeWordButton,
  'SYMBOL': modeSymbolButton,
  'LINK': modeLinkButton,
};

/** @type {Record<EditMode, string>} */
const MODE_CLASSES = {
  'VIEW': 'mode-view',
  'WORD': 'mode-word',
  'SYMBOL': 'mode-symbol',
  'LINK': 'mode-link',
};

const setEditMode = (/** @type {EditMode} */mode) => {
  MODE_BUTTON[currentEditMode]?.classList.remove('active');
  MODE_BUTTON[mode]?.classList.add('active');

  document.body.classList.remove(MODE_CLASSES[currentEditMode]);
  document.body.classList.add(MODE_CLASSES[mode]);

  currentEditMode = mode;

  localStorage.setItem('tunic_manual_translation.edit_mode', currentEditMode);
};

modeViewButton.addEventListener('click', ev => {
  ev.preventDefault();
  setEditMode('VIEW');
});

modeWordButton.addEventListener('click', ev => {
  ev.preventDefault();
  setEditMode('WORD');
});

modeSymbolButton.addEventListener('click', ev => {
  ev.preventDefault();
  setEditMode('SYMBOL');
});

modeLinkButton.addEventListener('click', ev => {
  ev.preventDefault();
  setEditMode('LINK');
});

currentEditMode = /** @type {EditMode|null} */(localStorage.getItem('tunic_manual_translation.edit_mode')) ?? 'VIEW';
setEditMode(currentEditMode);

//#endregion

//#region Element placement

/** @type {{ lastPos: { clientX: number, clientY: number }, start: { clientX: number, clientY: number }, end: { clientX: number, clientY: number }, el: HTMLDivElement } | null} */
let currentDrawingElement = null;

/** @satisfies {Partial<Record<EditMode, HTMLDivElement>>} */
const DRAWING_ELEMENT_TEMPLATES = {
  'WORD': pageWordTemplate,
  'SYMBOL': pageSymbolTemplate,
  'LINK': pageLinkTemplate,
};

/** @satisfies {Partial<Record<EditMode, string>>} */
const DRAWING_ELEMENT_CLASSES = {
  'WORD': 'word',
  'SYMBOL': 'symbol',
  'LINK': 'link',
};

/**
 * @param {EditMode} type
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
const addNewElement = (type, x, y, width, height) => {
  const id = uuidv4();

  const pages = data.pages ??= {};
  const page = pages[pageSelect.value] ??= { };

  /** @type {page[keyof page]} */
  let element;
  switch (type) {
    case 'WORD':
      element = page.words ??= {};
      break;

    case 'SYMBOL':
      element = page.symbols ??= {};
      break;

    case 'LINK':
      element = page.links ??= {};
      break;

    default:
      throw new Error(`Invalid type: ${type}`);
  }

  element[id] = { x, y, w: width, h: height };

  saveUpdatedData();

  // Refresh page.
  loadPageElements(pageSelect.value);
};

/**
 * @param {EditMode} type
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {(() => void) | null} onRemove
 * @param {(() => void) | null} onClick
 */
const createDrawingElement = (type, x, y, width, height, onRemove = null, onClick = null) => {
  const el = /** @type {HTMLDivElement} */(DRAWING_ELEMENT_TEMPLATES[type].cloneNode(true));
  el.classList.add(DRAWING_ELEMENT_CLASSES[type]);
  setElPosition(el, x, y, width, height);
  
  el.addEventListener('mousedown', ev => {
    ev.preventDefault();
  });

  if (onRemove) {
    /** @type {HTMLDivElement} */(el.querySelector('.remove')).addEventListener('click', ev => {
      if (ev.defaultPrevented || ev.button != 0)
        return;

      ev.preventDefault();
      onRemove();
    });
  }

  if (onClick) {
    el.addEventListener('click', ev => {
      if (ev.defaultPrevented || ev.button != 0)
        return;

      ev.preventDefault();
      onClick();
    });
  }
  
  page.appendChild(el);

  return el;
};

const setElPosition = (el, x, y, width, height) => {
  el.style.setProperty('--left', String(x));
  el.style.setProperty('--top', String(y));
  el.style.setProperty('--width', String(width));
  el.style.setProperty('--height', String(height));
}

const updateCurrentDrawingElPosition = (place = false) => {
  if (!currentDrawingElement)
    return;

  let x = currentDrawingElement.start.clientX - currentPan.x;
  let y = currentDrawingElement.start.clientY - currentPan.y;
  let w = currentDrawingElement.end.clientX - currentDrawingElement.start.clientX;
  let h = currentDrawingElement.end.clientY - currentDrawingElement.start.clientY;

  if (w < 0) {
    x += w;
    w = -w;
  }

  if (h < 0) {
    y += h;
    h = -h;
  }

  setElPosition(currentDrawingElement.el, x, y, w, h);

  if (place && w + h > 16 && w > 4 && h > 4)
    addNewElement(currentEditMode, x, y, w, h);
};

page.addEventListener('mousedown', ev => {
  if (ev.defaultPrevented || ev.button != 0 || !Object.hasOwn(DRAWING_ELEMENT_TEMPLATES, currentEditMode))
    return;
  
  ev.preventDefault();

  currentDrawingElement = {
    lastPos: { clientX: ev.clientX, clientY: ev.clientY},
    start: { clientX: ev.clientX, clientY: ev.clientY },
    end: { clientX: ev.clientX, clientY: ev.clientY },
    el: createDrawingElement(currentEditMode, 0, 0, 0, 0),
  };

  updateCurrentDrawingElPosition();
});

window.addEventListener('mousemove', ev => {
  if (ev.defaultPrevented || ev.button != 0 || !currentDrawingElement)
    return;

  ev.preventDefault();

  currentDrawingElement.end.clientX += ev.clientX - currentDrawingElement.lastPos.clientX;
  currentDrawingElement.end.clientY += ev.clientY - currentDrawingElement.lastPos.clientY;
  updateCurrentDrawingElPosition();

  currentDrawingElement.lastPos = { clientX: ev.clientX, clientY: ev.clientY };
});

window.addEventListener('mouseup', ev => {
  if (ev.defaultPrevented || ev.button != 0 || !currentDrawingElement)
    return;

  ev.preventDefault();

  currentDrawingElement.end.clientX += ev.clientX - currentDrawingElement.lastPos.clientX;
  currentDrawingElement.end.clientY += ev.clientY - currentDrawingElement.lastPos.clientY;

  updateCurrentDrawingElPosition(true);

  currentDrawingElement.el.remove();

  currentDrawingElement = null;
});

for (const el of Object.values(DRAWING_ELEMENT_TEMPLATES))
  el.remove();

//#endregion

//#region View mode (page panning)

/** @type {{ clientX: number, clientY: number } | null} */
let panningLastPos = null;

let currentPan = { x: 0, y: 0 };

const panBy = (x, y) => {
  currentPan.x += x;
  currentPan.y += y;

  page.style.setProperty('--left', String(currentPan.x));
  page.style.setProperty('--top', String(currentPan.y));

  localStorage.setItem('tunic_manual_translation.pan_x', String(currentPan.x));
  localStorage.setItem('tunic_manual_translation.pan_y', String(currentPan.y));
};

page.addEventListener('mousedown', ev => {
  if (ev.defaultPrevented || ev.button != 0 || currentEditMode != 'VIEW')
    return;
  
  ev.preventDefault();

  panningLastPos = { clientX: ev.clientX, clientY: ev.clientY };
});

window.addEventListener('mousemove', ev => {
  if (ev.defaultPrevented || ev.button != 0 || !panningLastPos)
    return;

  ev.preventDefault();
  panBy(ev.clientX - panningLastPos.clientX, ev.clientY - panningLastPos.clientY);
  panningLastPos = { clientX: ev.clientX, clientY: ev.clientY };
});

window.addEventListener('mouseup', ev => {
  if (ev.defaultPrevented || ev.button != 0 || !panningLastPos)
    return;

  ev.preventDefault();
  panBy(ev.clientX - panningLastPos.clientX, ev.clientY - panningLastPos.clientY);
  panningLastPos = null;
});

currentPan.x = Number(localStorage.getItem('tunic_manual_translation.pan_x')) || 0;
currentPan.y = Number(localStorage.getItem('tunic_manual_translation.pan_y')) || 0;
panBy(0, 0);

//#endregion

//#region Database

/** @typedef {string} GUID */

/** @typedef {{ x: number, y: number, w: number, h: number }} WordData */

/** @typedef {{ x: number, y: number, w: number, h: number }} SymbolData */

/** @typedef {{ x: number, y: number, w: number, h: number, ref?: string }} LinkData */

/** @typedef {{ words?: Record<GUID, WordData>, symbols?: Record<GUID, SymbolData>, links?: Record<GUID, LinkData> }} PageData */

/** @typedef {{ pages?: Record<string, PageData> }} Database */

/** @type {Database} */
let data = {};

/** @type {Record<GUID, HTMLDivElement>} */
let currentPageElements = {};

const uuidv4 = () => self.crypto.randomUUID();

const loadPageElements = (pageId) => {
  for (const id in currentPageElements)
    currentPageElements[id].remove();

  if (!data.pages)
    return;

  /** @type {PageData} */
  const pageData = Object.hasOwn(data.pages, pageId) ? data.pages[pageId] : {};
  
  const pageWords = pageData.words;
  for (const id in pageWords) {
    const data = pageWords[id];
    const el = createDrawingElement('WORD', data.x, data.y, data.w, data.h, () => {
      // When removed...
      delete currentPageElements[id];
      delete pageWords[id];
      saveUpdatedData();
      el.remove();
    }, () => {
      // When clicked...
      // TODO
      console.log("clicked word", id);
    });
    
    currentPageElements[id] = el;
  }

  const pageSymbols = pageData.symbols;
  for (const id in pageSymbols) {
    const data = pageSymbols[id];
    const el = createDrawingElement('SYMBOL', data.x, data.y, data.w, data.h, () => {
      // When removed...
      delete currentPageElements[id];
      delete pageSymbols[id];
      saveUpdatedData();
      el.remove();
    }, () => {
      // When clicked...
      // TODO
      console.log("clicked symbol", id);
    });

    currentPageElements[id] = el;
  }

  const pageLinks = pageData.links;
  for (const id in pageLinks) {
    const data = pageLinks[id];
    const el = createDrawingElement('LINK', data.x, data.y, data.w, data.h, () => {
      // When removed...
      delete currentPageElements[id];
      delete pageLinks[id];
      saveUpdatedData();
      el.remove();
    }, () => {
      // When clicked...
      // TODO
      console.log("clicked link", id);
    });

    currentPageElements[id] = el;
  }
};

const saveUpdatedData = () => {
  localStorage.setItem('tunic_manual_translation.data', JSON.stringify(data));
  console.debug("Updated data:", JSON.stringify(data));
};

data = /** @type {Database | null}*/(JSON.parse(localStorage.getItem('tunic_manual_translation.data') || 'null')) ?? data;

//#endregion

//#region Keyboard shortcuts

window.addEventListener('keyup', ev => {
  console.log(ev.key);
  switch (ev.key) {
    case 'ArrowLeft':
      goToPrevPage();
      break;

    case 'ArrowRight':
      goToNextPage();
      break;

    case 'i':
    case 'I':
      goToPage(TOC_PAGE_ID);
      break;

    case 'v':
    case 'V':
      setEditMode('VIEW');
      break;

    case 'w':
    case 'W':
      setEditMode('WORD');
      break;

    case 's':
    case 'S':
      setEditMode('SYMBOL');
      break;

    case 'l':
    case 'L':
      setEditMode('LINK');
      break;
  }
});

//#endregion

goToPage(pageSelect.value);
