document.addEventListener('DOMContentLoaded', () => {
    const amount = document.getElementById('amount');
    const currency = document.getElementById('currency');
    const convert = document.getElementById('convert');
    const result = document.getElementById('result');

    console.log('amount:', amount);
    console.log('currency:', currency);
    console.log('convert:', convert);
    console.log('result:', result);

    const API_KEY = "vCd/Hg1CpbZJySK1g/X87Q==9UxdIM2650C29FDe";
    const API_URL = "https://api.api-ninjas.com/v1/exchangerate?pair=GBP_";

    convert.addEventListener('click', () => {
        const amountTotal = amount.value.trim();
        const currencyTotal = currency.value.trim();

        // Input validation
        if (!amountTotal || isNaN(amountTotal) || Number(amountTotal) <= 0) {
            result.innerHTML = 'Please enter a valid amount.';
            return;
        }
        if (!currencyTotal) {
            result.innerHTML = 'Please select a currency.';
            return;
        }

        const url = API_URL + currencyTotal;

        fetch(url, {
            headers: {
                'X-API-Key': API_KEY
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.exchange_rate) {
                result.innerHTML = 'Could not fetch exchange rate.';
                return;
            }
            const rate = data.exchange_rate;
            const resultPrice = Number(amountTotal) * rate;
            result.innerHTML = `${amountTotal} GBP = ${resultPrice.toFixed(2)} ${currencyTotal}`;
        })
        .catch(error => {
            console.error('Request failed:', error);
            result.innerHTML = 'An error occurred, please try again later.';
        });
    });
});