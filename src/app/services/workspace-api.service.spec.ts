import { TestBed } from '@angular/core/testing';

import { WorkspaceApiService } from './workspace-api.service';

describe('WorkspaceApiService', () => {
  let service: WorkspaceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkspaceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
