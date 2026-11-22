import { sections } from './specimens.js';

const catalog = document.querySelector('#catalog');
const index = document.querySelector('#index');
const notice = document.querySelector('#notice');
let noticeTimer;

function announce(message) {
  clearTimeout(noticeTimer);
  notice.textContent = message;
  noticeTimer = setTimeout(() => { notice.textContent = ''; }, 2000);
}

index.innerHTML = sections.map(({ id, title }, i) => `<a href="#${id}"><span>0${i + 1}</span> ${title}</a>`).join('');
catalog.innerHTML = sections.map(({ id, title, cards }, i) => `
  <section class="collection" id="${id}" aria-labelledby="${id}-title">
    <header class="section-head"><span>0${i + 1} /</span><h2 id="${id}-title">${title}</h2></header>
    <div class="cards">${cards.map(([name, preview, wide]) => `
      <article class="card ${wide ? 'wide' : ''}"><h3>${name}</h3><div class="stage">${preview}</div></article>
    `).join('')}</div>
  </section>`).join('');

document.querySelectorAll('.switch').forEach(control => {
  let startX;
  let startedOn;
  let moved;
  let pointer;
  const knob = control.querySelector('.knob');
  const isOn = () => control.getAttribute('aria-checked') === 'true';
  const setOn = on => control.setAttribute('aria-checked', String(on));
  function dragPosition(clientX) {
    const scale = control.getBoundingClientRect().width / 94;
    return Math.max(0, Math.min(54, (startedOn ? 54 : 0) + (clientX - startX) / scale));
  }

  control.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointer !== undefined) return;
    startX = event.clientX;
    startedOn = isOn();
    moved = false;
    pointer = event.pointerId;
    control.classList.add('dragging');
    control.setPointerCapture(pointer);
  });
  control.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 5) moved = true;
    if (moved) knob.style.transform = `translateX(${dragPosition(event.clientX)}px)`;
  });
  function finish(event, cancelled) {
    if (event.pointerId !== pointer) return;
    pointer = undefined;
    control.classList.remove('dragging');
    knob.style.transform = '';
    if (cancelled) setOn(startedOn);
    else if (!moved) setOn(!startedOn);
    else {
      const position = dragPosition(event.clientX);
      setOn(position === 27 ? startedOn : position > 27);
    }
  }
  control.addEventListener('pointerup', event => finish(event, false));
  control.addEventListener('pointercancel', event => finish(event, true));
  control.addEventListener('lostpointercapture', event => finish(event, true));
  control.addEventListener('click', event => {
    if (event.detail === 0) setOn(!isOn());
  });
});

document.querySelectorAll('.slider').forEach(slider => {
  function update() {
    slider.style.setProperty('--fill', `${slider.value}%`);
    slider.closest('.slider-wrap').querySelector('output').value = `${slider.value}%`;
  }
  slider.addEventListener('input', update);
  update();
});

document.querySelectorAll('[data-notify]').forEach(button => {
  button.addEventListener('click', () => announce(`${button.getAttribute('aria-label') || button.textContent.trim()} tapped`));
});

document.querySelectorAll('.segments, .tabs, .dots, .table, .split-list').forEach(group => {
  const items = Array.from(group.querySelectorAll('button[aria-pressed]'));
  items.forEach((button, i) => button.addEventListener('click', () => {
    if (group.classList.contains('momentary')) {
      announce(`${button.textContent} tapped`);
      return;
    }
    items.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const page = group.parentElement.querySelector('.page-sheet');
    if (page) page.textContent = i + 1;
    const note = group.parentElement.querySelector('.split-detail');
    if (note) note.textContent = ['Write a note.', 'Call the office.', 'Pick up the photos.'][i];
  }));
});

document.querySelectorAll('.search').forEach(search => {
  const field = search.querySelector('input');
  const scopes = search.querySelectorAll('.segments button');
  const records = search.querySelectorAll('li');
  function filter() {
    const query = field.value.trim().toLowerCase();
    const favorites = scopes[1].getAttribute('aria-pressed') === 'true';
    records.forEach(record => {
      record.hidden = !record.textContent.toLowerCase().includes(query) || (favorites && !record.hasAttribute('data-favorite'));
    });
  }
  field.addEventListener('input', filter);
  scopes.forEach(scope => scope.addEventListener('click', filter));
  search.querySelector('.search-cancel').addEventListener('click', () => {
    field.value = '';
    scopes[0].click();
  });
});

