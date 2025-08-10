async function fetchData() {
    const url = 'https://concerts-artists-events-tracker.p.rapidapi.com/artist/events?artist_id=128';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '618d153464mshc3b854163266ac7p1eaefbjsn929de6dfe6e3',
		'x-rapidapi-host': 'concerts-artists-events-tracker.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	if (result.events && Array.isArray(result.events)) {
    document.getElementById('concerts').innerHTML = result.events
        .map(item => `<li>Artist ID: ${item.artist_id}, Announced: ${item.announced_at}</li>`)
        .join('');
} else {
    document.getElementById('concerts').innerHTML = '<li>No concerts found.</li>';
}
} catch (error) {
	console.error(error);
}
}
fetchData();