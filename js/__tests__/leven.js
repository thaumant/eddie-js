const eddie = require('..')

function check(fn, sample) {
    for (const [dist, s1, s2] of sample) {
        expect(fn(s1, s2)).toBe(dist)
    }
}

describe('leven', () => {
    test('basics', () => {
        check(eddie.leven, [
            [0, '',  ''],
            [1, 'a', ''],
            [1, '',  'b'],
            [1, 'a', 'b'],
        ])
    })

    test('mixed', () => {
        check(eddie.leven, [
            [3, 'ca',        'abc'],
            [3, 'a tc',      'a cat'],
            [4, 'a cat',     'an abct'],
            [2, 'crate',     'trace'],
            [2, 'captain',   'ptain'],
            [2, 'dwayne',    'duane'],
            [2, 'martha',    'marhta'],
            [3, 'kitten',    'sitting'],
            [6, 'mailbox',   'boxmail'],
            [3, 'mailbox',   'alimbox'],
            [4, 'dixon',     'dicksonx'],
            [2, 'jellyfish', 'smellyfish'],
        ])
    })

    test('unicode', () => {
        check(eddie.leven, [
            [1, 'もしもし', 'もしもしし'],
            [0, 'もしもし', 'もしもし'],
            [1, 'もしもし', 'もしまし'],
            [1, 'もしもし', 'もしし'],
            [2, 'もしもし', 'もし'],
            [3, 'もしもし', 'し'],
            [4, 'もしもし', ''],
        ])
    })

    test('growth', () => {
        for (let len = 1; len <= 1001; len += 10) {
            const a = ''.padEnd(len, 'a')
            const b = ''.padEnd(len, 'b')
            expect(eddie.leven(a, b)).toBe(len)
            expect(eddie.leven(a, a)).toBe(0)
        }
    })
})