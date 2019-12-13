const eddie = require('../js/')
const leven = require('leven')
const {Suite} = require('benchmark')
const {SAMPLE_TYPOS, SAMPLE_UNRELATED, SAMPLE_ASSYMETRIC} = require('./samples')


function run(fn) {
    for (const [s1, s2] of SAMPLE_TYPOS) {
        fn(s1, s2)
    }
}


new Suite()
    .add('eddie', () => {
        run(eddie.leven)
    })
    .add('leven', () => {
        run(leven)
    })
    .on('complete', function (event) {
        const results = []
        this.forEach(bench => {
            const name = bench.name
            const mean = Math.round(bench.stats.mean * 1e6 * 100) / 100 + ' μs'
            results.push({name, mean})
        })
        console.table(results)
    })
    .run()
