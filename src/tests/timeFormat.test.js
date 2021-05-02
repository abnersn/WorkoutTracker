import timeFormat from '../util/timeFormat';

describe('timeFormat function', () => {
    it('formats seconds', () => {
        const time = timeFormat(39);
        expect(time).toBe('39');
    });
    
    it('formats minutes', () => {
        const time = timeFormat(98);
        expect(time).toBe('1:38');
    });
    
    it('formats hours', () => {
        const time = timeFormat(3722);
        expect(time).toBe('1:02:02');
    });

    it('formats negative times', () => {
        const time = timeFormat(-3722);
        expect(time).toBe('-1:02:02');
    });
});
