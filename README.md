# @lp-labs/react-dialog

Native modal dialogs with accessible names and focus restoration. React 18+ peer only; no portal or focus-trap dependency. ESM, CommonJS and TypeScript included.

## Installation

```sh
npm install @lp-labs/react-dialog
```

## Quick Start

```jsx
import { Dialog, useDialog } from '@lp-labs/react-dialog';
export default function Example() {
  const dialog = useDialog();
  return (
    <>
      <button onClick={dialog.show}>Preferences</button>
      <Dialog {...dialog.dialogProps} title="Preferences" description="Update your preferences.">
        <label>
          Name
          <input />
        </label>
      </Dialog>
    </>
  );
}
```

## API

Dialog props: open/defaultOpen=false, onOpenChange, title='Dialog', description, children, closeLabel='Close', closeOnEscape=true, closeOnBackdrop=true, initialFocus (element ref), onError, className, style. Controlled open requires applying onOpenChange. useDialog(defaultOpen?) returns open,setOpen,show,close,dialogProps. Titles and descriptions receive generated IDs and ARIA references.

The native dialog top layer supplies modal focus containment and background inertness, including stacked/nested native dialogs. Opening records the previous focus; closing/unmount restores it if still connected. The browser chooses initial focus unless initialFocus is supplied. Backdrop clicks are identified outside dialog bounds; content clicks do not close.

## Benefits

| Area                  | Details                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| Native modal behavior | Use browser modal and focus containment semantics.                     |
| Nested dialogs        | Keep cancel and close events isolated to the dialog that emitted them. |
| No overlay dependency | Customize children and styles without a portal runtime.                |

## Customization

| Area              | Details                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| State             | Use controlled open state or the included state hook.                        |
| Dismissal         | Configure Escape and backdrop dismissal.                                     |
| Focus and content | Set initial focus, accessible title, description, styles, and error handler. |

## Security And Limits

Requires HTMLDialogElement.showModal/close support; unsupported browsers receive onError and an alert, not an inaccessible fake-modal fallback. Test focus behavior in your target browser and assistive technology. Parent unmounting removes dialogs; background page scrolling is not additionally locked. Do not inject untrusted HTML in title/description/children. Native modal behavior is not a permission boundary; privileged actions need server authorization. SSR emits closed dialog markup until client mount. Custom content must maintain visible labels and sensible tab order.

## Support

[Donate via PayPal](https://www.paypal.me/LibinPrasanth). Author: [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/).

## License

MIT License. See the packaged [LICENSE](LICENSE) file.