document.querySelectorAll('.editable').forEach(list => {
  list.addEventListener('click', event => {
    const control = event.target.closest('button');
    if (!control) return;
    if (control.matches('.edit-insert')) {
      control.closest('li').insertAdjacentHTML('beforebegin', '<li><button class="edit-delete" type="button" aria-label="Delete item">−</button><span>New Item</span></li>');
      return;
    }
    if (control.matches('.edit-delete')) {
      const line = control.closest('li');
      if (line.lastElementChild.matches('.confirm-delete')) {
        line.lastElementChild.remove();
      } else {
        line.insertAdjacentHTML('beforeend', '<button class="confirm-delete" type="button">Delete</button>');
      }
      return;
    }
    control.closest('li').remove();
    list.querySelector('.edit-insert').focus();
  });
});

document.querySelectorAll('.wheel').forEach((wheel, wheelIndex) => {
  const options = Array.from(wheel.children);
  let index = 0;
  options.forEach((option, i) => { option.id = `wheel-${wheelIndex}-${i}`; });
  function select(next, scroll = false) {
    index = Math.max(0, Math.min(options.length - 1, next));
    options.forEach((option, i) => option.setAttribute('aria-selected', String(i === index)));
    wheel.setAttribute('aria-activedescendant', options[index].id);
    if (scroll) wheel.scrollTop = index * options[0].offsetHeight;
  }
  wheel.addEventListener('scroll', () => {
    const height = options[0].offsetHeight;
    if (height) select(Math.round(wheel.scrollTop / height));
  }, { passive: true });
  wheel.addEventListener('click', event => {
    const item = event.target.closest('[role=option]');
    if (item) select(options.indexOf(item), true);
  });
  wheel.addEventListener('keydown', event => {
    const moves = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: options.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  });
  select(0);
});

document.querySelectorAll('.overlay').forEach((dialog, i) => {
  const trigger = dialog.previousElementSibling;
  const title = dialog.querySelector('h4');
  title.id = `dialog-title-${i}`;
  dialog.setAttribute('aria-labelledby', title.id);
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('click', event => {
    const control = event.target.closest('[data-close]');
    if (!control && event.target !== dialog) return;
    if (trigger.matches('.dropdown-trigger') && control?.textContent === 'Done') {
      trigger.textContent = dialog.querySelector('.wheel [aria-selected=true]').textContent;
    }
    dialog.close();
  });
});

document.querySelectorAll('[data-popover]').forEach(trigger => {
  const popover = trigger.nextElementSibling;
  popover.id = 'albums-popover';
  trigger.setAttribute('aria-controls', popover.id);
  trigger.addEventListener('click', () => {
    popover.hidden = !popover.hidden;
    trigger.setAttribute('aria-expanded', String(!popover.hidden));
  });
});

document.querySelectorAll('.spinner').forEach(spinner => {
  spinner.innerHTML = Array.from({ length: 12 }, (_, i) => `<i style="--spoke:${i}"></i>`).join('');
});

