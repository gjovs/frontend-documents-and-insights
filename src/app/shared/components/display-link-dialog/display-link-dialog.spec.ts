import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayLinkDialog } from './display-link-dialog';

describe('DisplayLinkDialog', () => {
  let component: DisplayLinkDialog;
  let fixture: ComponentFixture<DisplayLinkDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayLinkDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayLinkDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
