## API Report File for "components-srcs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ContentContainerComponentHarness } from '@angular/cdk/testing';
import { HarnessPredicate } from '@angular/cdk/testing';
import { ButtonHarnessFilters as LegacyButtonHarnessFilters } from '@angular/material/button/testing';

export { LegacyButtonHarnessFilters }

// @public @deprecated
export class MatLegacyButtonHarness extends ContentContainerComponentHarness {
    blur(): Promise<void>;
    click(relativeX: number, relativeY: number): Promise<void>;
    click(location: 'center'): Promise<void>;
    click(): Promise<void>;
    focus(): Promise<void>;
    getText(): Promise<string>;
    static hostSelector: string;
    isDisabled(): Promise<boolean>;
    isFocused(): Promise<boolean>;
    static with(options?: LegacyButtonHarnessFilters): HarnessPredicate<MatLegacyButtonHarness>;
}

// (No @packageDocumentation comment for this package)

```
