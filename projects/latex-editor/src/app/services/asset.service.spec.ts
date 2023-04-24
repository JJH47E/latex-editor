import { TestBed } from '@angular/core/testing';

import { AssetService } from './asset.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

describe('AssetService', () => {
  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);

  let service: AssetService;

  const expectedResult = [{key: 'value', list: [12, 13, 14]} as TestInterface];

  interface TestInterface {
    key: string;
    list: number[]
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(AssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJsonData', () => {
    const fileName = 'testName';

    beforeEach(() => {
      httpClientSpy.get.and.returnValue(new BehaviorSubject<TestInterface[]>(expectedResult));
    });
    it('should parse raw json into an object', () => {
      service.getJsonData<TestInterface>('testName').subscribe(res => {
        expect(res).toBe(expectedResult);
      });
    });
  });
});
