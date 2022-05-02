import { ascending, descending } from "d3";
import rawDaily from "$data/bos_data.csv";

const MIN_DAYS = 30;
const MAX_DAYS = 90;
const MS_DAY = 86400000;

// TODO
// const today = Date.now();
const today = new Date(2022, 3, 14);

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
		date: new Date(d.date.setDate(d.date.getDate() + 1)),
		daysSinceNow: Math.floor((today - d.date) / MS_DAY),
	})).filter(d => d.daysSinceNow >= 0);

daily.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));

// find recent hot temp
const recentIndex = daily.findIndex((d, i) => i !== 0 && d.rank !== undefined);
const threshold = Math.min(Math.max(recentIndex, MIN_DAYS), MAX_DAYS);
const recent = daily.filter(d => d.daysSinceNow < threshold);
const recentDays = recent.map(d => d.day);

const filtered = daily.filter(d => recentDays.includes(d.day) || d.rank !== undefined);

const getFake = (d) => {
	const match = recent.find(r => r.day === d.day);
	return match ? threshold - match.daysSinceNow - 1 : undefined;
};

// TODO dedupe ties
const clean = filtered.map(d => ({
	...d,
	recent: d.daysSinceNow < threshold,
	daysSinceNowFake: getFake(d),
	recentDay: recentDays.includes(d.day)
}));

// latest
const latest = clean.find(d => d.daysSinceNow === 0);
latest.highlight = "latest";
// hot not latest not top
const hot = clean.find(d => d.daysSinceNow > 0 && d.rank !== undefined && d.rank > 0);
hot.highlight = "hot";
// top + same day as hot not top
const top = clean.find(d => hot.day == d.day && d.rank === 0);
top.highlight = "top";

clean.sort((a, b) => ascending(a.highlight ? 1 : 0, b.highlight ? 1 : 0));
export default clean;