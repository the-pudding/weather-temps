import { format, formatDistanceStrict, differenceInDays, getDayOfYear, addDays } from "date-fns";
import { csvParse, range, ascending, descending, min, max } from "d3";
import ordinal from "ordinal";
// import raw from "$data/stations/AUSthr.csv";

export default async function loadStationData(id) {
	const stamp = Date.now();
	const url = `https://pudding.cool/2022/03/weather-map-data/${id}.csv?v=${stamp}`;
	const response = await fetch(url);
	const csv = await response.text();
	const raw = csvParse(csv);
	const BUFFER = 1.1; // for padding so recent hot day not flush left
	const MIN_DAYS = 28;
	const LEAP = 59;

	const debug = false;


	const parseDate = (str) => {
		const [y, m, d] = str.split("-");
		return new Date(+y, +m - 1, +d);
	};

	raw.sort((a, b) => descending(a.date, b.date));

	const now = addDays(parseDate(raw[0].date), 1);
	const nowDay = getDayOfYear(now);

	if (debug) console.log({ now, nowDay });


	const clean = raw.filter(d => d.temp !== "M").map((d) => ({
		...d,
		day: +d.day,
		rawDate: d.date,
		date: parseDate(d.date),
		// rank: d.rank === "" ? undefined : +d.rank,
		rank: +d.rank,
		temp: +d.temp
	}))
		.map(d => ({
			...d,
			formattedDate: format(d.date, "MMMM d"),
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
	const recentHot = clean.find((d, i) => i > 0 && d.rank > 0 && d.rank < 5);
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

	if (debug) console.log({ latest: withFake[0] });
	// annotations
	// latest
	const latest = withFake[0];
	latest.highlight = "latest";
	latest.annotation = {
		figure: "recent",
		text: `Yesterday, ${format(latest.date, "y")}`,
		type: "side",
		color: "tertiary",
		offset: 0
	};

	// latest top
	const latestTop = withFake.find(d => d.day === latest.day && d.rank === 0);
	if (latestTop.daysSinceNow !== latest.daysSinceNow) {
		latestTop.highlight = "latest";
		latestTop.annotation = {
			figure: "recent",
			text: `Hottest ${format(latestTop.date, "MMMM d")}: ${format(latestTop.date, "y")}`,
			type: "side"
		};
	}

	const latestMin = min(withFake.filter(d => d.day === latest.day), d => d.temp);
	const latestBottom = withFake.find(d => d.day === latest.day && d.temp === latestMin);
	latestBottom.highlight = "latest";
	latestBottom.annotation = {
		figure: "recent",
		text: format(latestBottom.date, "y"),
		type: "side"
	};

	// offset latest
	if (latestTop.daysSinceNow !== latest.daysSinceNow && Math.abs(latest.temp - latestTop.temp) <= 5) latest.annotation.offset = 1;
	else if (Math.abs(latest.temp - latestBottom.temp) <= 5) latest.annotation.offset = -1;


	// hot not latest not top
	const hot = withFake.find((d, i) => i > 0 && d.rank !== undefined && d.rank > 0 && d.rank < 5);
	hot.highlight = "hot";
	hot.annotation = {
		figure: "recent",
		text: `${formatDistanceStrict(latest.date, hot.date)} ago was the ${ordinal(hot.rank + 1)} hottest ${format(hot.date, "MMMM do")} ever`,
		type: "wrap",
		color: "secondary"
	};

	// top + same day as hot not top
	// const top = withFake.find(d => hot.day === d.day && d.rank === 0);
	// top.highlight = "top";
	// top.annotation = {
	// 	figure: "recent",
	// 	text: `${format(top.date, "M/d/y")} was the hottest ${format(top.date, "MMMM do")} ever at ${top.temp}°F`,
	// 	type: "arrow",
	// 	color: "primary"
	// };

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
	// record.highlight = "record";
	// record.annotation = {
	// 	figure: "annual",
	// 	text: `${format(record.date, "M/d/y")}, ${record.temp}°F`,
	// };

	// recent 5 records NOT latest
	withFake.filter(d => d.rank === 0 && d.highlight !== "latest").slice(0, 5).forEach(d => {
		d.highlight = "record5";
	});

	// recent 5 that also had the most recent 2nd place that isn't a tie at top
	const getExampleDay = (attempt) => {
		if (attempt >= 5) return undefined;
		const record5Days = withFake.filter(d => d.highlight === "record5").map(d => d.day);
		const pick = record5Days[attempt];
		const record5Rank2 = withFake.find(d => d.day === pick && d.rank === 1);
		if (record5Rank2) return record5Rank2.day;
		else return getExampleDay(attempt + 1);
	};

	const exampleDay = getExampleDay(0);
	withFake.filter(d => d.day === exampleDay).forEach(d => d.exampleDay = true);

	const example1 = withFake.find(d => d.rank === 0 && d.exampleDay);
	example1.highlightAlt = "example1";
	example1.annotation = {
		figure: "recent",
		text: `${format(example1.date, "M/d/y")}`,
		type: "temp",
		color: "primary"
	};

	const example2 = withFake.find(d => d.rank === 1 && d.exampleDay);
	example2.highlightAlt = "example2";
	example2.annotation = {
		figure: "recent",
		text: `${format(example2.date, "M/d/y")} was an historic record at the time`,
		type: "arrow",
		color: "secondary"
	};


	withFake.sort((a, b) => ascending(a.highlight ? 1 : 0, b.highlight ? 1 : 0) || ascending(a.recent ? 1 : 0, b.recent ? 1 : 0) || ascending(a.rank, b.rank));
	// keep only recent days or ranked ones, trash the rest
	const rawData = withFake.filter(d => d.recentDay || d.exampleDay || d.rank < 5);

	// generate custom text injections
	const custom = [];

	custom["year-yesterday-top"] = format(latestTop.date, "y");

	custom["temp-yesterday-top"] = `${latestTop.temp}°F`;

	custom["temp-yesterday"] = latest.rank === 0 ? "" : ` at ${latest.temp}°F`;

	custom["rank-yesterday"] = ordinal(latest.rank + 1);

	custom["date-yesterday"] = format(latest.date, "MMMM do");

	const oldest = min(rawData, d => d.date);

	custom["count-oldest"] = formatDistanceStrict(latest.date, oldest);

	custom["year-oldest"] = format(oldest, "y");

	const months = Math.round(threshold / 30);

	custom["timespan-recent"] = threshold < 40 ? "few weeks" : months < 3 ? "couple months" : "few months";

	custom["fulldate-recent"] = format(hot.date, "MMMM d, y");

	custom["rank-recent"] = ordinal(hot.rank + 1);

	custom["date-recent"] = format(hot.date, "MMMM do");

	custom["temp-alltime"] = `${alltime.temp}°F`;

	custom["year-alltime"] = format(alltime.date, "y");

	custom["fulldate-record"] = format(record.date, "MMMM d, y");

	custom["date-record"] = format(record.date, "MMMM do");

	custom["duration-record"] = latest.daysSinceNow === record.daysSinceNow ? "yesterday" : formatDistanceStrict(latest.date, record.date);

	custom["temp-record"] = `${record.temp}°F`;

	custom["count-record5"] = "Five";

	const record5 = rawData.filter(d => d.highlight === "record5");
	custom["year-record5"] = format(record5[record5.length - 1].date, "y");

	custom["date-example1"] = format(example1.date, "MMMM do");
	custom["year-example1"] = format(example1.date, "y");

	custom["fulldate-example2"] = format(example2.date, "MMMM d, y");
	custom["duration-example2"] = formatDistanceStrict(example1.date, example2.date);
	custom["year-example2"] = format(example2.date, "y");

	return { rawData, threshold, custom };
}
