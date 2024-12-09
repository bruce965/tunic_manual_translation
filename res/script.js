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

const propsWord = /** @type {HTMLDivElement} */(document.getElementById('props_word'));
const propsSymbol = /** @type {HTMLDivElement} */(document.getElementById('props_symbol'));
const propsLink = /** @type {HTMLDivElement} */(document.getElementById('props_link'));

const wordSymbols = /** @type {SVGElement} */(/** @type {unknown} */(document.querySelector('.word-symbols')));
const wordSymbolTemplate = /** @type {SVGSVGElement} */(wordSymbols.querySelector('svg'));
const wordMeaningInput = /** @type {HTMLInputElement} */(document.getElementById('word_meaning'));
const wordNotesTextarea = /** @type {HTMLTextAreaElement} */(document.getElementById('word_notes'));
const wordSuffixMeaningInput = /** @type {HTMLInputElement} */(document.getElementById('word_suffix_meaning'));
const wordSuffixLengthInput = /** @type {HTMLInputElement} */(document.getElementById('word_suffix_length'));

const symbolOuterTopLeftPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('outer_top_left')));
const symbolOuterTopRightPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('outer_top_right')));
const symbolOuterLeftPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('outer_left')));
const symbolOuterBottomLeftPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('outer_bottom_left')));
const symbolOuterBottomRightPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('outer_bottom_right')));
const symbolInnerTopLeftPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('inner_top_left')));
const symbolInnerTopMiddlePath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('inner_top_middle')));
const symbolInnerTopRightPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('inner_top_right')));
const symbolInnerBottomLeftPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('inner_bottom_left')));
const symbolInnerBottomMiddlePath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('inner_bottom_middle')));
const symbolInnerBottomRightPath = /** @type {SVGPathElement} */(/** @type {unknown} */(document.getElementById('inner_bottom_right')));
const symbolCirclePath = /** @type {SVGCircleElement} */(/** @type {unknown} */(document.getElementById('circle')));
const symbolPreview = /** @type {HTMLDivElement} */(document.getElementById('symbol_preview'));

const linksRefSelect = /** @type {HTMLSelectElement} */(document.getElementById('link_ref_select'));
const linksRefSelectOptionTemplate = /** @type {HTMLOptionElement} */(linksRefSelect.querySelector('option'));

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
  "pg19": { src: "res/manual/page19-20.png", label: "19-20" },
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

  hideProps();
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

  showProps(type, id);
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

/** @typedef {{ x: number, y: number, w: number, h: number, suf?: number }} WordData */

/** @typedef {{ x: number, y: number, w: number, h: number, v?: number }} SymbolData */

/** @typedef {{ x: number, y: number, w: number, h: number, ref?: string }} LinkData */

/** @typedef {{ tran?: string, note?: string }} DictionaryData */

/** @typedef {{ words?: Record<GUID, WordData>, symbols?: Record<GUID, SymbolData>, links?: Record<GUID, LinkData> }} PageData */

/** @typedef {{ pages?: Record<string, PageData>, dictionary?: Record<string, DictionaryData> }} Database */

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
    const word = pageWords[id];
    const el = createDrawingElement('WORD', word.x, word.y, word.w, word.h, () => {
      // When removed...
      delete currentPageElements[id];
      delete pageWords[id];
      saveUpdatedData();
      el.remove();
      hideProps();
    }, () => {
      // When clicked...
      showProps('WORD', id);
    });

    const dictionary = data.dictionary ?? {};
    if (dictionary) {
      const wordSymbols = getWordSymbols(pageId, word);
      const suffixLength = Math.max(0, word.suf ?? 0);
      const wordId = getDictionaryId(wordSymbols.slice(0, wordSymbols.length - suffixLength));
      const suffixId = getDictionaryId(wordSymbols.slice(-suffixLength), true);
      const dictionaryWord = dictionary[wordId];
      const dictionarySuffix = dictionary[suffixId];

      /** @type {HTMLDivElement} */(el.querySelector('.word-meaning')).textContent = (dictionaryWord?.tran ?? '') + (dictionarySuffix?.tran ?? '');
    }

    currentPageElements[id] = el;
  }

  const pageSymbols = pageData.symbols;
  for (const id in pageSymbols) {
    const symbol = pageSymbols[id];
    const el = createDrawingElement('SYMBOL', symbol.x, symbol.y, symbol.w, symbol.h, () => {
      // When removed...
      delete currentPageElements[id];
      delete pageSymbols[id];
      saveUpdatedData();
      el.remove();
      hideProps();
    }, () => {
      // When clicked...
      showProps('SYMBOL', id);
    });

    if (!symbol.v)
      el.classList.add('empty');

    currentPageElements[id] = el;
  }

  const pageLinks = pageData.links;
  for (const id in pageLinks) {
    const link = pageLinks[id];
    const el = createDrawingElement('LINK', link.x, link.y, link.w, link.h, () => {
      // When removed...
      delete currentPageElements[id];
      delete pageLinks[id];
      saveUpdatedData();
      el.remove();
      hideProps();
    }, () => {
      // When clicked...
      if (currentEditMode == 'VIEW') {
        goToPage(link.ref ?? TOC_PAGE_ID);
      }
      else {
        showProps('LINK', id);
      }
    });

    currentPageElements[id] = el;
  }
};

