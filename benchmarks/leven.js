const eddie = require('../js')
const leven = require('leven')
const {Suite} = require('benchmark')


const SAMPLE = [
    ['a cat',     'an abct'],
    ['crate',     'trace'],
    ['captain',   'ptain'],
    ['dwayne',    'duane'],
    ['martha',    'marhta'],
    ['kitten',    'sitting'],
    ['mailbox',   'boxmail'],
    ['mailbox',   'alimbox'],
    ['dixon',     'dicksonx'],
    ['jellyfish', 'smellyfish'],
]


function run(fn) {
    for (const [s1, s2] of SAMPLE) {
        fn(s1, s2)
    }
}

new Suite()
    .add('eddie', () => {
        run(eddie.levenshtein)
    })
    .add('leven', () => {
        run(leven)
    })
    .on('complete', function (event) {
        this.forEach(bench => {
            console.log(bench.toString())
        })
    })
    .run()
