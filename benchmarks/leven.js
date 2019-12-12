const eddie = require('../js/')
const leven = require('leven')
const {Suite} = require('benchmark')


const SAMPLE1 = [
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


const SAMPLE2 = [
    ['aaaaaaa', '0000000'],
    ['bbbbbbb', '1111111'],
    ['ccccccc', '2222222'],
    ['ddddddd', '3333333'],
    ['eeeeeee', '4444444'],
    ['fffffff', '5555555'],
    ['ggggggg', '6666666'],
    ['hhhhhhh', '7777777'],
    ['iiiiiii', '8888888'],
    ['jjjjjjj', '9999999'],
]


function run(fn) {
    for (const [s1, s2] of SAMPLE2) {
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
