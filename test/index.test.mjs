import { beforeEach, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { act, createElement } from 'react';
import { setup, click, key } from './helpers.mjs';
import { Dialog } from '../dist/index.js';
let ui;
beforeEach(async () => {
  ui = await setup();
  window.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
});
afterEach(async () => ui.cleanup());
test('native modal receives accessible labels and restores trigger focus', async () => {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();
  await ui.render(
    createElement(
      Dialog,
      { defaultOpen: true, title: 'Settings', description: 'Preferences' },
      createElement('input', { 'aria-label': 'Name' }),
    ),
  );
  const dialog = ui.container.querySelector('dialog');
  assert.equal(dialog.open, true);
  assert.ok(
    document
      .getElementById(dialog.getAttribute('aria-labelledby'))
      .textContent.includes('Settings'),
  );
  await click(ui.container.querySelector('button'));
  assert.equal(dialog.open, false);
  assert.equal(document.activeElement, trigger);
});
test('nested cancel and close events do not close an ancestor dialog', async () => {
  await ui.render(
    createElement(
      Dialog,
      { defaultOpen: true, title: 'Parent' },
      createElement(Dialog, { defaultOpen: true, title: 'Child' }),
    ),
  );
  const dialogs = ui.container.querySelectorAll('dialog');
  await act(() =>
    dialogs[1].dispatchEvent(new window.Event('cancel', { bubbles: true, cancelable: true })),
  );
  assert.equal(dialogs[1].open, false);
  assert.equal(dialogs[0].open, true);
});
test('nested Escape works even without a native cancel event', async () => {
  await ui.render(
    createElement(
      Dialog,
      { defaultOpen: true, title: 'Parent' },
      createElement(Dialog, { defaultOpen: true, title: 'Child' }),
    ),
  );
  const dialogs = ui.container.querySelectorAll('dialog');
  await key(dialogs[1].querySelector('button'), 'Escape');
  assert.equal(dialogs[1].open, false);
  assert.equal(dialogs[0].open, true);
});
