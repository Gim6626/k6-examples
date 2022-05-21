If you use external NPM modules, follow this example to find how to resolve it:
1. Download template from https://github.com/grafana/k6-template-es6
2. `main.js` contains cheerio dependency, so we will resolve it
3. `npm install .`
4. `npm run-script webpack`
5. `k6 run build/app.bundle.js` instead of previous `k6 run main.js`
6. Thats all! Use your test script instead of `main.js` and follow same steps
