const eddie = require('..')

function check(fn, sample) {
    for (const [dist, s1, s2] of sample) {
        expect(fn(s1, s2)).toBe(dist)
    }
}

describe('damlev', () => {
    test('basics', () => {
        check(eddie.damlev, [
            [0, '',  ''],
            [1, 'a', ''],
            [1, '',  'b'],
            [1, 'a', 'b'],
        ])
    })

    test('mixed', () => {
        check(eddie.damlev, [
            [2, 'ca',        'abc'],
            [2, 'a tc',      'a cat'],
            [3, 'a cat',     'an abct'],
            [2, 'crate',     'trace'],
            [2, 'captain',   'ptain'],
            [2, 'dwayne',    'duane'],
            [1, 'martha',    'marhta'],
            [3, 'kitten',    'sitting'],
            [6, 'mailbox',   'boxmail'],
            [3, 'mailbox',   'alimbox'],
            [4, 'dixon',     'dicksonx'],
            [2, 'jellyfish', 'smellyfish'],
        ])
    })

    test('unicode', () => {
        check(eddie.damlev, [
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
            expect(eddie.damlev(a, b)).toBe(len)
            expect(eddie.damlev(a, a)).toBe(0)
        }
    })
})