const sortRecursive = (obj) => {
  if (typeof obj == 'object') {
    const sortedKeys = Object.keys(obj).sort();
    const copy = { ...obj };

    for (const k in obj)
      delete obj[k];

    for (const k of sortedKeys)
      obj[k] = copy[k];

    for (const k of sortedKeys)
      sortRecursive();
  }
};

const saveUpdatedData = () => {
  sortRecursive(data);

  localStorage.setItem('tunic_manual_translation.data', JSON.stringify(data));
  console.debug("Updated data:", JSON.stringify(data, null, "  "));
};

data = /** @type {Database | null}*/(JSON.parse(localStorage.getItem('tunic_manual_translation.data') || 'null')) ?? data;

//#endregion

//#region UI (props)

/** @type {Partial<Record<EditMode, HTMLDivElement>>} */
const PROPS_ELEMENTS = {
  'WORD': propsWord,
  'SYMBOL': propsSymbol,
  'LINK': propsLink,
};

/** @type {EditMode | null} */
let currentlyVisibleProps = null;

/** @type {GUID | null} */
let currentlyVisiblePropsId = null;

/**
 * @param {EditMode} element
 * @param {GUID} id
 */
const showProps = (element, id) => {
  hideProps();

  PROPS_ELEMENTS[element]?.classList.remove('hidden');
  currentlyVisibleProps = element;
  currentlyVisiblePropsId = id;

  const page = data.pages ??= {};
  const currentPage = page[pageSelect.value] ??= {};
  const pageWords = currentPage.words ??= {};
  const pageSymbols = currentPage.symbols ??= {};
  const pageLinks = currentPage.links ??= {};

  if (currentlyVisibleProps == 'WORD') {
    const word = pageWords[id];
    if (word)
      loadWord(pageSelect.value, word);
  }
  else if (currentlyVisibleProps == 'SYMBOL') {
    const symbol = pageSymbols[id];
    if (symbol)
      loadSymbol(symbol);
  }
  else if (currentlyVisibleProps == 'LINK') {
    linksRefSelect.value = pageLinks[id]?.ref ?? TOC_PAGE_ID;
  }
};

const hideProps = () => {
  if (currentlyVisibleProps)
    PROPS_ELEMENTS[currentlyVisibleProps]?.classList.add('hidden');

  currentlyVisibleProps = null;
  currentlyVisiblePropsId = null;
};

// Words

/** @type {{ word: WordData, symbols: number[] } | null} */
let lastSelectedWord = null;

/**
 * @param {string} pageId
 * @param {SymbolData} word
 */
const getWordSymbols = (pageId, word) => {
  const page = data.pages ??= {};
  const currentPage = page[pageId] ??= {};
  const pageSymbols = currentPage.symbols ??= {};

  /** @type {{ x: number, v: number }[]} */
  const wordSymbols = [];

  for (const id in pageSymbols) {
    const symbol = pageSymbols[id];

    const symbolArea = symbol.w * symbol.h;
    const overlappingArea = Math.max(0, Math.min(word.x + word.w, symbol.x + symbol.w) - Math.max(word.x, symbol.x)) * Math.max(0, Math.min(word.y + word.h, symbol.y + symbol.h) - Math.max(word.y, symbol.y));

    if (overlappingArea * 2 > symbolArea)
      wordSymbols.push({ x: symbol.x, v: symbol.v ?? 0 });
  }

  // TODO: handle upside-down words (add a checkbox on the word rectangle), sorting symbols from right to left.
  wordSymbols.sort((a, b) => a.x - b.x);

  return wordSymbols.map(s => s.v);
};

