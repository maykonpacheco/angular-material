import {createTestApp, patchDevkitTreeToExposeTypeScript} from '@angular/cdk/schematics/testing';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {createNewTestRunner, migrateComponents, THEME_FILE} from '../test-setup-helper';

describe('tabs styles', () => {
  let runner: SchematicTestRunner;
  let cliAppTree: UnitTestTree;

  async function runMigrationTest(oldFileContent: string, newFileContent: string) {
    cliAppTree.create(THEME_FILE, oldFileContent);
    const tree = await migrateComponents(['tabs'], runner, cliAppTree);
    expect(tree.readContent(THEME_FILE)).toBe(newFileContent);
  }

  beforeEach(async () => {
    runner = createNewTestRunner();
    cliAppTree = patchDevkitTreeToExposeTypeScript(await createTestApp(runner));
  });

  describe('mixin migrations', () => {
    it('should replace the old theme with the new ones', async () => {
      await runMigrationTest(
        `
        @use '@angular/material' as mat;
        $theme: ();
        @include mat.legacy-tabs-theme($theme);
      `,
        `
        @use '@angular/material' as mat;
        $theme: ();
        @include mat.tabs-theme($theme);
        @include mat.tabs-typography($theme);
      `,
      );
    });

    it('should use the correct namespace', async () => {
      await runMigrationTest(
        `
        @use '@angular/material' as arbitrary;
        $theme: ();
        @include arbitrary.legacy-tabs-theme($theme);
      `,
        `
        @use '@angular/material' as arbitrary;
        $theme: ();
        @include arbitrary.tabs-theme($theme);
        @include arbitrary.tabs-typography($theme);
      `,
      );
    });

    it('should handle updating multiple themes', async () => {
      await runMigrationTest(
        `
        @use '@angular/material' as mat;
        $light-theme: ();
        $dark-theme: ();
        @include mat.legacy-tabs-theme($light-theme);
        @include mat.legacy-tabs-theme($dark-theme);
      `,
        `
        @use '@angular/material' as mat;
        $light-theme: ();
        $dark-theme: ();
        @include mat.tabs-theme($light-theme);
        @include mat.tabs-typography($light-theme);
        @include mat.tabs-theme($dark-theme);
        @include mat.tabs-typography($dark-theme);
      `,
      );
    });

    it('should preserve whitespace', async () => {
      await runMigrationTest(
        `
        @use '@angular/material' as mat;
        $theme: ();


        @include mat.legacy-tabs-theme($theme);


      `,
        `
        @use '@angular/material' as mat;
        $theme: ();


        @include mat.tabs-theme($theme);
        @include mat.tabs-typography($theme);


      `,
      );
    });
  });

  describe('selector migrations', () => {
    it('should update the legacy mat-tab classname', async () => {
      await runMigrationTest(
        `
        .mat-tab {
          height: 50px;
        }
      `,
        `
        .mat-mdc-tab {
          height: 50px;
        }
      `,
      );
    });

    it('should update multiple legacy classnames', async () => {
      await runMigrationTest(
        `
        .mat-tab {
          height: 50px;
        }
        .mat-tab-body {
          padding: 25px;
        }
      `,
        `
        .mat-mdc-tab {
          height: 50px;
        }
        .mat-mdc-tab-body {
          padding: 25px;
        }
      `,
      );
    });

    it('should update a legacy classname w/ multiple selectors', async () => {
      await runMigrationTest(
        `
        .some-class.mat-tab, .another-class {
          height: 50px;
        }
      `,
        `
        .some-class.mat-mdc-tab, .another-class {
          height: 50px;
        }
      `,
      );
    });

    it('should preserve the whitespace of multiple selectors', async () => {
      await runMigrationTest(
        `
        .some-class,
        .mat-tab,
        .another-class { height: 50px; }
      `,
        `
        .some-class,
        .mat-mdc-tab,
        .another-class { height: 50px; }
      `,
      );
    });

    it('should add comment for potentially deprecated selector', async () => {
      await runMigrationTest(
        `
        .mat-tab-label-content {
          color: red;
        }
      `,
        `
        /* TODO: The following rule targets internal classes of tabs that may no longer apply for the MDC version. */

        .mat-tab-label-content {
          color: red;
        }
      `,
      );
    });

    it('should add comment for potentially deprecated multi-line selector', async () => {
      await runMigrationTest(
        `
        .some-class
        .mat-tab-label-content {
          color: red;
        }
      `,
        `
        /* TODO: The following rule targets internal classes of tabs that may no longer apply for the MDC version. */

        .some-class
        .mat-tab-label-content {
          color: red;
        }
      `,
      );
    });

    it('should update the legacy mat-tab class and add comment for potentially deprecated selector', async () => {
      await runMigrationTest(
        `
        .mat-tab.some-class, .mat-tab-label-content {
          padding: 25px;
        }
      `,
        `
        /* TODO: The following rule targets internal classes of tabs that may no longer apply for the MDC version. */

        .mat-mdc-tab.some-class, .mat-tab-label-content {
          padding: 25px;
        }
      `,
      );
    });
  });
});
