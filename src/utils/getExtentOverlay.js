export default function getExtentOverlay(data) {
	const recent = data.filter((d) => d.recent);
	const end = recent[0].day;
	const a = recent[recent.length - 1].day;
	const start = a > end ? end - recent.length + 1 : a;
	return [start, end];
};