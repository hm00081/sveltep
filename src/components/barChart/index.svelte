<!-- <script lang="ts">
	type barChart = {
		width: number;
		height: number;
		id: string;
		color: string;
	};

	export let bar: barChart[];
</script>

<div class="barchart">
	<div>Worldwide Number of Electric Cars</div>
	<svg class="chart" width="500px" height="500px" fill="blue">
		{#each bar as bars}
			<div>hello</div>
			<rect class="bar" width={bars.width} height={bars.height} fill={bars.color} />
		{/each}
	</svg>
</div>

<style lang="scss">
	.barchart {
		width: 100%;
		height: 100%;
		// background: pink;
	}
	// #display {
	// }
</style> -->

<script lang="ts">
	import { scaleLinear } from 'd3-scale';

	const bar = [
		{ year: 2012, birthrate: 0.5 },
		{ year: 2013, birthrate: 1 },
		{ year: 2014, birthrate: 1.5 },
		{ year: 2015, birthrate: 2 },
		{ year: 2016, birthrate: 2.5 },
		{ year: 2017, birthrate: 3 },
		{ year: 2018, birthrate: 3.5 },
		{ year: 2019, birthrate: 4 }
	];

	const xTicks = [1990, 1995, 2000, 2005, 2010, 2015];
	const yTicks = ["0.0", "0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"];
	const padding = { top: 20, right: 150, bottom: 20, left: 25 };
   
	let width = 500;
	let height = 400;

	$: xScale = scaleLinear()
		.domain([0, xTicks.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
	//@ts-ignore
		.domain([0, Math.max.apply(null, yTicks)])
		.range([height - padding.bottom, padding.top]);

	$: innerWidth = width - (padding.left + padding.right);
	$: barWidth = innerWidth / xTicks.length;
</script>

<h2>Worldwide Number of Electric Cars</h2>

<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg>
		<!-- y axis -->
		<g class="axis y-axis">
			{#each yTicks as tick}
				<g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
					<line x2="100%" />
					<text y="1" x="-1">{tick} {tick === 20 ? ' per 1,000 population' : ''}</text>
				</g>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each bar as point, i}
				<g class="tick" transform="translate({xScale(i)},{height})">
					<text x={barWidth / 2} y="-4">{width > 380 ? point.year : formatMobile(point.year)}</text>
				</g>
			{/each}
		</g>

		<g class="bars">
			{#each bar as point, i}
				<rect
					x={(xScale(i) + 2	)}
					y={yScale(point.birthrate)}
					width={barWidth - 4}
					height={yScale(0) - yScale(point.birthrate)}
				/>
			{/each}
		</g>
	</svg>
</div>

<style>
	h2 {
		text-align: center;
	}

	.chart {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	svg {
		position: relative;
		width: 100%;
		height: 200px;
	}

	.tick {
		font-family: Helvetica, Arial;
		font-size: 0.725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #e2e2e2;
		stroke-dasharray: 2;
	}

	.tick text {
		fill: black;
		text-anchor: start;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}

	.x-axis .tick text {
		text-anchor: middle;
	}

	.bars rect {
		fill: green;
/* fill: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%); */
		stroke: none;
		opacity: 0.65;
	}
</style>
