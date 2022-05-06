import { differenceInDays, getDayOfYear } from "date-fns";
import { range, ascending, descending, max } from "d3";
import raw from "$data/bos_data.csv";

const BUFFER = 1.33; // for padding so recent hot day not flush left
const MIN_DAYS = 23;
const LEAP = 59;

const debug = false;

// TODO
const now = new Date(2022, 3, 13);
const nowDay = getDayOfYear(now);

if (debug) console.log({ now, nowDay });

const parseDate = str => {
	const [y, m, d] = str.split("-");
	return new Date(+y, +m - 1, +d);
};

const clean = raw.filter(d => d.temp !== "M").map((d) => ({
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
		daysSinceNow: differenceInDays(now, d.date),
	})).filter(d => d.daysSinceNow >= 1);

clean.sort((a, b) => ascending(a.daysSinceNow, b.daysSinceNow));

const currentYear = clean[0].rawDate.split("-")[0];
const hasLeap = !!clean.find(d => d.rawDate.includes(currentYear) && d.day === LEAP);

if (debug) console.log({ hasLeap });

// modify daysSince to account for leap
if (!hasLeap && clean[0].day > LEAP) {
	clean.forEach(d => {
		if (d.day < LEAP) d.daysSinceNow += 1;
	});
}

// find recent hot (but not top and not most recent) temp
const recentHot = clean.find((d, i) => i > 0 && d.rank > 0);
const recentHotDaysSinceNow = recentHot.daysSinceNow;

if (debug) console.log({ recentHotDaysSinceNow });

// add a buffer to the day so we have space on left for annotation
let threshold = Math.ceil(Math.max(recentHotDaysSinceNow, MIN_DAYS) * BUFFER);

const inverted = clean.map(d => ({
	...d,
	daysSinceNowInverted: threshold - d.daysSinceNow,
}));

const recent = inverted.filter(d => d.daysSinceNow < threshold);
const recentDayValues = recent.map(d => d.day);

// get inverted value for leap day
const a = recent[0].daysSinceNow;
const b = recent[recent.length - 1].daysSinceNow + 1;
let leapDayInverted;
range(a, b).forEach(i => {
	const match = !!recent.find(d => d.daysSinceNow === i);
	if (!match) leapDayInverted = threshold - i;
});

// add in leap year hack
if (Math.min(...recentDayValues) < LEAP && Math.max(...recentDayValues) > LEAP && !recentDayValues.includes(LEAP)) recentDayValues.push(LEAP);
recentDayValues.sort(descending);
threshold = recentDayValues.length;

if (debug) console.log({ threshold });

const fakeMap = new Map();
recentDayValues.forEach(day => {
	const m = recent.find(r => r.day === day);
	const v = m ? m.daysSinceNowInverted : leapDayInverted;
	fakeMap.set(day, v);
});

const withFake = inverted.map(d => ({
	...d,
	recent: d.daysSinceNow <= threshold,
	recentDay: recentDayValues.includes(d.day),
	fakeDay: fakeMap.get(d.day)
}));

if (debug) console.table(withFake.slice(0, 60));
// annotations
// latest
const latest = withFake[0];
latest.highlight = "latest";
latest.annotation = {
	figure: "recent",
	text: "Yesterday",
	type: "temp"
};
// hot not latest not top
const hot = withFake.find((d, i) => i > 0 && d.rank !== undefined && d.rank > 0);
hot.highlight = "hot";
hot.annotation = {
	figure: "recent",
	text: `DATE was the Xnd hottest DATE ever`,
	type: "arrow"
};
// top + same day as hot not top
const top = withFake.find(d => hot.day == d.day && d.rank === 0);
top.highlight = "top";
top.annotation = {
	figure: "recent",
	text: `DATE was the hottest DATE ever at TEMP`,
	type: "arrow"
};

// alltime
const maxTemp = max(withFake, d => d.temp);
const alltime = withFake.find(d => d.temp === maxTemp);
alltime.highlight = "alltime";
alltime.annotation = {
	figure: "annual",
	text: `All-time high`
};

// most recent record
const record = withFake.find(d => d.rank === 0);
record.highlight = "record";
record.annotation = {
	figure: "annual",
	text: `This was set X weeks ago, when it was a record X°F`,
};

// recent 5 records
withFake.filter(d => d.rank === 0).slice(0, 5).forEach(d => {
	d.highlight = "record5";
});

// recent 5 that also had the most recent 2nd place
const record5Days = withFake.filter(d => d.highlight === "record5").map(d => d.day);
const record5Rank2 = withFake.find(d => record5Days.includes(d.day) && d.rank === 1);
const exampleDay = record5Rank2.day;
withFake.filter(d => d.day === exampleDay).forEach(d => d.exampleDay = true);

const example1 = withFake.find(d => d.rank === 0 && d.exampleDay);
example1.highlightE = "example1";
example1.annotation = {
	figure: "recent",
	text: `DATE`,
	type: "temp"
};

const example2 = withFake.find(d => d.rank === 1 && d.exampleDay);
example2.highlightE = "example2";
example2.annotation = {
	figure: "recent",
	text: `DATE was an historic record at the time`,
	type: "arrow"
};


withFake.sort((a, b) => ascending(a.highlight ? 1 : 0, b.highlight ? 1 : 0) || ascending(a.rank, b.rank));
// keep only recent days or ranked ones, trash the rest
const rawData = withFake.filter(d => d.recentDay || d.exampleDay || d.rank !== undefined);

export { rawData, threshold };