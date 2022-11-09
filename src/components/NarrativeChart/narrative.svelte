<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { updateData, priceData, type PriceUnit } from '../sync/sync';
	import _, { result } from 'lodash';
	import * as d3 from 'd3';

	let value: number = 7;
	let chainName: string = 'acudos';
	let minV: number;
	let maxV: number;
	let prices: [number, number][] = [];
	let path: string | null = '';
	let eleContainerWidth: number;
	let eleContainerHeight: number;
	let diff: number;
	let results: PriceUnit[];
	let denomResult: string[] = ['acudos'];

	onMount(() => {
		updateData(value);
	});
	const line = d3
		.line<[number, number]>()
		//@ts-ignore
		.x((d) => d.x)
		//@ts-ignore
		.y((d) => d.y)
		.curve(d3.curveBasis);

	$: {
		prices = _($priceData)
			.map((d, i) => [i, d.price] as [number, number])
			.take(100)
			.value();
		//@ts-ignore
		path = line(prices);
		// console.log(prices); // 가격 정보 잘 나옴
		// console.log($priceData); // key값 다 있음
	}

	$: {
		results = _.uniqBy($priceData, 'denom');
		denomResult = results.map((row) => row.denom);
	}
</script>

<div class="root">
	<div class="select" style="display: flex; gap: 10px;">
		<div>Select Days</div>
		<select name="select" class="order" bind:value on:change={() => updateData(value)}>
			<!-- for sort -->
			<option value="7">7</option>
			<option value="30">30</option>
			<option value="90">90</option>
			<option value="180">180</option>
			<option value="360">360</option>
		</select>
	</div>
	<!-- 독립적인 기능 -->
	<div class="select" style="display: flex; gap: 10px;">
		<div>Select Chain</div>
		<select name="select" class="order" bind:value={denomResult} on:change={() => denomResult}>
			{#each denomResult as denom}
				<option value={denom}>{denom}</option>
			{/each}
		</select>
	</div>
	<div
		class="svg-container"
		style="width:100%; height:500px"
		bind:clientWidth={eleContainerWidth}
		bind:clientHeight={eleContainerHeight}
	>
		<svg style="width: 100%; height: 100%">
			<path d={path} stroke="red" fill="none" stroke-width="1px" />
		</svg>
	</div>
</div>

<style lang="scss">
	.root {
		// position: relative;
		// .table {
		// 	overflow: auto;
		// 	border-spacing: 0;
		// 	width: 56vw;
		// 	height: 600px;
		// 	justify-content: center;
		// 	text-align: center;

		// 	.header {
		// 		position: sticky;
		// 		top: 0;
		// 		padding: 1.5rem 1.25rem;
		// 		border-bottom: 1px solid #f0f2fa;
		// 	}
		// 	.header:first-child {
		// 		left: 0;
		// 		z-index: 1;
		// 		border-right: 1px solid #f0f2fa;
		// 	}
		// 	.item {
		// 		margin: 0;
		// 		padding: 1.25rem;
		// 		vertical-align: top;
		// 		text-align: inherit;
		// 		font-size: 0.9rem;
		// 		max-width: 20%;
		// 		background-color: #ffffff;
		// 	}

		// 	.item:first-child {
		// 		position: sticky;
		// 		left: 0;
		// 		top: auto;
		// 		width: 6rem;
		// 		border-right: 1px solid #f0f2fa;
		// 	}
		// }
	}
</style>
