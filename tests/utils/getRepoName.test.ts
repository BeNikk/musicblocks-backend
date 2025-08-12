import { getRepoName } from '../../src/utils/getRepoName';

describe('getRepoName', () => {
  describe('valid repository URLs', () => {
    it('should extract repo name from GitHub HTTPS URL', () => {
      const url = 'https://github.com/org/music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });

    it('should extract repo name from GitHub SSH URL', () => {
      const url = 'git@github.com:org/music-project.git';
      const result = getRepoName(url);
      expect(result).toBe('music-project.git');
    });

    it('should extract repo name from GitHub URL with .git extension', () => {
      const url = 'https://github.com/org/music-project.git';
      const result = getRepoName(url);
      expect(result).toBe('music-project.git');
    });

    it('should extract repo name from nested path', () => {
      const url = 'https://github.com/org/group/music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });

    it('should extract repo name from deep nested path', () => {
      const url = 'https://github.com/org/group/subgroup/music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });
  });

  describe('edge cases', () => {
    it('should handle single segment path', () => {
      const url = 'music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });

    it('should handle empty string', () => {
      const url = '';
      const result = getRepoName(url);
      expect(result).toBe('');
    });

    it('should handle string with only slashes', () => {
      const url = '///';
      const result = getRepoName(url);
      expect(result).toBe('');
    });

    it('should handle string ending with slash', () => {
      const url = 'https://github.com/org/music-project/';
      const result = getRepoName(url);
      expect(result).toBe('');
    });

    it('should handle string with multiple consecutive slashes', () => {
      const url = 'https://github.com//org//music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });
  });

  describe('special characters and formats', () => {
    it('should handle repo names with hyphens', () => {
      const url = 'https://github.com/org/my-music-project';
      const result = getRepoName(url);
      expect(result).toBe('my-music-project');
    });

    it('should handle repo names with underscores', () => {
      const url = 'https://github.com/org/my_music_project';
      const result = getRepoName(url);
      expect(result).toBe('my_music_project');
    });

    it('should handle repo names with dots', () => {
      const url = 'https://github.com/org/music.project.v2';
      const result = getRepoName(url);
      expect(result).toBe('music.project.v2');
    });

    it('should handle repo names with numbers', () => {
      const url = 'https://github.com/org/music-project-2024';
      const result = getRepoName(url);
      expect(result).toBe('music-project-2024');
    });

    it('should handle repo names with mixed characters', () => {
      const url = 'https://github.com/org/music-project_v2.1-beta';
      const result = getRepoName(url);
      expect(result).toBe('music-project_v2.1-beta');
    });
  });

  describe('different URL formats', () => {
    it('should handle GitLab URLs', () => {
      const url = 'https://gitlab.com/org/music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });

    it('should handle Bitbucket URLs', () => {
      const url = 'https://bitbucket.org/org/music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });

    it('should handle custom domain URLs', () => {
      const url = 'https://code.example.com/org/music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });

    it('should handle local file paths', () => {
      const url = '/home/user/projects/music-project';
      const result = getRepoName(url);
      expect(result).toBe('music-project');
    });

    it('should handle Windows file paths', () => {
      const url = 'C:\\Users\\user\\projects\\music-project';
      const result = getRepoName(url);
      expect(result).toBe('C:\\Users\\user\\projects\\music-project');
    });
  });

  describe('error handling', () => {
    it('should handle undefined input gracefully', () => {
      expect(() => getRepoName(undefined as never)).toThrow();
    });

    it('should handle null input gracefully', () => {
      expect(() => getRepoName(null as never)).toThrow();
    });

    it('should handle non-string input gracefully', () => {
      expect(() => getRepoName(123 as never)).toThrow();
    });

    it('should handle object input gracefully', () => {
      expect(() => getRepoName({} as never)).toThrow();
    });
  });

  describe('real-world examples', () => {
    it('should handle typical music project names', () => {
      const urls = [
        'https://github.com/musicblocks/piano-lessons',
        'https://github.com/musicblocks/guitar-tabs',
        'https://github.com/musicblocks/drum-beats',
        'https://github.com/musicblocks/jazz-improvisation'
      ];

      const expected = ['piano-lessons', 'guitar-tabs', 'drum-beats', 'jazz-improvisation'];

      urls.forEach((url, index) => {
        const result = getRepoName(url);
        expect(result).toBe(expected[index]);
      });
    });

    it('should handle organization names with special characters', () => {
      const url = 'https://github.com/music-blocks-org/awesome-project';
      const result = getRepoName(url);
      expect(result).toBe('awesome-project');
    });

    it('should handle very long repo names', () => {
      const longName = 'a'.repeat(100);
      const url = `https://github.com/org/${longName}`;
      const result = getRepoName(url);
      expect(result).toBe(longName);
    });
  });
});