const textDemo = document.querySelector('.text-demo');
const textView = textDemo.querySelector('textarea');
const menu = textDemo.querySelector('.callout');
const menuTrigger = textDemo.querySelector('[data-menu]');
const loupe = textDemo.querySelector('.loupe');
const loupeTrigger = textDemo.querySelector('[data-loupe]');
let clipboard = '';
function showMenu(open) {
  menu.hidden = !open;
  menuTrigger.setAttribute('aria-expanded', String(open));
}
menu.id = 'edit-callout';
menuTrigger.setAttribute('aria-controls', menu.id);
showMenu(false);
menuTrigger.addEventListener('click', () => showMenu(menu.hidden));
textView.addEventListener('contextmenu', event => {
  event.preventDefault();
  showMenu(true);
});
menu.addEventListener('click', event => {
  if (!event.target.matches('button')) return;
  const action = event.target.textContent;
  const { selectionStart: start, selectionEnd: end, value } = textView;
  if (action === 'Cut' || action === 'Copy') clipboard = value.slice(start, end);
  if (action === 'Cut') textView.setRangeText('', start, end, 'end');
  if (action === 'Paste' && clipboard) textView.setRangeText(clipboard, start, end, 'end');
  if (action === 'Select All') textView.select();
  if (action === 'Select') {
    const left = value.slice(0, start).search(/\S+$/);
    const right = value.slice(start).search(/\s/);
    textView.setSelectionRange(left === -1 ? start : left, right === -1 ? value.length : start + right);
  }
  showMenu(false);
  textView.focus();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menu.hidden || !textDemo.contains(document.activeElement)) return;
  showMenu(false);
  menuTrigger.focus();
});
function showLoupe(open) {
  const position = textView.selectionEnd;
  loupe.replaceChildren(textView.value.slice(Math.max(0, position - 5), position), document.createElement('i'), textView.value.slice(position, position + 5));
  loupe.hidden = !open;
}
loupeTrigger.addEventListener('pointerdown', event => {
  loupeTrigger.setPointerCapture(event.pointerId);
  showLoupe(true);
});
['pointerup', 'pointercancel', 'lostpointercapture', 'keyup', 'blur'].forEach(type => {
  loupeTrigger.addEventListener(type, () => showLoupe(false));
});
loupeTrigger.addEventListener('keydown', event => {
  if (event.key === ' ' || event.key === 'Enter') showLoupe(true);
});

const keyboard = document.querySelector('.keyboard');
const keyboardField = document.querySelector('.keyboard-demo input');
let shifted = false;
let numeric = false;
const defaultKeys = ['qwertyuiop', 'asdfghjkl', ['⇧', ...'zxcvbnm', '⌫']];
const numericKeys = ['1234567890', ['-', '/', ':', ';', '(', ')', '$', '&', '@'], ['.', ',', '?', '!', "'", '⌫']];
const keyName = { '⇧': 'Shift', '⌫': 'Delete', space: 'Space', return: 'Return' };
function drawKeyboard(focusKey) {
  const rows = [...(numeric ? numericKeys : defaultKeys), [numeric ? 'ABC' : '123', 'space', 'return']];
  keyboard.replaceChildren(...rows.map(keys => {
    const row = document.createElement('div');
    row.className = 'key-row';
    for (const key of keys) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.key = key;
      button.textContent = shifted ? key.toUpperCase() : key;
      button.setAttribute('aria-label', keyName[key] || button.textContent);
      if (key === '⇧') button.setAttribute('aria-pressed', String(shifted));
      row.append(button);
    }
    return row;
  }));
  if (focusKey) keyboard.querySelector(`[data-key="${focusKey}"]`)?.focus();
}
keyboard.addEventListener('pointerdown', event => {
  if (event.target.matches('button')) event.preventDefault();
});
keyboard.addEventListener('click', event => {
  const key = event.target.dataset.key;
  if (!key) return;
  const viaKeyboard = event.detail === 0;
  if (key === '⇧') {
    shifted = !shifted;
    drawKeyboard(viaKeyboard ? key : undefined);
  } else if (key === '123' || key === 'ABC') {
    numeric = !numeric;
    shifted = false;
    drawKeyboard(viaKeyboard ? (numeric ? 'ABC' : '123') : undefined);
  } else if (key === 'return') {
    announce(keyboardField.value || 'Return tapped');
  } else {
    const start = keyboardField.selectionStart;
    const end = keyboardField.selectionEnd;
    if (key === '⌫') {
      const previousLength = keyboardField.value.codePointAt(start - 2) > 0xffff ? 2 : 1;
      const from = start === end ? Math.max(0, start - previousLength) : start;
      keyboardField.setRangeText('', from, end, 'end');
    } else {
      keyboardField.setRangeText(key === 'space' ? ' ' : shifted ? key.toUpperCase() : key, start, end, 'end');
    }
    if (shifted && key !== '⌫') {
      shifted = false;
      drawKeyboard(viaKeyboard ? key : undefined);
    }
  }
  if (!viaKeyboard) keyboardField.focus();
});
drawKeyboard();
