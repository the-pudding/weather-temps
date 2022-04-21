import { ascending } from "d3";
import raw from "$data/test.json";

/*
		"year": "1872",
		"recordsPerYear": [
			{
				"year": "1872",
				"records": [
					*/

const clean = raw.map(d => {
	return d.recordsPerYear.map(y => {
		const year = +d.year;
		const yearsAgo = year - +y.year;
		const count = +y.records[0];
		return { year, yearsAgo, count };
	});
});

export default clean;