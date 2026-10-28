# @umain-mock/bob-mock-react

React components that copy Scania's Tegel components (`@scania/tegel` 1.66.1). Each
component is written in the shape that the brand-orchestration-backbone (BOB) pipeline
delivers, and passes BOB's hard gate.

This package is for testing BOB. It is not a product. Do not use it in production.

## Components

`Badge`, `Block`, `Button`, `Card`, `Divider`, `Link`, `Message`, `Spinner` and `Tag`.
Scania brand, light mode only.

## Install

You get the package as a tarball file, for example `umain-mock-bob-mock-react-0.1.0.tgz`.

1. Put the file in your project.
2. Install it:

   ```sh
   npm install ./umain-mock-bob-mock-react-0.1.0.tgz
   ```

npm records the file path in your `package.json`. Keep the file at that path.

The package needs `react` and `react-dom` 18 or 19.

## Use

Import the stylesheet once, for example in your app entry. Then import the components.

```tsx
import '@umain-mock/bob-mock-react/scania.css';
import { Button, Card } from '@umain-mock/bob-mock-react';

export function Example() {
  return (
    <Card
      header="Fleet"
      body="Twelve trucks are in service."
      actions={<Button text="Open" variant="secondary" size="sm" />}
    />
  );
}
```

Each component has a props type, for example `ButtonProps`. Props follow Tegel's names.
Some Tegel slots are props here, for example the button `icon` and the card `actions`.

## Differences from Tegel

The components follow BOB's rules, so some behaviour differs from Tegel. The repository
records each difference in `docs/findings/`.

## Make a new tarball

Use Node 22.12 or later.

```sh
npm install
npm pack
```

`npm pack` builds the package first and writes the `.tgz` file to the current folder.
