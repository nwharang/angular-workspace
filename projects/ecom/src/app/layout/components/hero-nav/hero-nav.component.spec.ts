import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroNavComponent } from './hero-nav.component';

describe('HeroNavComponent', () => {
  let component: HeroNavComponent;
  let fixture: ComponentFixture<HeroNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroNavComponent]
    });
    fixture = TestBed.createComponent(HeroNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
