import { ascending } from "d3";

export default function getExtentOverlay(data) {
	const recent = data.filter((d) => d.recent);
	recent.sort((a, b) => ascending(a.fakeDay, b.fakeDay));
	const t = recent[0].day;
	const end = recent[recent.length - 1].day;
	const start = t > end ? end - recent.length + 1 : t;
	return [start, end];
};