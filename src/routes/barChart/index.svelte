<script lang="ts">
	import { BarChart } from '@src/components/barChart';

	type info = {
		year: number;
		birthrate: number;
	};

	type pad = {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};

	type barChart = {
		// x: number;
		// // y: number;
		bar: info[{}];
		padding?: pad;
		width?: number;
		height?: number;
		id?: string;
		color?: string;
	};
</script>

<svelte:body />
<BarChart />
