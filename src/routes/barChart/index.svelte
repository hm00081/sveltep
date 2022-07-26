<script lang="ts">
	import { BarChart } from '@src/components/barChart';

    type info = {
	    year: number;
	    birthrate: number;
    }

	type pad = {
        top: number;
		right: number;
		bottom: number;
		left: number;
	}

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
    
	const barInfo: info[] = [
		{year: 2012, birthrate: 0.5},
		{year: 2013, birthrate: 0.5},
		{year: 2014, birthrate: 0.5},
		{year: 2015, birthrate: 0.5},
		{year: 2016, birthrate: 0.5},
		{year: 2017, birthrate: 0.5},
		{year: 2018, birthrate: 0.5},
		{year: 2019, birthrate: 0.5},
			];
</script>

<svelte:body />
<BarChart {barInfo} />
