import {
  countMeaningfulUnits,
  isMeaningfulQuestion,
} from '$/utils/questionValidation';

describe('isMeaningfulQuestion', () => {
  it('accepts a complete English question', () => {
    expect(isMeaningfulQuestion('What does my career look like?')).toBe(true);
  });

  it('rejects an empty or whitespace-only input', () => {
    expect(isMeaningfulQuestion('')).toBe(false);
    expect(isMeaningfulQuestion('   \n  ')).toBe(false);
  });

  it('rejects a too-short English question', () => {
    expect(isMeaningfulQuestion('why me')).toBe(false);
  });

  it('accepts Chinese questions that contain no spaces', () => {
    expect(isMeaningfulQuestion('我最近的事业运势如何？')).toBe(true);
  });

  it('accepts Japanese and Korean questions', () => {
    expect(isMeaningfulQuestion('私の恋愛運はどうですか？')).toBe(true);
    expect(isMeaningfulQuestion('제 연애운은 어떤가요?')).toBe(true);
  });

  it('rejects very short CJK input', () => {
    expect(isMeaningfulQuestion('运势')).toBe(false);
    expect(isMeaningfulQuestion('안녕')).toBe(false);
  });

  it('ignores punctuation and emoji', () => {
    expect(isMeaningfulQuestion('?!?!?! 🔮🔮🔮🔮🔮')).toBe(false);
  });

  it('honours a custom minimum', () => {
    expect(isMeaningfulQuestion('tell me more', 3)).toBe(true);
    expect(isMeaningfulQuestion('tell me more', 4)).toBe(false);
  });
});

describe('countMeaningfulUnits', () => {
  it('counts space-delimited words', () => {
    expect(countMeaningfulUnits('will i find love soon')).toBe(5);
  });

  it('counts CJK characters as half a word each', () => {
    expect(countMeaningfulUnits('事业运势')).toBe(2);
  });

  it('counts mixed-script input', () => {
    // 4 CJK characters (2 units) + 1 English word
    expect(countMeaningfulUnits('我的 career 运势')).toBe(3);
  });
});
