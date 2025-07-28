import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignerForm } from './signer-form';

describe('SignerForm', () => {
  let component: SignerForm;
  let fixture: ComponentFixture<SignerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignerForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignerForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
