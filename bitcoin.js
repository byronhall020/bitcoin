var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        let btcMin = Number.MAX_VALUE;
        let minDate = null;
        let btcMax = Number.MIN_VALUE;
        let maxDate = null;
        for (x in JSON.parse(xhttp.responseText).bpi) {
            if (JSON.parse(xhttp.responseText).bpi[x] < btcMin) {
                btcMin = JSON.parse(xhttp.responseText).bpi[x];
                minDate = x;
            }
            if (JSON.parse(xhttp.responseText).bpi[x] > btcMax) {
                btcMax = JSON.parse(xhttp.responseText).bpi[x];
                maxDate = x;
            }
            lastDate = x;
            lastValue = JSON.parse(xhttp.responseText).bpi[x];
        }
        const goldenRatio = (((1 + (5 ** (1 / 2))) / 2) - 1);
        const ratios = [goldenRatio];
        const numberOfCuts = 9;
        for (let i = 0; i < numberOfCuts; i += 1) {
            const nextGoldenCut = (
                (
                    1 - ratios.reduce((total, num) => {
                        return total + num;
                    })
                )
            );
            if (i === (numberOfCuts - 1)) {
                ratios.push(
                    nextGoldenCut
                );
            } else {
                ratios.push(
                    nextGoldenCut * goldenRatio
                );
            }
        }
        let tags = '';
        tags += `<div style="margin:8px;"><span class="d-inline-block w-50">${maxDate}:</span>$${btcMax.toFixed(2)}</div><hr />`;
        for (let i = 0; i < ratios.length; i += 1) {
            tags += `<div style="margin:8px;"><span class="d-inline-block w-50">&phi;<sup>-${i + 1}</sup></span>$${
                ((ratios[i] * (
                    btcMax - (((ratios[i] * (btcMax - btcMin)) + btcMin))
                )) + (
                        ((ratios[0] * (btcMax - btcMin)) + btcMin)
                    )).toFixed(2)
                }</div>`
        }
        tags += `<hr />`;
        for (let i = 0; i < ratios.length; i += 1) {
            tags += `<div style="margin:8px;"><span class="d-inline-block w-50">&phi;<sup>${i + 1}</sup></span>$${
                ((ratios[i] * (btcMax - btcMin)) + btcMin).toFixed(2)
                }</div>`
        }
        tags += `<hr /><div style="margin:8px;"><span class="d-inline-block w-50">${minDate}:</span>$${btcMin.toFixed(2)}</div>`;
        document.getElementById('index').innerHTML = tags;
    }
};
const d = new Date();
var past = new Date();
past.setDate(past.getDate() - 7);
xhttp.open(
    "GET", 
    (
        `https://api.coindesk.com/v1/bpi/historical/close.json?start=${
        past.getFullYear()
        }-${
        (past.getMonth() + 1) < 10 ? `0${past.getMonth() + 1}`:past.getMonth() + 1
        }-${
            past.getDate() < 10 ? `0${past.getDate()}`: past.getDate()
        }&end=${
            d.getFullYear()
        }-${
            (d.getMonth() + 1) < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
        }-${
            d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
        }`
    ), 
        true
    );
xhttp.send();

var xhttp2 = new XMLHttpRequest();

xhttp2.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        document.getElementById('currentPrice').innerHTML = (
            `<div style="margin:8px;"><span class="d-inline-block w-50">${new Date().toGMTString()}:</span>$${Number(JSON.parse(xhttp2.responseText).bpi.USD.rate.replace(',', '')).toFixed(2)}</div><hr />`
        )
    }
}

xhttp2.open("GET", `https://api.coindesk.com/v1/bpi/currentprice.json`, true);
xhttp2.send();