/** @param {number[]} wordSymbols */
const getDictionaryId = (wordSymbols, suffix = false) => {
  return (suffix ? '-' : '') + wordSymbols.map(v => v.toString(36)).join('-');
};

/** @param {number} symbol */
const getSymbolMaskForCss = (symbol) => {
  let result = '';
  for (let c = 'a'.charCodeAt(0); symbol; c++, symbol >>= 1) {
    if (symbol & 1)
      result += String.fromCharCode(c);
  }

  return result;
};

/**
 * @param {string} pageId
 * @param {SymbolData} word
 */
const loadWord = (pageId, word) => {
  lastSelectedWord = { word, symbols: getWordSymbols(pageId, word) };
  refreshWord();
};

const refreshWord = () => {
  if (!lastSelectedWord)
    return;

  const suffixLength = Math.max(0, lastSelectedWord.word.suf ?? 0);
  const wordId = getDictionaryId(lastSelectedWord.symbols.slice(0, lastSelectedWord.symbols.length - suffixLength));
  const suffixId = getDictionaryId(lastSelectedWord.symbols.slice(-suffixLength), true);

  while (wordSymbols.firstChild)
    wordSymbols.firstChild.remove();

  for (let i = 0; i < lastSelectedWord.symbols.length; i++) {
    const symbol = lastSelectedWord.symbols[i];
    const symbolMask = getSymbolMaskForCss(symbol);
    const el = /** @type {SVGSVGElement} */(wordSymbolTemplate.cloneNode(true));
    el.setAttribute('data-symbol', symbolMask);
    el.classList.toggle('suffix', lastSelectedWord.symbols.length - i <= suffixLength);
    wordSymbols.appendChild(el);
  }

  const dictionary = data.dictionary ??= {};
  const currentWord = dictionary[wordId] ??= {};
  const currentSuffix = dictionary[suffixId] ??= {};

  wordMeaningInput.value = currentWord.tran ?? '';
  wordNotesTextarea.value = currentWord.note ?? '';
  wordSuffixMeaningInput.value = suffixLength == 0 ? "-" : (currentSuffix.tran ?? '');
  wordSuffixMeaningInput.disabled = suffixLength == 0;
  wordSuffixLengthInput.value = String(suffixLength);
};

wordSymbolTemplate.remove();

wordMeaningInput.addEventListener('keyup', ev => {
  if (!lastSelectedWord)
    return;

  const suffixLength = lastSelectedWord.word.suf ?? 0;
  const wordId = getDictionaryId(lastSelectedWord.symbols.slice(0, lastSelectedWord.symbols.length - suffixLength));

  const dictionary = data.dictionary ??= {};
  const currentWord = dictionary[wordId] ??= {};

  if (currentWord.tran != wordMeaningInput.value) {
    currentWord.tran = wordMeaningInput.value;
    saveUpdatedData();
  }
});

wordSuffixLengthInput.addEventListener('change', ev => {
  if (!lastSelectedWord)
    return;

  const suffixLength = Number(wordSuffixLengthInput.value) || 0;
  lastSelectedWord.word.suf = suffixLength;
  saveUpdatedData();

  refreshWord();
});

wordSuffixMeaningInput.addEventListener('keyup', ev => {
  if (!lastSelectedWord)
    return;

  const suffixLength = lastSelectedWord.word.suf ?? 0;
  const suffixId = getDictionaryId(lastSelectedWord.symbols.slice(-suffixLength), true);

  const dictionary = data.dictionary ??= {};
  const currentSuffix = dictionary[suffixId] ??= {};

  if (currentSuffix.tran != wordSuffixMeaningInput.value) {
    currentSuffix.tran = wordSuffixMeaningInput.value;
    saveUpdatedData();
  }
});

wordNotesTextarea.addEventListener('keyup', ev => {
  if (!lastSelectedWord)
    return;

  const suffixLength = lastSelectedWord.word.suf ?? 0;
  const wordId = getDictionaryId(lastSelectedWord.symbols.slice(0, lastSelectedWord.symbols.length - suffixLength));

  const dictionary = data.dictionary ??= {};
  const currentWord = dictionary[wordId] ??= {};

  if (currentWord.note != wordNotesTextarea.value) {
    currentWord.note = wordNotesTextarea.value;
    saveUpdatedData();
  }
});

