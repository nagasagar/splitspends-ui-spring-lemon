import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginSucessComponent } from './social-login-sucess.component';

describe('SocialLoginSucessComponent', () => {
  let component: SocialLoginSucessComponent;
  let fixture: ComponentFixture<SocialLoginSucessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialLoginSucessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLoginSucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
