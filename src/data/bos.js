import { ascending } from "d3";
import rawRecords from "$data/bos_records.csv";
import rawAverages from "$data/bos_averages.csv";

const MS_DAY = 86400000;

const records = rawRecords.map((d) => ({
	...d,
	date: new Date(d.date),
	day: +d.day,
	rank: +d.rank,
	temp: +d.temp
}))
	.map(d => ({
		...d,
		daysSinceNow: Math.floor((Date.now() - d.date) / MS_DAY)
	}));

records.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));

const averages = rawAverages.map((d) => ({
	...d,
	day: +d.day,
	temp: +d.temp
}));

export default { records, averages };