// Symbols
const SYMBOL_PATHS = [
  symbolOuterTopLeftPath,
  symbolOuterTopRightPath,
  symbolOuterLeftPath,
  symbolOuterBottomLeftPath,
  symbolOuterBottomRightPath,
  symbolInnerTopLeftPath,
  symbolInnerTopMiddlePath,
  symbolInnerTopRightPath,
  symbolInnerBottomLeftPath,
  symbolInnerBottomMiddlePath,
  symbolInnerBottomRightPath,
  symbolCirclePath,
];

/** @param {SymbolData} symbol */
const loadSymbol = (symbol) => {
  for (let i = 0; i < SYMBOL_PATHS.length; i++)
    SYMBOL_PATHS[i].classList.toggle('active', Boolean(((symbol.v ?? 0) >> i) & 1));

  symbolPreview.style.backgroundImage = `url('${PAGES[pageSelect.value].src.replaceAll('\\', '\\\\').replaceAll('\'', '\'\'')}')`;
  symbolPreview.style.backgroundPositionX = `${-symbol.x}px`;
  symbolPreview.style.backgroundPositionY = `${-symbol.y}px`;
};

for (let i = 0; i < SYMBOL_PATHS.length; i++) {
  const index = i;
  const toggle = () => {
    if (!currentlyVisiblePropsId)
      return;

    const page = data.pages ??= {};
    const currentPage = page[pageSelect.value] ??= {};
    const pageSymbols = currentPage.symbols ??= {};
    const symbol = pageSymbols[currentlyVisiblePropsId];

    if (!symbol)
      return;

    symbol.v = (symbol.v ?? 0) ^ (1 << index);
    saveUpdatedData();

    SYMBOL_PATHS[index].classList.toggle('active', Boolean((symbol.v >> index) & 1));
  };

  SYMBOL_PATHS[i].addEventListener('mouseenter', ev => {
    if (ev.defaultPrevented || ev.buttons != 1)
      return;

    ev.preventDefault();

    toggle();
  });

  SYMBOL_PATHS[i].addEventListener('click', ev => {
    if (ev.defaultPrevented || ev.button != 0)
      return;
    
    ev.preventDefault();

    toggle();
  });
}

// Links
for (const id in PAGES) {
  const opt = /** @type {HTMLOptionElement} */(linksRefSelectOptionTemplate.cloneNode(true));
  opt.value = id;
  opt.textContent = PAGES[id].label;

  linksRefSelectOptionTemplate.parentElement?.insertBefore(opt, linksRefSelectOptionTemplate);
}
linksRefSelectOptionTemplate.remove();

linksRefSelect.addEventListener('change', ev => {
  if (!currentlyVisiblePropsId)
    return;

  ev.preventDefault();

  const page = data.pages ??= {};
  const currentPage = page[pageSelect.value] ??= {};
  const pageLinks = currentPage.links ??= {};
  const link = pageLinks[currentlyVisiblePropsId];

  if (!link)
    return;

  link.ref = linksRefSelect.value;
  saveUpdatedData();
});

//#endregion

//#region Keyboard shortcuts

const FOCUS_WHITELIST = ['INPUT', 'TEXTAREA', 'SELECT'];

window.addEventListener('keyup', ev => {
  if (FOCUS_WHITELIST.includes(document.activeElement?.tagName ?? ''))
    return;

  console.debug(ev.key);

  switch (ev.key) {
    case 'Escape':
      ev.preventDefault();
      hideProps();
      break;

    case 'ArrowLeft':
      ev.preventDefault();
      goToPrevPage();
      break;

    case 'ArrowRight':
      ev.preventDefault();
      goToNextPage();
      break;

    case 'i':
    case 'I':
      ev.preventDefault();
      goToPage(TOC_PAGE_ID);
      break;

    case 'v':
    case 'V':
      ev.preventDefault();
      setEditMode('VIEW');
      break;

    case 'w':
    case 'W':
      ev.preventDefault();
      setEditMode('WORD');
      break;

    case 's':
    case 'S':
      ev.preventDefault();
      setEditMode('SYMBOL');
      break;

    case 'l':
    case 'L':
      ev.preventDefault();
      setEditMode('LINK');
      break;
  }
});

//#endregion

goToPage(pageSelect.value);
setEditMode(currentEditMode);

if (Object.keys(data).length == 0) {
  (async () => {
    const response = await fetch("res/data.json");
    const exampleData = await response.json();

    data = exampleData;
    goToPage(pageSelect.value);
  })();
}
