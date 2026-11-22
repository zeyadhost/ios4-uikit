import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const [url = 'http://localhost:8080/', screenshotDir] = process.argv.slice(2);
const browserEndpoint = process.env.CHROME_CDP || 'http://127.0.0.1:9222';
const tab = await (await fetch(`${browserEndpoint}/json/new?about:blank`, { method: 'PUT' })).json();
const socket = new WebSocket(tab.webSocketDebuggerUrl);
const pending = new Map();
const failures = [];
let id = 0;
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') failures.push(message.params.exceptionDetails.text);
  if (message.id) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
});
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});
function send(method, params = {}) {
  const key = ++id;
  return new Promise((resolve, reject) => {
    pending.set(key, { resolve, reject });
    socket.send(JSON.stringify({ id: key, method, params }));
  });
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert.equal(response.exceptionDetails, undefined, response.result.description);
  return response.result.value;
}
async function key(name) {
  const params = { key: name, code: name, windowsVirtualKeyCode: { ArrowDown: 40, Escape: 27 }[name] };
  await send('Input.dispatchKeyEvent', { type: 'keyDown', ...params });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', ...params });
}
async function capture(name, scroll) {
  if (!screenshotDir) return;
  if (scroll) await evaluate(scroll);
  await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  await writeFile(join(screenshotDir, `${name}.png`), Buffer.from(data, 'base64'));
}
async function viewport(width, height) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
}

try {
  await send('Runtime.enable');
  await send('Page.enable');
  await viewport(1280, 960);
  await send('Page.navigate', { url });
  for (let i = 0; i < 50; i++) {
    if (await evaluate("Boolean(document.querySelector('.key-row'))")) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(await evaluate("document.querySelectorAll('.collection').length"), 4);
  assert.equal(await evaluate("document.querySelectorAll('.card').length"), 31);
  assert.equal(await evaluate("document.querySelector('.switch').getAttribute('aria-checked')"), 'false');
  await capture('01-overview');
  const [x, y] = await evaluate("(() => { const r = document.querySelector('.switch').getBoundingClientRect(); return [r.left + 15, r.top + 12]; })()");
  async function dragSwitch(path) {
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', buttons: 1, x, y, clickCount: 1 });
    for (const distance of path) {
      await send('Input.dispatchMouseEvent', { type: 'mouseMoved', button: 'left', buttons: 1, x: x + distance, y });
    }
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', x: x + path.at(-1), y, clickCount: 1 });
  }
  await dragSwitch([65, 10]);
  assert.equal(await evaluate("document.querySelector('.switch').getAttribute('aria-checked')"), 'false');
  await dragSwitch([65]);
  assert.equal(await evaluate("document.querySelector('.switch').getAttribute('aria-checked')"), 'true');
  await dragSwitch([-65, 0]);
  assert.equal(await evaluate("document.querySelector('.switch').getAttribute('aria-checked')"), 'true');
  assert.equal(await evaluate(`(() => {
    const slider = document.querySelector('.slider');
    slider.value = 74;
    slider.dispatchEvent(new Event('input'));
    return document.querySelector('output').value;
  })()`), '74%');
  assert.equal(await evaluate(`(() => {
    document.querySelector('.segments button:nth-child(2)').click();
    document.querySelector('.dots button:nth-child(3)').click();
    return document.querySelector('.page-sheet').textContent;
  })()`), '3');
  assert.equal(await evaluate("document.querySelector('.segments button:nth-child(2)').getAttribute('aria-pressed')"), 'true');
  assert.equal(await evaluate("document.querySelectorAll('.item-example').length + document.querySelectorAll('.space-example').length"), 28);
  assert.equal(await evaluate(`(() => {
    document.querySelector('.search .segments button:nth-child(2)').click();
    return Array.from(document.querySelectorAll('.search li:not([hidden])'), li => li.textContent).join(', ');
  })()`), 'Ada Lovelace, Alan Turing');
  assert.equal(await evaluate(`(() => {
    document.querySelector('.edit-delete').click();
    document.querySelector('.confirm-delete').click();
    document.querySelector('.edit-insert').click();
    return document.querySelectorAll('.editable li').length;
  })()`), 2);
  await capture('02-bars-lists', "document.querySelector('#bars').scrollIntoView()");
  assert.equal(await evaluate(`(() => {
    document.querySelector('[data-key="⇧"]').click();
    document.querySelector('[data-key="a"]').click();
    document.querySelector('[data-key="123"]').click();
    document.querySelector('[data-key="2"]').click();
    return document.querySelector('.keyboard-demo input').value;
  })()`), 'A2');
  assert.deepEqual(await evaluate(`(() => {
    const field = document.querySelector('.keyboard-demo input');
    field.value = 'A😀2';
    field.setSelectionRange(3, 3);
    document.querySelector('[data-key="⌫"]').click();
    return [field.value, field.selectionStart];
  })()`), ['A2', 1]);
  await evaluate(`document.querySelector('[data-key="ABC"]').click(); document.querySelector('[data-menu]').click()`);
  assert.equal(await evaluate("document.querySelector('.callout').hidden"), false);
  await capture('03-text-pickers', "document.querySelector('#input').scrollIntoView()");
  assert.deepEqual(await evaluate(`(() => {
    const field = document.querySelector('.text-view');
    const paste = [...document.querySelectorAll('.callout button')].find(button => button.textContent === 'Paste');
    field.setSelectionRange(0, 6);
    paste.click();
    return [field.value, field.selectionStart, field.selectionEnd];
  })()`), ['Select a word to edit it.', 0, 6]);
  await evaluate("document.querySelector('.dropdown-trigger').click(); document.querySelector('.dropdown-demo .wheel').focus()");
  await key('ArrowDown');
  assert.equal(await evaluate("document.querySelector('.dropdown-demo [aria-selected=true]').textContent"), 'London');
  await evaluate("document.querySelector('.dropdown-demo [data-close]').click()");
  assert.equal(await evaluate("document.querySelector('.dropdown-trigger').textContent"), 'London');
  await evaluate("document.querySelector('.alert').previousElementSibling.click()");
  assert.equal(await evaluate("document.querySelector('.alert').open"), true);
  await evaluate("Promise.all(document.querySelector('.alert').getAnimations().map(animation => animation.finished))");
  await capture('04-alert', "document.querySelector('#presentation').scrollIntoView()");
  await key('Escape');
  assert.equal(await evaluate("document.querySelector('.alert').open"), false);
  assert.equal(await evaluate(`(() => {
    document.querySelector('[data-popover]').click();
    return document.querySelector('.popover').hidden;
  })()`), true);
  await viewport(375, 820);
  assert.equal(await evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth && innerWidth === 375'), true);
  await capture('05-mobile', `window.scrollTo(0, 0); document.querySelector('.switch').click()`);
  assert.deepEqual(failures, []);
  console.log('PASS: 31 cards, desktop and 375px mobile; switch drag, slider, segments, pages, search, table editing, keyboard, edit menu, picker, alert and popover.');
} finally {
  socket.close();
  await fetch(`${browserEndpoint}/json/close/${tab.id}`);
}
