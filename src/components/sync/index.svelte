<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { updateData, priceData, type PriceUnit } from './sync';
	import d3 from 'd3';
	import lodash from 'lodash';

	let value: number = 7;
	let prices: [number, number][] = []; 
	let path: string = '';

	onMount(() => {
		updateData(value);
	});
	const line = d3.line<[number,number]>().x((d) => d[0] * 10).y((d) => d[0] * 2000 + 200)
	.curve(d3.curveBasis);
	line([
		[0,0],
	    [0,0]
	])

	$: {
        prices = _($priceData)
		.map((d, i)=> [i, d.price] as [number, number]).take(100).value()
		//@ts-ignore
		path = line(prices);
        console.log(prices);
		);
	}

	$: {

	}

	//useEffect 데이터값이 재 호출 될시 함수를 다시 불러오는 기능.
	// 1 : axios를 이용해서 데이터를 불러온다
	// 2 : 불러온 데이터를 Table 구성한다
	// 3 : select를 이용해서 7 , 30 , 등 다양한 기준의 데이터를 확인 할 수 있게 한다.

	// Option :
	// - 정렬되는 테이블 Table 구현 (매우 어려움)
	// - 헤더는 내려오면 안됨 (스크롤을 하더라고, 테이블의 헤더는 상단에 고정)

	// 페이지 구성:
	// - 테이블 영역 스크롤 시 header 는 테이블 영역 top에 고정.

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
	<div class="svg-container">
		<svg>
			<path />
			<!-- 화면 비에 맞는 그래프 구성 -->
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
