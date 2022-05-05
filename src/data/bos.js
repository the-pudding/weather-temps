import { ascending, descending } from "d3";
import rawDaily from "$data/bos_data.csv";

const BUFFER = 1.33; // for padding so recent hot day not flush left
const MIN_DAYS = 30;
const MS_DAY = 86400000;
// TODO
// const today = Date.now();
const today = new Date(2022, 3, 14);
// console.log({ today });

const parseDate = str => {
	const [y, m, d] = str.split("-");
	return new Date(+y, +m - 1, +d);
};

const daily = rawDaily.filter(d => d.temp !== "M").map((d) => ({
	...d,
	day: +d.day,
	rawDate: d.date,
	date: parseDate(d.date),
	rank: d.rank === "" ? undefined : +d.rank,
	temp: +d.temp,
	tie: !!d.tie,
}))
	.map(d => ({
		...d,
		daysSinceNow: Math.floor((today - d.date) / MS_DAY),
	})).filter(d => d.daysSinceNow >= 0);

daily.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));

// find recent hot (but not top and not most recent) temp
const recentIndex = daily.findIndex((d, i) => i > 0 && d.rank > 0);
// add a buffer to the day so we have space on left for annotation
const threshold = Math.max(recentIndex, MIN_DAYS) * BUFFER;
// console.log({ threshold });

const recent = daily.filter(d => d.daysSinceNow < threshold);
const recentDayValues = recent.map(d => d.day);

// console.log({ recentDays });

// keep only recent days or ranked ones, trash the rest
const filtered = daily.filter(d => recentDayValues.includes(d.day) || d.rank !== undefined);

// const getInverted = (d) => {
// 	const match = recent.find(r => r.day === d.day);
// 	return match ? threshold - match.daysSinceNow - 1 : undefined;
// };

// TODO dedupe ties
const clean = filtered.map(d => ({
	...d,
	recent: d.daysSinceNow < threshold,
	// daysSinceNowInverted: getInverted(d),
	recentDay: recentDayValues.includes(d.day)
}));

// latest
const latest = clean[0];
latest.highlight = "latest";
latest.annotation = {
	text: "Yesterday",
	type: "temp"
};
// hot not latest not top
const hot = clean.find((d, i) => i > 0 && d.rank !== undefined && d.rank > 0);
hot.highlight = "hot";
hot.annotation = {
	text: `DATE was the Xnd hottest DATE ever`,
	type: "arrow"
};
// top + same day as hot not top
const top = clean.find(d => hot.day == d.day && d.rank === 0);
top.highlight = "top";
top.annotation = {
	text: `DATE was the hottest DATE ever at TEMP`,
	type: "arrow"
};

clean.sort((a, b) => ascending(a.highlight ? 1 : 0, b.highlight ? 1 : 0));

const rawData = clean;

export { rawData, threshold };