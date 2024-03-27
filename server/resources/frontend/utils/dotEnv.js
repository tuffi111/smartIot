
import 'dotenv/config'


for (const entryId in process.env) {
    let match;
    const entry = process.env[entryId]
    const findExpressions = /\${\s*[\w\s:\/]+\s*}/g
    while (match = findExpressions.exec(entry)) { // find all "${...}" in .env entry
        const expression = match[0]
        const getName = /[A-Za-z0-9_-]+/g
        const variable = getName.exec(expression)[0].trim() // get string between {}
        if (variable in process.env) { // replace ${variable} with the corresponding value found in .env vars
            process.env[entryId] = process.env[entryId].replace(expression, process.env[variable])
        }
    }
}
