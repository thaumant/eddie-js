const eddie = require('..')

function floor3(n) {
  return Math.floor(n * 1000) / 1000
}

function check(fn, sample) {
    for (const [dist, s1, s2] of sample) {
        expect(floor3(fn(s1, s2))).toBe(dist)
    }
}

describe('jarwin', () => {
    test('basics', () => {
        check(eddie.jarwin, [
            [1, '',  ''],
            [0, 'a', ''],
            [0, '',  'b'],
            [0, 'a', 'b'],
        ])
    })

    test('mixed', () => {
        check(eddie.jarwin, [
            [0.000, 'ca',        'abc'],
            [0.826, 'a tc',      'a cat'],
            [0.811, 'a cat',     'an abct'],
            [0.733, 'crate',     'trace'],
            [0.804, 'captain',   'ptain'],
            [0.840, 'dwayne',    'duane'],
            [0.961, 'martha',    'marhta'],
            [0.746, 'kitten',    'sitting'],
            [0.849, 'mailbox',   'alimbox'],
            [0.000, 'mailbox',   'boxmail'],
            [0.813, 'dixon',     'dicksonx'],
            [0.896, 'jellyfish', 'smellyfish'],
        ])
    })

    test('unicode', () => {
        check(eddie.jarwin, [
            [0.960, 'もしもし', 'もしもしし'],
            [1.000, 'もしもし', 'もしもし'],
            [0.933, 'もしもし', 'もししも'],
            [0.866, 'もしもし', 'もしまし'],
            [0.933, 'もしもし', 'もしし'],
            [0.866, 'もしもし', 'もし'],
            [0.750, 'もしもし', 'し'],
            [0.000, 'もしもし', ''],
        ])
    })

    test('growth', () => {
        for (let len = 1; len <= 1001; len += 10) {
            const a = ''.padEnd(len, 'a')
            const b = ''.padEnd(len, 'b')
            expect(eddie.jarwin(a, b)).toBe(0)
            expect(eddie.jarwin(a, a)).toBe(1)
        }
    })
})