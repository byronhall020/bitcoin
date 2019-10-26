var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        let btcMin = Number.MAX_VALUE;
        let minDate = null;
        let btcMax = Number.MIN_VALUE;
        let maxDate = null;
        let lastDate = null;
        let lastValue = null;
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
        tags += `<div style="margin:8px;">${lastDate}: $${lastValue}</div><hr />`;
        tags += `<div style="margin:8px;">${maxDate}; $${btcMax}</div><hr />`;
        for (let i = 0; i < ratios.length; i += 1) {
            tags += `<div style="margin:8px;">$${
                ((ratios[i] * (
                    btcMax - (((ratios[i] * (btcMax - btcMin)) + btcMin))
                )) + (
                        ((ratios[0] * (btcMax - btcMin)) + btcMin)
                    )).toFixed(2)
                }<span style="margin-left: 8px;">&phi;<sup>-${i + 1}</sup></span></div>`
        }
        tags += `<hr />`;
        for (let i = 0; i < ratios.length; i += 1) {
            tags += `<div style="margin:8px;">$${
                ((ratios[i] * (btcMax - btcMin)) + btcMin).toFixed(2)
                }<span style="margin-left: 8px;">&phi;<sup>${i + 1}</sup></span></div>`
        }
        tags += `<hr /><div style="margin:8px;">${minDate}; $${btcMin}</div>`;
        document.getElementById('index').innerHTML = tags;
    }
};
const d = new Date();
xhttp.open("GET", `https://api.coindesk.com/v1/bpi/historical/close.json?start=${d.getFullYear() - 1}-${d.getMonth() + 1}-${d.getDate()}&end=${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, true);
xhttp.send();