/* USAGE:
locate(test = false).then(data => {

}).catch(err => {

});
*/

const TEST_DATA = {
	"ip": "143.244.47.74",
	"hostname": "unn-143-244-47-74.datapacket.com",
	"city": "New York City",
	"region": "New York",
	"country": "US",
	"loc": "40.7143,-74.0060",
	"org": "AS212238 Datacamp Limited",
	"postal": "10004",
	"timezone": "America/New_York"
};

const MAX_TIME = 4000;

async function lookup(test) {
	if (test) return Promise.resolve(TEST_DATA);
	try {
		const request = await fetch("https://ipinfo.io/json?token=6f0f9c88db028a");
		const json = await request.json();
		if (json.country !== "US") return TEST_DATA;
		return json;
	} catch (err) {
		throw new Error(err);
	}
}

function init(test = false) {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => reject(new Error('timeout')), MAX_TIME);
		lookup(test)
			.then((data) => {
				clearTimeout(timeout);
				resolve(data);
			})
			.catch(reject);
	});
}

export default init;
