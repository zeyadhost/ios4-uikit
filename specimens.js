const labeled = (label, html) => `<div class="sample"><div class="sample-content">${html}</div><span class="sample-caption">${label}</span></div>`;
const samples = entries => `<div class="samples">${entries.map(([label, html]) => labeled(label, html)).join('')}</div>`;
const button = (text, attrs = '') => `<button type="button" ${attrs}>${text}</button>`;
const notify = text => button(text, 'class="bevel" data-notify');
const switchControl = (on = false) => `<button type="button" class="switch" role="switch" aria-label="Switch example" aria-checked="${on}"><span class="switch-word on">ON</span><span class="switch-word off">OFF</span><span class="knob"></span></button>`;
const segments = (style, labels) => `<div class="segments ${style}" role="group" aria-label="Segmented control">${labels.map((label, i) => button(label, `aria-pressed="${style !== 'momentary' && i === 0}"`)).join('')}</div>`;

const icons = {
  detail: '<circle cx="12" cy="12" r="9"/><path d="m10 7 5 5-5 5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  add: '<path d="M12 4v16M4 12h16"/>',
  action: '<path d="M8 9H4v11h16V9h-4M12 15V3M8 7l4-4 4 4"/>',
  compose: '<path d="M18 12v8H4V6h8m-2 8 1-4 8-8 3 3-8 8z"/>',
  bookmarks: '<path d="M12 6C8 3 5 3 2 5v14c4-2 7-1 10 1 3-2 6-3 10-1V5c-3-2-6-2-10 1v14"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  refresh: '<path d="M20 9a8 8 0 1 0 0 6m0-12v6h-6"/>',
  stop: '<path d="m5 5 14 14m0-14L5 19"/>',
  camera: '<path d="M3 7h5l2-3h4l2 3h5v13H3z"/><circle cx="12" cy="13" r="4"/>',
  trash: '<path d="M4 6h16M9 6V3h6v3M6 6l1 14h10l1-14m-8 3v7m4-7v7"/>',
  play: '<path d="m8 4 12 8-12 8z" fill="currentColor"/>',
  pause: '<path d="M8 5v14m8-14v14" stroke-width="4"/>',
  rewind: '<path d="m11 5-9 7 9 7zm10 0-9 7 9 7z" fill="currentColor"/>',
  fastforward: '<path d="m3 5 9 7-9 7zm10 0 9 7-9 7z" fill="currentColor"/>',
  undo: '<path d="M4 9h11a5 5 0 0 1 0 10h-4M9 4 4 9l5 5"/>',
  redo: '<path d="M20 9H9a5 5 0 0 0 0 10h4m2-15 5 5-5 5"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="currentColor"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v7h5"/>',
  contacts: '<circle cx="12" cy="7" r="4" fill="currentColor"/><path d="M3 21a9 8 0 0 1 18 0z" fill="currentColor"/>',
  downloads: '<path d="M12 3v12m-5-5 5 5 5-5M3 15v6h18v-6"/>',
  history: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l-4 2"/>',
  more: '<path d="M5 12h.1m6.9 0h.1m6.9 0h.1" stroke-width="4"/>',
  featured: '<path d="m12 3 2.6 5.4 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.9z"/>',
  topRated: '<path d="M5 20v-6m7 6V4m7 16V9" stroke-width="4"/>',
  mostRecent: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  mostViewed: '<path d="M2 12q10-15 20 0-10 15-20 0z"/><circle cx="12" cy="12" r="3"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const iconButton = (name, label, cls = '') => button(icon(name), `aria-label="${label}" class="${cls}" data-notify`);
const bar = (style = '', title = 'Library') => `<div class="bar ${style}">${button('Albums', 'class="bar-button back" data-notify')}<strong>${title}</strong>${button('Edit', 'class="bar-button" data-notify')}</div>`;
const toolbar = style => `<div class="bar toolbar ${style}">${iconButton('action', 'Action', 'bar-button borderless')}<span class="flex-space"></span>${iconButton('play', 'Play', 'bar-button borderless')}<span class="flex-space"></span>${iconButton('trash', 'Trash', 'bar-button borderless')}</div>`;
const barItems = ['Done', 'Cancel', 'Edit', 'Save', 'Add', 'Flexible Space', 'Fixed Space', 'Compose', 'Reply', 'Action', 'Organize', 'Bookmarks', 'Search', 'Refresh', 'Stop', 'Camera', 'Trash', 'Play', 'Pause', 'Rewind', 'Fast Forward', 'Undo', 'Redo', 'Page Curl'];
const itemIcons = {
  Add: 'add', Compose: 'compose', Reply: 'undo', Action: 'action', Organize: 'downloads', Bookmarks: 'bookmarks', Search: 'search', Refresh: 'refresh', Stop: 'stop', Camera: 'camera', Trash: 'trash', Play: 'play', Pause: 'pause', Rewind: 'rewind', 'Fast Forward': 'fastforward', Undo: 'undo', Redo: 'redo'
};
const barItem = name => {
  if (name.endsWith('Space')) {
    return `<div class="bar space-example"><span></span><span class="${name === 'Fixed Space' ? 'fixed-space' : 'flex-space'}"></span><span></span></div>`;
  }
  const className = `bar-button${name === 'Done' ? ' done' : ''}`;
  const attrs = `class="${className}" data-notify`;
  return `<div class="bar item-example">${itemIcons[name] ? iconButton(itemIcons[name], name, className) : button(name === 'Page Curl' ? '<span class="page-curl"></span>' : name, name === 'Page Curl' ? `${attrs} aria-label="Page Curl"` : attrs)}</div>`;
};

const tabNames = ['More', 'Favorites', 'Featured', 'Top Rated', 'Recents', 'Contacts', 'History', 'Bookmarks', 'Search', 'Downloads', 'Most Recent', 'Most Viewed'];
const tabIcons = ['more', 'star', 'featured', 'topRated', 'clock', 'contacts', 'history', 'bookmarks', 'search', 'downloads', 'mostRecent', 'mostViewed'];
const tab = (name, picture, i, badge = false) => button(`${icon(picture)}<span>${name}</span>${badge ? '<b class="badge" aria-label="2 new items">2</b>' : ''}`, `aria-pressed="${i === 0}"`);
const tabs = (start, end, badges = false) => `<div class="tabs" role="group" aria-label="Tab bar">${tabNames.slice(start, end).map((name, i) => tab(name, tabIcons[start + i], i, badges && i === 1)).join('')}</div>`;
const row = (title, subtitle = '', style = '', accessory = '') => `<li class="cell ${style}">${button(`<span class="cell-title">${title}</span>${subtitle ? `<span class="cell-detail">${subtitle}</span>` : ''}`, 'class="cell-main" aria-pressed="false"')}${accessory}</li>`;
const disclosure = '<span class="disclosure" aria-label="Disclosure indicator">›</span>';
const checkmark = '<span class="checkmark" aria-label="Checkmark">✓</span>';
const detail = iconButton('detail', 'Detail disclosure', 'accessory');
const table = (style, rows) => `<div class="table-frame ${style}"><ul class="table">${rows.join('')}</ul></div>`;

const pickerColumns = {
  Picker: [['Cupertino', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin'], ['09', '10', '11', '12', '13', '14']],
  Cities: [['Cupertino', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin']],
  Time: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], ['00', '15', '30', '45'], ['AM', 'PM']],
  Date: [['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], Array.from({length: 31}, (_, i) => `${i + 1}`), ['2008', '2009', '2010', '2011', '2012']],
  'Date and Time': [['Today', 'Tomorrow', 'Wed Nov 24', 'Thu Nov 25', 'Fri Nov 26', 'Sat Nov 27'], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], ['00', '15', '30', '45'], ['AM', 'PM']],
  'Count Down Timer': [['0 hours', '1 hour', '2 hours', '3 hours', '4 hours', '5 hours'], ['0 min', '5 min', '10 min', '15 min', '20 min', '25 min', '30 min']]
};
const picker = (mode, labels) => `<div class="picker" role="group" aria-label="${mode}">${pickerColumns[mode].map((values, i) => `<div class="wheel" tabindex="0" role="listbox" aria-label="${labels[i]}">${values.map((value, j) => `<div role="option" aria-selected="${j === 0}">${value}</div>`).join('')}</div>`).join('')}</div>`;
const dialog = (kind, content) => `<dialog class="overlay ${kind}"><div class="dialog-inner">${content}</div></dialog>`;
const modal = (kind, label, content) => `<div class="modal-example">${button(label, 'class="bevel" data-open')}${dialog(kind, content)}</div>`;
const title = text => `<h4>${text}</h4>`;
const close = (label, className = '') => button(label, `data-close class="${className}"`);
const keyboard = `<div class="keyboard" aria-label="On-screen keyboard"></div>`;
const status = style => `<div class="window-demo"><div class="status-bar ${style}"><span>▂▃▄▅ Carrier</span><b>9:41 AM</b><span>100% ▰</span></div><span>UIWindow</span></div>`;

export const sections = [
  {
    id: 'controls', title: 'Controls', cards: [
      ['UISwitch', samples([['Starts Off', switchControl()], ['Starts On', switchControl(true)]])],
      ['UISlider', `<div class="slider-wrap"><span class="volume" aria-hidden="true">−</span><input class="slider" type="range" min="0" max="100" value="42" aria-label="Volume"><span class="volume" aria-hidden="true">+</span><output>42%</output></div>`],
      ['UIButton', samples([
        ['Rounded Rect', button('Continue', 'class="action" data-notify')],
        ['Custom', button('Custom', 'class="bare" data-notify')],
        ['Detail Disclosure', iconButton('detail', 'Detail Disclosure', 'icon-control blue-icon')],
        ['Info Light', iconButton('info', 'Info Light', 'icon-control light-icon')],
        ['Info Dark', iconButton('info', 'Info Dark', 'icon-control dark-icon')],
        ['Contact Add', iconButton('add', 'Contact Add', 'icon-control blue-icon')]
      ])],
      ['UISegmentedControl', samples([
        ['Plain', segments('plain', ['List', 'Grid'])], ['Bordered', segments('bordered', ['Songs', 'Albums'])],
        ['Bar', segments('bar-style', ['All', 'Recent'])], ['Bezeled', segments('bezeled', ['Day', 'Week'])],
        ['Momentary', segments('momentary', ['−', '+'])]
      ])],
      ['UIPageControl', `<div class="page-demo"><div class="page-sheet">1</div><div class="dots" role="group" aria-label="Pages">${[1, 2, 3, 4, 5].map((i) => button('', `aria-label="Page ${i}" aria-pressed="${i === 1}"`)).join('')}</div></div>`],
      ['UIProgressView', samples([['Default', '<progress class="progress" value=".42" aria-label="Default progress"></progress>'], ['Bar', '<div class="bar bar-progress"><progress class="progress" value=".65" aria-label="Bar progress"></progress></div>']])],
      ['UIActivityIndicatorView', samples([['White', '<div class="spinner-dark"><span class="spinner white" role="img" aria-label="Loading"></span></div>'], ['White Large', '<div class="spinner-dark"><span class="spinner white large" role="img" aria-label="Loading"></span></div>'], ['Gray', '<span class="spinner" role="img" aria-label="Loading"></span>']])]
    ]
  },
  {
    id: 'bars', title: 'Bars & Lists', cards: [
      ['UINavigationBar', samples([['Default', bar()], ['Black Opaque', bar('black')], ['Black Translucent', bar('translucent')]])],
      ['UIToolbar', samples([['Default', toolbar('')], ['Black Opaque', toolbar('black')], ['Black Translucent', toolbar('translucent')]])],
      ['UITabBar / UITabBarItem', samples([['System items + badge', tabs(0, 4, true)], ['System items', tabs(4, 8)], ['System items', tabs(8, 12)], ['Custom item', `<div class="tabs">${tab('Library', 'bookmarks', 0)}</div>`]])],
      ['UISearchBar', samples([['Default + scope bar', `<div class="search"><div class="bar search-line"><label>${icon('search')}<input type="search" aria-label="Search contacts" placeholder="Search"></label>${button('Cancel', 'class="bar-button search-cancel"')}</div>${segments('bar-style', ['All', 'Favorites'])}<ul><li data-favorite>Ada Lovelace</li><li>Grace Hopper</li><li data-favorite>Alan Turing</li></ul></div>`], ['Black Opaque', `<div class="bar black search-line"><label>${icon('search')}<input type="search" aria-label="Search" placeholder="Search"></label></div>`], ['Black Translucent', `<div class="bar translucent search-line"><label>${icon('search')}<input type="search" aria-label="Search" placeholder="Search"></label></div>`]])],
      ['UIBarButtonItem', samples([['Plain', `<div class="bar item-example">${iconButton('action', 'Action', 'bar-button borderless')}</div>`], ['Bordered', barItem('Edit')], ['Done style', barItem('Done')], ['Custom view', `<div class="bar item-example">${button('Info', 'class="bar-button" data-notify')}</div>`], ...barItems.map(name => [name, barItem(name)])]), true],
      ['UITableView / UITableViewCell', samples([
        ['Plain', table('', ['<li class="table-heading">Favorites</li>', row('Airplane Mode', '', '', checkmark), row('Wi-Fi', '', '', disclosure), row('Bluetooth', '', '', detail)])],
        ['Grouped', table('grouped', [row('Sounds', '', '', disclosure), row('Brightness', '', '', disclosure), row('Wallpaper', '', '', disclosure)])],
        ['Default', table('', [row('Brightness')])],
        ['Value 1', table('', [row('Wi-Fi', 'Home', 'value-one', disclosure)])],
        ['Value 2', table('', [row('name', 'Ada Lovelace', 'value-two')])],
        ['Subtitle', table('', [row('Calendar', 'Today at 9:41 AM', 'subtitle')])],
        ['Gray selection', table('gray-selection', [row('Appearance')])],
        ['No selection', table('', ['<li class="cell"><span class="cell-title unselectable">Version</span></li>'])],
        ['Editing', `<div class="table-frame grouped"><ul class="table editable"><li><button class="edit-delete" type="button" aria-label="Delete Draft">−</button><span>Draft</span></li><li><button class="edit-insert" type="button" aria-label="Insert item">+</button><span>New Item</span></li></ul></div>`]
      ]), true]
    ]
  },
  {
    id: 'input', title: 'Text & Pickers', cards: [
      ['UITextField', samples(['None', 'Line', 'Bezel', 'Rounded Rect'].map(style => [style, `<input class="field ${style.toLowerCase().replace(' ', '-')}" aria-label="${style} text field" placeholder="Name">`]))],
      ['UITextView / UIMenuController', `<div class="text-demo"><textarea class="text-view" aria-label="Editable text">Select a word to edit it.</textarea><div class="callout" hidden>${['Cut', 'Copy', 'Paste', 'Select', 'Select All'].map(name => button(name)).join('')}</div><div class="loupe" aria-hidden="true" hidden></div><div class="text-tools">${button('Edit menu', 'class="bevel" data-menu')}${button('Hold to magnify', 'class="bevel" data-loupe')}</div></div>`],
      ['Keyboard', `<div class="keyboard-demo"><input class="field rounded-rect" aria-label="Keyboard input" autocomplete="off" placeholder="Text message" inputmode="none">${keyboard}</div>`],
      ['UIPickerView', picker('Picker', ['City', 'Hour'])],
      ['UIDatePicker', samples([
        ['Time', picker('Time', ['Hour', 'Minute', 'Period'])],
        ['Date', picker('Date', ['Month', 'Day', 'Year'])],
        ['Date and Time', picker('Date and Time', ['Date', 'Hour', 'Minute', 'Period'])],
        ['Count Down Timer', picker('Count Down Timer', ['Hours', 'Minutes'])]
      ]), true],
      ['Web select picker', `<div class="dropdown-demo">${button('Cupertino', 'class="bevel dropdown-trigger" data-open aria-haspopup="dialog"')}${dialog('sheet', `${title('Choose a city')}${picker('Cities', ['City'])}${close('Done')}`)}</div>`]
    ]
  },
  {
    id: 'presentation', title: 'Presentation', cards: [
      ['UIAlertView', modal('alert', 'Show Alert', `${title('Cannot Connect')}
<p>Check your network settings and try again.</p><div class="alert-actions">${close('Cancel')}${close('OK', 'primary')}</div>`)],
      ['UIActionSheet', samples([['Default', modal('sheet', 'Show Actions', `${title('Photo Options')}${close('Save Photo')}${close('Delete Photo', 'destructive')}${close('Cancel', 'cancel')}`)], ['Black Opaque', modal('sheet solid', 'Show Actions', `${title('Photo Options')}${close('Save Photo')}${close('Cancel', 'cancel')}`)], ['Black Translucent', modal('sheet translucent', 'Show Actions', `${title('Photo Options')}${close('Save Photo')}${close('Cancel', 'cancel')}`)]])],
      ['UIPopoverController', `<div class="popover-example">${button('Albums', 'class="bar-button" data-popover aria-expanded="true"')}
<div class="popover"><div class="bar black"><strong>Albums</strong></div>${table('', [row('Camera Roll', '', '', disclosure), row('Favorites', '', '', disclosure)])}</div></div>`],
      ['UIWindow / Status bar', samples([['Default', status('default')], ['Black Opaque', status('opaque')], ['Black Translucent', status('translucent')]])],
      ['UIScrollView', '<div class="scroll-demo" tabindex="0" aria-label="Scrollable list"><div>Monday</div><div>Tuesday</div><div>Wednesday</div><div>Thursday</div><div>Friday</div><div>Saturday</div><div>Sunday</div></div>'],
      ['UIView / UILabel / UIImageView', '<div class="basic-view"><div class="picture" role="img" aria-label="Illustration of mountains and the sun"><svg viewBox="0 0 160 80" aria-hidden="true"><circle cx="126" cy="24" r="13" fill="#ffe49e"/><path d="M0 80 41 17l36 50 24-25 45 38z" fill="#396b82"/><path d="m45 80 42-24 25 8 32-14 16 30z" fill="#234e6e"/></svg></div><strong>Landscape</strong><span>168 × 84 pt image view</span></div>'],
      ['UIWebView', '<div class="web-preview"><h4>Example Page</h4><p>A page rendered inside a web view.</p><a href="#input">Text input samples</a></div>'],
      ['UISplitViewController', `<div class="split"><div class="bar"><strong>Notes</strong></div><div class="split-body"><div class="split-list" role="group" aria-label="Notes">${['Today', 'Yesterday', 'Monday'].map((name, i) => button(name, `data-note="${i}" aria-pressed="${i === 0}"`)).join('')}</div><div class="split-detail" aria-live="polite">Write a note.</div></div></div>`],
      ['UIDocumentInteractionController', modal('sheet', 'Document Options', `${title('Document.pdf')}${close('Open In…')}${close('Print')}${close('Cancel', 'cancel')}`)],
      ['UIPrintInteractionController', modal('sheet', 'Print Options', `${title('Printer Options')}<label class="print-label">Copies <input type="number" min="1" max="99" value="1"></label>${close('Print')}${close('Cancel', 'cancel')}`)],
      ['UIImagePickerController', modal('sheet', 'Image Picker', `${title('Camera Roll')}<div class="photo-options">${['Mountain', 'Meadow', 'Ocean'].map(name => button(`<span>${name}</span>`, 'data-close')).join('')}</div>${close('Cancel', 'cancel')}`)],
      ['UIVideoEditorController', modal('sheet', 'Video Editor', `${title('Trim Video')}<div class="filmstrip" aria-hidden="true"></div><label>End time <input type="range" min="1" max="12" value="12"></label>${close('Trim')}${close('Cancel', 'cancel')}`)]
    ]
  }
];
