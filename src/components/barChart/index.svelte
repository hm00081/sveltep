<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	//color Change
	function handleClick() {
		let x = document.querySelector('svg');
		let r = Math.round(Math.random(255) * 255);
		let g = Math.round(Math.random(255) * 255);
		let b = Math.round(Math.random(255) * 255);
		let randomColor = `rgb(${r}, ${g}, ${b})`;
		//@ts-ignore
		x.style.backgroundColor = randomColor;
		console.log(x.style.color);
	}
	type info = {
		x: number;
		y: number;
		z: number;
	};
	const barInfo: info[] = [];
	// console.log(barInfo.);
	const bar: info[] = [
		{ x: 35, y: 0.5, z: 1 },
		{ x: 35, y: 1, z: 1.5 },
		{ x: 35, y: 1.5, z: 2 },
		{ x: 35, y: 2, z: 2.5 },
		{ x: 35, y: 2.5, z: 3 },
		{ x: 35, y: 3, z: 3.5 },
		{ x: 35, y: 3.5, z: 4 },
		{ x: 35, y: 4, z: 4 }
	];

	const xPoint: number[] = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019];
	const yPoint: string[] = [
		'0.0',
		'0.5',
		'1.0',
		'1.5',
		'2.0',
		'2.5',
		'3.0',
		'3.5',
		'4.0',
		'4.5',
		'5.0'
	];
	const padding = { top: 20, right: 10, bottom: 20, left: 100 };
	const color: string = 'rgb(50,200,0)';

	let width = 1;
	let height = 1;

	$: xScale = scaleLinear()
		.domain([0, bar.length])
		.range([padding.left, width - padding.right]);

	$: yScale = scaleLinear()
		//@ts-ignore
		.domain([0, Math.max.apply(null, yPoint)])
		.range([height - padding.bottom, padding.top]);

	const barWidth = 40;
</script>

<!-- //TODO Input Data : number[] 요구사항 : 1) data로 전달 받는 number[]를 BarChart형태로 구현한다. 2)
data로 넘겨 받는 수의 min, max, length는 제약이 없다. 3) number[]의 최소 , 최대를 계산하여 chart의
legend를 구현한다 4) Title 이외 Chart에 필요한 Prop을 정의하고 화면에 출력 할 수 있게 한다. Option :
1) Color -> Property로 색상을 전달 받아 BarChart의 색상을 지정 할 수 있게 한다. 2) Min -> Max 에
따라 Gradient 로 색상을 적용해본다 3) 가로축 legend를 구현할 수 있는 방법을 고민해 본다 -->

<h2 class="title">Worldwide Number of Electric Cars</h2>
<!-- <button class="btn" on:click={handleClick}>Color change</button> -->
<div class="chart-title">Hello World</div>
<div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<svg class="svg-chart">
		<g class="bars">
			{#each bar as point, i}
				<rect
					id="rect"
					x={xScale(i) + 2}
					y={yScale(point.y)}
					width={point.x}
					height={yScale(0) - yScale(point.y)}
					fill={color}
				>
					<title>bar graph</title>
				</rect>
				<line
					x1={xScale(i) + 2 + barWidth / 2}
					y1={yScale(point.y)}
					x2={i !== bar.length - 1
						? xScale(i + 1) + 2 + barWidth / 2
						: xScale(i) + 2 + barWidth / 2}
					y2={yScale(point.z)}
					stroke="red"
				/>
				<rect
					class="circle"
					x={xScale(i) + barWidth / 2 - 2}
					y={yScale(point.y) - 1}
					width="5"
					height="5"
					fill="red"
				/>
			{/each}
			<!-- y axis -->

			<g class="y-axis">
				{#each yPoint as tick}
					<g class="tick" transform="translate(0, {yScale(tick)})">
						<line x2="100%" />
						<text y="1" x="1">{tick}</text>
					</g>
				{/each}
			</g>

			<!-- x axis -->
			<g class="x-axis">
				{#each xPoint as point, i}
					<g class="tick" transform="translate({xScale(i)},{height})">
						<text x={barWidth / 2} y="-4">{point}</text>
					</g>
				{/each}
			</g>
		</g>
	</svg>
</div>

<style lang="scss">
	.title {
		// font-size: 15px;
		background: yellow;
		// text-align: left;
	}
	.chart-title {
		background: skyblue;
	}

	.btn {
		text-align: justify;
		position: relative;
	}
	.circle {
		border-radius: 100px;
	}

	.chart {
		width: 100%;
		height: 600px;
		.svg-chart {
			width: 100%;
			min-height: 100%;
		}
	}

	svg {
		width: 75%;
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

	.y-axis .tick text {
		font-weight: 800;
	}

	.x-axis .tick text {
		font-weight: 800;
		text-anchor: middle;
	}

	.bars rect {
		stroke: none;
		opacity: 0.8;
	}
</style>
