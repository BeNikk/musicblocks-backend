import { sanitizeTopics } from '../../src/utils/sanitizeTopics';

describe('sanitizeTopics', () => {
  describe('basic sanitization', () => {
    it('should convert topics to lowercase', () => {
      const input = ['PIANO', 'GUITAR', 'DRUMS'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano', 'guitar', 'drums']);
    });

    it('should trim whitespace from topics', () => {
      const input = ['  piano  ', '  guitar  ', '  drums  '];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano', 'guitar', 'drums']);
    });

    it('should replace invalid characters with hyphens', () => {
      const input = ['rock & roll', 'jazz/blues', 'pop+rock'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['rock---roll', 'jazz-blues', 'pop-rock']);
    });

    it('should remove leading and trailing hyphens', () => {
      const input = ['-piano-', '-guitar-', '-drums-'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano', 'guitar', 'drums']);
    });

    it('should truncate topics longer than 50 characters', () => {
      const longTopic = 'a'.repeat(60);
      const input = [longTopic, 'guitar'];
      const result = sanitizeTopics(input);
      expect(result[0]).toHaveLength(50);
      expect(result[1]).toBe('guitar');
    });
  });

  describe('special characters handling', () => {
    it('should handle spaces', () => {
      const input = ['rock and roll', 'jazz fusion', 'classical music'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['rock-and-roll', 'jazz-fusion', 'classical-music']);
    });

    it('should handle punctuation marks', () => {
      const input = ['rock!', 'jazz?', 'blues...', 'pop,rock'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['rock', 'jazz', 'blues', 'pop-rock']);
    });

    it('should handle special symbols', () => {
      const input = ['rock@music', 'jazz#blues', 'pop$rock', 'folk%music'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['rock-music', 'jazz-blues', 'pop-rock', 'folk-music']);
    });

    it('should handle parentheses and brackets', () => {
      const input = ['rock(music)', 'jazz[blues]', 'pop{rock}', 'folk<music>'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['rock-music', 'jazz-blues', 'pop-rock', 'folk-music']);
    });

    it('should handle multiple consecutive special characters', () => {
      const input = ['rock&&&roll', 'jazz!!!blues', 'pop+++rock'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['rock---roll', 'jazz---blues', 'pop---rock']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const input: string[] = [];
      const result = sanitizeTopics(input);
      expect(result).toEqual([]);
    });

    it('should handle array with empty strings', () => {
      const input = ['', '  ', 'piano', ''];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano']);
    });

    it('should handle array with only whitespace strings', () => {
      const input = ['  ', '\t', '\n', 'piano'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano']);
    });

    it('should handle single character topics', () => {
      const input = ['a', 'b', 'c'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle topics with only special characters', () => {
      const input = ['!!!', '???', '###', 'piano'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano']);
    });
  });

  describe('filtering invalid topics', () => {
    it('should filter out topics that start with non-alphanumeric characters', () => {
      const input = ['-piano', '1guitar', 'piano', 'guitar'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano', '1guitar', 'piano', 'guitar']);
    });

    it('should filter out topics that contain only hyphens', () => {
      const input = ['---', 'piano', '---', 'guitar'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano', 'guitar']);
    });

    it('should filter out topics that are too short after sanitization', () => {
      const input = ['a', 'b', 'piano', 'guitar'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['a', 'b', 'piano', 'guitar']);
    });

    it('should filter out topics with invalid patterns', () => {
      const input = ['-piano-', 'guitar-', '-drums', 'valid'];
      const result = sanitizeTopics(input);
      expect(result).toEqual(['piano', 'guitar', 'drums', 'valid']);
    });
  });

  describe('real-world examples', () => {
    it('should handle typical music genres', () => {
      const input = [
        'Rock & Roll',
        'Jazz Fusion',
        'Classical Music',
        'Hip Hop',
        'Electronic Dance Music',
        'Country & Western',
        'Blues Rock',
        'Folk Music'
      ];
      
      const result = sanitizeTopics(input);
      const expected = [
        'rock---roll',
        'jazz-fusion',
        'classical-music',
        'hip-hop',
        'electronic-dance-music',
        'country---western',
        'blues-rock',
        'folk-music'
      ];
      
      expect(result).toEqual(expected);
    });

    it('should handle instrument names', () => {
      const input = [
        'Electric Guitar',
        'Acoustic Piano',
        'Bass Drum',
        'Saxophone (Alto)',
        'Violin [Strings]',
        'Trumpet & Trombone'
      ];
      
      const result = sanitizeTopics(input);
      const expected = [
        'electric-guitar',
        'acoustic-piano',
        'bass-drum',
        'saxophone--alto',
        'violin--strings',
        'trumpet---trombone'
      ];
      
      expect(result).toEqual(expected);
    });

    it('should handle mixed case and special characters', () => {
      const input = [
        'ROCK!!!',
        'jazz...',
        'Pop & Rock',
        'Classical (Orchestral)',
        'Electronic/Dance',
        'Blues-Rock Fusion'
      ];
      
      const result = sanitizeTopics(input);
      const expected = [
        'rock',
        'jazz',
        'pop---rock',
        'classical--orchestral',
        'electronic-dance',
        'blues-rock-fusion'
      ];
      
      expect(result).toEqual(expected);
    });
  });

  describe('performance and limits', () => {
    it('should handle very long topics correctly', () => {
      const longTopic = 'a'.repeat(100);
      const input = [longTopic, 'normal'];
      const result = sanitizeTopics(input);
      
      expect(result[0]).toHaveLength(50);
      expect(result[1]).toBe('normal');
    });

    it('should handle large arrays efficiently', () => {
      const input = Array.from({ length: 1000 }, (_, i) => `topic-${i}`);
      const result = sanitizeTopics(input);
      
      expect(result).toHaveLength(1000);
      expect(result[0]).toBe('topic-0');
      expect(result[999]).toBe('topic-999');
    });

    it('should handle topics with many special characters', () => {
      const input = ['a!@#$%^&*()b', 'c[]{}|\\:;"\'<>,.?/d'];
      const result = sanitizeTopics(input);
      
      expect(result).toEqual(['a----------b', 'c----------------d']);
    });
  });
});
