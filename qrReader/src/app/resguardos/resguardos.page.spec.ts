import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResguardosPage } from './resguardos.page';

describe('ResguardosPage', () => {
  let component: ResguardosPage;
  let fixture: ComponentFixture<ResguardosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResguardosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResguardosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
