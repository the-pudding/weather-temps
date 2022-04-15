import { ascending } from "d3";
import rawDaily from "$data/bos_data.csv";

const MS_DAY = 86400000;
const DAY_THRESHOLD = 30;
// TODO
// const today = Date.now();
const today = new Date(2022, 3, 13);

const daily = rawDaily.filter(d => d.temp !== "M").map((d) => ({
	...d,
	day: +d.day,
	date: new Date(d.date),
	rank: d.rank === "" ? undefined : +d.rank,
	temp: +d.temp,
	tie: !!d.tie,
}))
	.map(d => ({
		...d,
		daysSinceNow: Math.floor((today - d.date) / MS_DAY),
	}));

daily.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));

const recentDays = daily.filter(d => d.daysSinceNow < DAY_THRESHOLD).map(d => d.day);

const filtered = daily.filter(d => recentDays.includes(d.day) || d.rank !== undefined);

const data = filtered.map(d => ({
	...d,
	recent: recentDays.includes(d.day)
}));

export default data;