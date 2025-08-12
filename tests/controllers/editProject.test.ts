import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { handleEditProject } from '../../src/controllers/editProject';

jest.mock('../../src/services/updateRepo');

import { updateProjectDataFile } from '../../src/services/updateRepo';

const mockUpdateProjectDataFile = jest.mocked(updateProjectDataFile);

describe('handleEditProject', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.MockedFunction<Response['status']>;
  let mockJson: jest.MockedFunction<Response['json']>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockStatus = jest.fn().mockReturnThis() as jest.MockedFunction<Response['status']>;
    mockJson = jest.fn().mockReturnThis() as jest.MockedFunction<Response['json']>;
    
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    } as Partial<Response>;

    mockUpdateProjectDataFile.mockResolvedValue(undefined);
  });

  describe('successful project editing', () => {
    it('should update a project with valid input', async () => {
      mockRequest = {
        body: {
          repoName: 'my-project',
          projectData: { notes: ['C', 'D', 'E', 'F'] },
          commitMessage: 'Add new note F'
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'my-project',
        { notes: ['C', 'D', 'E', 'F'] },
        'Add new note F'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Project updated successfully' });
    });

    it('should handle complex project data structures', async () => {
      const complexProjectData = {
        tracks: [
          { name: 'Piano', notes: ['C4', 'D4', 'E4'], velocity: 0.8 },
          { name: 'Bass', notes: ['C2', 'G2'], velocity: 0.6 }
        ],
        settings: {
          tempo: 120,
          key: 'C major',
          timeSignature: '4/4'
        }
      };

      mockRequest = {
        body: {
          repoName: 'complex-project',
          projectData: complexProjectData,
          commitMessage: 'Update track configuration'
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'complex-project',
        complexProjectData,
        'Update track configuration'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });

//   describe('input validation', () => {
//     it('should return 300 when commit message is missing', async () => {
//       mockRequest = {
//         body: {
//           repoName: 'my-project',
//           projectData: { notes: ['C', 'D', 'E'] }
//         }
//       };

//       await handleEditProject(mockRequest as Request, mockResponse as Response);

//       expect(mockStatus).toHaveBeenCalledWith(300);
//       expect(mockJson).toHaveBeenCalledWith({ message: 'Commit message is required' });
//       expect(mockUpdateProjectDataFile).not.toHaveBeenCalled();
//     });

//     it('should return 300 when commit message is empty string', async () => {
//       mockRequest = {
//         body: {
//           repoName: 'my-project',
//           projectData: { notes: ['C', 'D', 'E'] },
//           commitMessage: ''
//         }
//       };

//       await handleEditProject(mockRequest as Request, mockResponse as Response);

//       expect(mockStatus).toHaveBeenCalledWith(300);
//       expect(mockJson).toHaveBeenCalledWith({ message: 'Commit message is required' });
//       expect(mockUpdateProjectDataFile).not.toHaveBeenCalled();
//     });

//     it('should return 300 when commit message is null', async () => {
//       mockRequest = {
//         body: {
//           repoName: 'my-project',
//           projectData: { notes: ['C', 'D', 'E'] },
//           commitMessage: null
//         }
//       };

//       await handleEditProject(mockRequest as Request, mockResponse as Response);

//     //   expect(mockStatus).toHaveBeenCalledWith(300);
//       expect(mockJson).toHaveBeenCalledWith({ message: 'Commit message is required' });
//       expect(mockUpdateProjectDataFile).not.toHaveBeenCalled();
//     });

//     it('should return 300 when commit message is undefined', async () => {
//       mockRequest = {
//         body: {
//           repoName: 'my-project',
//           projectData: { notes: ['C', 'D', 'E'] },
//           commitMessage: undefined
//         }
//       };

//       await handleEditProject(mockRequest as Request, mockResponse as Response);

//       expect(mockStatus).toHaveBeenCalledWith(300);
//       expect(mockJson).toHaveBeenCalledWith({ message: 'Commit message is required' });
//       expect(mockUpdateProjectDataFile).not.toHaveBeenCalled();
//     });
//   });

  describe('error handling', () => {
    it('should return 500 when updateProjectDataFile throws an error', async () => {
      mockRequest = {
        body: {
          repoName: 'my-project',
          projectData: { notes: ['C', 'D', 'E'] },
          commitMessage: 'Update notes'
        }
      };

      const error = new Error('GitHub API error');
      mockUpdateProjectDataFile.mockRejectedValue(error);

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to update project' });
    });

    it('should handle different types of errors', async () => {
      mockRequest = {
        body: {
          repoName: 'my-project',
          projectData: { notes: ['C', 'D', 'E'] },
          commitMessage: 'Update notes'
        }
      };

      const networkError = new Error('Network timeout');
      mockUpdateProjectDataFile.mockRejectedValue(networkError);

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to update project' });
    });
  });

  describe('edge cases', () => {
    it('should handle empty project data', async () => {
      mockRequest = {
        body: {
          repoName: 'empty-project',
          projectData: {},
          commitMessage: 'Clear project data'
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'empty-project',
        {},
        'Clear project data'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should handle very long commit messages', async () => {
      const longCommitMessage = 'a'.repeat(1000);
      
      mockRequest = {
        body: {
          repoName: 'long-commit-project',
          projectData: { notes: ['C'] },
          commitMessage: longCommitMessage
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'long-commit-project',
        { notes: ['C'] },
        longCommitMessage
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should handle special characters in repo name', async () => {
      mockRequest = {
        body: {
          repoName: 'my-project@#$%^&*()',
          projectData: { notes: ['C', 'D'] },
          commitMessage: 'Update with special chars'
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'my-project@#$%^&*()',
        { notes: ['C', 'D'] },
        'Update with special chars'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });

  describe('data types', () => {
    it('should handle string project data', async () => {
      mockRequest = {
        body: {
          repoName: 'string-project',
          projectData: 'simple string data',
          commitMessage: 'Update to string'
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'string-project',
        'simple string data',
        'Update to string'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should handle numeric project data', async () => {
      mockRequest = {
        body: {
          repoName: 'numeric-project',
          projectData: 42,
          commitMessage: 'Update to number'
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'numeric-project',
        42,
        'Update to number'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it('should handle array project data', async () => {
      mockRequest = {
        body: {
          repoName: 'array-project',
          projectData: ['item1', 'item2', 'item3'],
          commitMessage: 'Update to array'
        }
      };

      await handleEditProject(mockRequest as Request, mockResponse as Response);

      expect(mockUpdateProjectDataFile).toHaveBeenCalledWith(
        'array-project',
        ['item1', 'item2', 'item3'],
        'Update to array'
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });
  });
});
