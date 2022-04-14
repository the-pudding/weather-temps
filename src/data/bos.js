import { ascending } from "d3";
// import rawRecords from "$data/bos_records.csv";
// import rawAverages from "$data/bos_averages.csv";
import rawDaily from "$data/bos_data.csv";

const MS_DAY = 86400000;
const DAY_THRESHOLD = 30;
// TODO
// const today = Date.now();
const today = new Date(2022, 3, 12);

// const records = rawRecords.map((d) => ({
// 	...d,
// 	date: new Date(d.date),
// 	year: d.date.substring(0, 4),
// 	monthDay: d.date.substring(5),
// 	rank: +d.rank,
// 	temp: +d.temp,
// }))
// 	.map(d => ({
// 		...d,
// 		day: daysIntoYear(d.date) - 1,
// 		daysSinceNow: Math.floor((today - d.date) / MS_DAY)
// 	}));

// records.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));


// const averages = rawAverages.map((d) => ({
// 	...d,
// 	day: +d.day,
// 	temp: +d.temp
// }));


const daily = rawDaily.map((d) => ({
	...d,
	day: +d.day,
	date: new Date(d.date),
	rank: d.rank === "" ? undefined : +d.rank,
	temp: +d.temp,
}))
	.map(d => ({
		...d,
		daysSinceNow: Math.floor((today - d.date) / MS_DAY)
	}));

daily.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));

const records = daily.filter(d => d.rank !== undefined);

const recentTemp = daily.filter(d => d.daysSinceNow < DAY_THRESHOLD);
const recentDays = recentTemp.map(d => d.day);
const recent = daily.filter(d => recentDays.includes(d.day));

export default { recent, records };