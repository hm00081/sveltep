<script lang="ts">
	import { BarChart } from '@src/components/barChart';

	type barChart = {
		width: number;
		height: number;
		id: string | undefined;
		color: string;
	};

	// type dataa = {
	// 	items: number[];
	// };

	// const datas: dataa = {
	// 	items: [40, 23, 14, 55, 32, 60, 42, 12, 89, 43, 60, 53, 40, 55, 72]
	// };

	const bar: barChart[] = [
		{
			width: 3,
			height: 0.1,
			id: '2012',
			color: 'rgb(255,0,255)'
		},
		{
			width: 3,
			height: 0.2,
			id: '2013',
			color: 'rgb(255,0,255)'
		},
		{
			width: 3,
			height: 0.4,
			id: '2014',
			color: 'rgb(255,0,255)'
		},
		{
			width: 3,
			height: 0.7,
			id: '2015',
			color: 'rgb(255,0,255)'
		},
		{
			width: 3,
			height: 0.7,
			id: '2016',
			color: 'rgb(255,0,255)'
		}
	];
</script>

<svelte:body />
<BarChart {bar} />
