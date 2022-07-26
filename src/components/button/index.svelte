<script lang="ts">
	export let text: string;
	// export let color: 'orange' | 'grey' | 'dark-grey';
	type buttonType = {
		value: string;
		func: () => void;
		id: string;
	};
	export let total: number;
	export let errorMessage: string = '';
	export let totalArr: string[] | number[] = [];
	export let calcButtons: buttonType[];
</script>

<div class="calculator">
	<div id="display">
		{#if errorMessage !== 'err'}
			<div>
				<div class="top">{totalArr.join(' ')}</div>
			</div>
			<div>
				<div class="bottom">{total}</div>
			</div>
		{:else}
			<div>{total}</div>
		{/if}
	</div>
	{#each calcButtons as button}
		<button id={button.id} on:click={button.func}>{button.value}</button>
	{/each}
</div>

<style lang="scss">
	.calculator {
		display: grid;
		// grid-template-columns: 24% 24% 24% 24%;
		grid-gap: 2px;
		color: #4c4c4c;
		border: solid 0.2px #4c4c4c;
		border-radius: 2px;
		width: 300px;

		padding: 4px;
		background-color: #4c4c4c;
		cursor: pointer;
		user-select: none;
	}

	#display {
		grid-column: 1 / span 4;
		height: 60px;
		border: solid 1px #4c4c4c;
		background-color: #4c4c4c;
		border-radius: 2px;
		cursor: initial;
		padding: 0 5px;
		background: #4c4c4c;
	}

	#display > div {
		text-align: right;
		box-sizing: border-box;
		height: 45%;
		width: 100%;
		font-size: 24px;
		margin-left: auto;
		text-align: right;
		overflow: hidden;
		white-space: nowrap;
	}

	#display > div > div {
		float: right;
		font-weight: 300;
		color: white;
	}

	.top {
		font-size: 0.8em;
		line-height: 150%;
	}

	.bottom {
		font-size: 1.2em;
		line-height: 100%;
	}

	button {
		// width: 72px;
		height: 55px;
		font-weight: 700;
		font-size: 1.35em;
	}

	#ac {
		grid-column: 1 / span 1;
	}

	#clear {
		grid-column: 2 / span 1;
	}
	#neg {
		grid-column: 3 / span 1;
	}
	#divide {
		grid-row: 2;
		grid-column: 4 / span 1;
		background-color: #f69230;
		border-color: #f69230;
		color: white;
	}
	#multiply {
		grid-row: 3;
		grid-column: 4 / span 1;
		background-color: #f69230;
		border-color: #f69230;
		color: white;
	}
	#minus {
		grid-row: 4;
		grid-column: 4 / span 1;
		background-color: #f69230;
		border-color: #f69230;
		color: white;
	}
	#add {
		height: initial;
		grid-column: 4;
		grid-row: 5 / span 1;
		background-color: #f69230;
		border-color: #f69230;
		color: white;
	}
	#decimal {
		grid-column: 3;
		grid-row: 6 / span 1;
	}
	#equal {
		height: initial;
		grid-column: 4;
		grid-row: 6 / span 1;
		background-color: #f69230;
		border-color: #f69230;
		color: white;
	}
	// #one {
	// 	grid-column: 4;
	// 	grid-row: 5 / span 1;
	// }
	#zero {
		grid-row: 6;
		grid-column: 1 / span 2;
	}
</style>
