import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatLegacySlideToggleHarness} from '@angular/material/legacy-slide-toggle/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {MatLegacySlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {SlideToggleHarnessExample} from './slide-toggle-harness-example';
import {ReactiveFormsModule} from '@angular/forms';

describe('SlideToggleHarnessExample', () => {
  let fixture: ComponentFixture<SlideToggleHarnessExample>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatLegacySlideToggleModule, ReactiveFormsModule],
      declarations: [SlideToggleHarnessExample],
    }).compileComponents();
    fixture = TestBed.createComponent(SlideToggleHarnessExample);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should load all slide-toggle harnesses', async () => {
    const slideToggles = await loader.getAllHarnesses(MatLegacySlideToggleHarness);
    expect(slideToggles.length).toBe(2);
  });

  it('should load slide-toggle with name', async () => {
    const slideToggles = await loader.getAllHarnesses(
      MatLegacySlideToggleHarness.with({name: 'first-name'}),
    );
    expect(slideToggles.length).toBe(1);
    expect(await slideToggles[0].getLabelText()).toBe('First');
  });

  it('should get disabled state', async () => {
    const [enabledToggle, disabledToggle] = await loader.getAllHarnesses(
      MatLegacySlideToggleHarness,
    );
    expect(await enabledToggle.isDisabled()).toBe(false);
    expect(await disabledToggle.isDisabled()).toBe(true);
  });

  it('should get label text', async () => {
    const [firstToggle, secondToggle] = await loader.getAllHarnesses(MatLegacySlideToggleHarness);
    expect(await firstToggle.getLabelText()).toBe('First');
    expect(await secondToggle.getLabelText()).toBe('Second');
  });

  it('should toggle slide-toggle', async () => {
    fixture.componentInstance.disabled = false;
    const [checkedToggle, uncheckedToggle] = await loader.getAllHarnesses(
      MatLegacySlideToggleHarness,
    );
    await checkedToggle.toggle();
    await uncheckedToggle.toggle();
    expect(await checkedToggle.isChecked()).toBe(false);
    expect(await uncheckedToggle.isChecked()).toBe(true);
  });
});
