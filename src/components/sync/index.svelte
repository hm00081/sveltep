<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { updateData, priceData, type PriceUnit } from './sync';
	import _ from 'lodash';
	import * as d3 from 'd3';

	let value: number = 7;
	let minV: number;
	let maxV: number;
	let prices: [number, number][] = [];
	let path: string | null = '';
	let eleContainerWidth: number;
	let eleContainerHeight: number;
	let diff: number;

	onMount(() => {
		updateData(value);
	});
	const line = d3
		.line<[number, number]>()
		.x((d) => (d[0] * eleContainerWidth) / prices.length)
		.y((d) => d[1] * 20000 + 100)
		.curve(d3.curveBasis);
	// min -> 0
	// max -> height
	//@ts-ignore
	// console.log(minV);
	$: {
		prices = _($priceData)
			.map((d, i) => [i, d.price] as [number, number])
			.take(100)
			.value();
		//@ts-ignore
		path = line(prices);
		console.warn('path', path);
		// console.log(prices); // 가격 정보 잘 나옴
	}

	$: {
		console.log(eleContainerWidth, eleContainerHeight);
	}
	//onDestroy(() => {})

	const columns = [
		{
			key: 'name',
			header: 'Name',
			//@ts-ignore
			value: (v: string | number) => v.name,
			sortable: true
		},
		{
			key: 'timestamp',
			header: 'Timestamp',
			//@ts-ignore
			value: (v: string | number) => v.timestamp,
			sortable: true
		},
		{
			key: 'price',
			header: 'Price',
			value: (v: string | number) => v,
			sortable: true
		},
		{
			key: 'marketCap',
			header: 'MarketCap',
			value: (v: string | number) => v,
			sortable: true
		},
		{
			key: 'dayVolume',
			header: 'DayVolume',
			value: (v: string | number) => v,
			sortable: true
		}
	];
</script>

<div class="root">
	<div class="select" style="display: flex; gap: 10px;">
		<div>Select Option</div>
		<select name="select" class="order" bind:value on:change={() => updateData(value)}>
			<!-- for sort -->
			<option value="7">7</option>
			<option value="30">30</option>
			<option value="90">90</option>
			<option value="180">180</option>
			<option value="360">360</option>
		</select>
	</div>
	<div
		class="svg-container"
		style="width:100%; height:500px"
		bind:clientWidth={eleContainerWidth}
		bind:clientHeight={eleContainerHeight}
	>
		<svg style="width: 100%; height: 100%">
			<path d={path} stroke="#000" fill="none" stroke-width="1px" />
		</svg>
	</div>
	<h2>Data Length: {$priceData.length}</h2>
	<div class="table">
		<table>
			<tr class="header">
				<th>{columns[0].header}</th>
				<th>{columns[1].header}</th>
				<th>{columns[2].header}</th>
				<th>{columns[3].header}</th>
				<th>{columns[4].header}</th>
			</tr>
			{#each $priceData as price}
				<tr class="item">
					<td>{price.denom}</td>
					<td>{price.timestamp}</td>
					<td>{price.price}</td>
					<td>{price.marketCap}</td>
					<td>{price.dayVolume}</td>
				</tr>
			{/each}
		</table>
	</div>
</div>

<style lang="scss">
	.root {
		position: relative;
		.table {
			overflow: auto;
			border-spacing: 0;
			width: 56vw;
			height: 600px;
			justify-content: center;
			text-align: center;

			.header {
				position: sticky;
				top: 0;
				padding: 1.5rem 1.25rem;
				border-bottom: 1px solid #f0f2fa;
			}
			.header:first-child {
				left: 0;
				z-index: 1;
				border-right: 1px solid #f0f2fa;
			}
			.item {
				margin: 0;
				padding: 1.25rem;
				vertical-align: top;
				text-align: inherit;
				font-size: 0.9rem;
				max-width: 20%;
				background-color: #ffffff;
			}

			.item:first-child {
				position: sticky;
				left: 0;
				top: auto;
				width: 6rem;
				border-right: 1px solid #f0f2fa;
			}
		}
	}
	th,
	td {
		padding: 5px 20px;
	}
	th {
		background: purple;
		color: #fff;
	}

	td {
		border-right: 1px solid gray;
		border-bottom: 1px solid gray;
	}
	td:first-child {
		border-left: 1px solid gray;
	}
	tr:nth-child(even) td {
		background: #f1efef;
	}
</style>
