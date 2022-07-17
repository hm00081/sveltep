<script lang="ts">
	import { Button } from '@src/components/button';

	type buttonType = {
		value: string;
		func: (e: Event) => void;
		id: string;
	};

	let totalArr: number[] | string[] = [];
	let total: number = 0;
	let errorMessage: string = '';
	let clearSet: boolean = false;
	let a: number = 0;
	let b: number = 1;

	// @ts-ignore
	$: lastIsNumber = totalArr[totalArr.length - 1] && !isNaN(totalArr[totalArr.length - 1]);
	$: if (total > Number.MAX_VALUE || total < -Number.MAX_VALUE) {
		errorMessage = 'err';
		totalArr = [];
	}
	function calcMath(o: number) {
		const operations = {
			'+': function (x: number, y: number) {
				// @ts-ignore
				return (x + y).toPrecision(9) / 1;
			},
			'-': function (x: number, y: number) {
				// @ts-ignore
				return (x - y).toPrecision(9) / 1;
			},
			'*': function (x: number, y: number) {
				// @ts-ignore
				return (x - y).toPrecision(9) / 1;
			},
			'/': function (x: number, y: number) {
				// @ts-ignore
				return (x / y).toPrecision(9) / 1;
			}
		};
		if (totalArr[totalArr.length - 3] === 1) {
			totalArr = [total, o];
		}

		let l = totalArr.length;
		let prevOperand = totalArr[l - 3];
		if (l === 4) {
			// @ts-ignore
			total = operations[prevOperand](Number(totalArr[0]), Number(totalArr[2]));
		} else if (l > 5 && l % 2 === 0) {
			// @ts-ignore
			total = operations[prevOperand](Number(total), Number(totalArr[l - 2]));
		}
	}
	function handleNumber(e: Event) {
		clearSet = false;
		let input = e.target as HTMLElement;
		if (lastIsNumber) {
			if (
				// @ts-ignore
				totalArr[totalArr.length - 1].indexOf('.') === -1 &&
				totalArr[totalArr.length - 1] === '0'
			) {
				totalArr[totalArr.length - 1] = input.innerText as any;
			} else {
				// @ts-ignore
				totalArr[totalArr.length - 1] = (totalArr[totalArr.length - 1] + input.innerText) as any;
			}
		} else {
			if (totalArr[totalArr.length - 1] === '=') {
				handleAC();
			}
			// @ts-ignore
			totalArr.push(input.innerText as any);
		}

		if (totalArr.length === 1) {
			// @ts-ignore
			total = parseFloat(totalArr[0]);
		}

		totalArr = totalArr;
	}

	function handleOperand(e: Event) {
		let input = e.target as HTMLElement;
		if (totalArr.length && errorMessage !== 'err') {
			// @ts-ignore
			if (isNaN(totalArr[totalArr.length - 1])) {
				if (totalArr[totalArr.length - 1] === '=') {
					// @ts-ignore
					totalArr = [total, input.innerText as any];
				} else {
					// @ts-ignore
					totalArr[totalArr.length - 1] = input.innerText as any;
				}
			} else {
				// @ts-ignore
				totalArr.push(input.innerText as any);
				// @ts-ignore
				calcMath(input.innerText as any);
			}
		} else if (errorMessage === 'err') {
			total = 0;
			// @ts-ignore
			totalArr = ['0', input.innerText as any];
		} else {
			// @ts-ignore
			totalArr.push(total);
			// @ts-ignore
			totalArr.push(input.innerText as any);
		}
		totalArr = totalArr;
	}

	function handleEqual() {
		if (totalArr.length > 2) {
			if (totalArr[totalArr.length - 1] !== '=') {
				if (lastIsNumber) {
					// @ts-ignore
					totalArr.push(0);
				} else {
					totalArr[totalArr.length - 1] = '=';
				}
			} else {
				// @ts-ignore
				totalArr = [total, totalArr[totalArr.length - 3], totalArr[totalArr.length - 2], '='];
			}
			// @ts-ignore
			calcMath();
			totalArr = totalArr;
		}
	}

	function handleDecimal() {
		let last = totalArr[totalArr.length - 1];
		// @ts-ignore
		if (isNaN(last)) {
			if (last === '=') {
				handleAC();
			}
			// @ts-ignore
			totalArr.push('0.');
			if (errorMessage === 'err') {
				errorMessage = '0.';
			}
			totalArr = totalArr;
			// @ts-ignore
		} else if (last.indexOf('.') === -1) {
			// @ts-ignore
			totalArr[totalArr.length - 1] = totalArr[totalArr.length - 1] + '.';
		}
	}
	function handleAC() {
		totalArr = [];
		total = 0;
	}
	function handleNegative() {
		if (lastIsNumber) {
			// @ts-ignore
			totalArr[totalArr.length - 1] = 0 - totalArr[totalArr.length - 1];
			if (totalArr.length === 1) {
				// @ts-ignore
				total = totalArr[totalArr.length - 1];
			}
		} else if (totalArr[totalArr.length - 1] === '=') {
			total = 0 - total;
			totalArr = [total];
		}
	}

	function handleClear() {
		// @ts-ignore
		if (totalArr[totalArr.length - 1] === '=' || errorMessage === 'err') {
			clearSet = true;
		}
		if (clearSet) {
			clearSet = false;
			totalArr = [];
			total = 0;
		} else {
			clearSet = true;
			if (lastIsNumber) {
				totalArr.pop();
				totalArr = totalArr;
			}
		}
	}

	function handleKeypress(e: Event) {
		// @ts-ignore
		let k = { target: { innerText: e.key } };
		// @ts-ignore
		if (e.key === '*') {
			k.target.innerText = 'x';
		}
		// @ts-ignore
		if (!isNaN(e.key)) {
			// @ts-ignore
			handleNumber(k);
			// @ts-ignore
		} else if (['+', '-', '/', '*'].indexOf(e.key) > -1) {
			// @ts-ignore
			handleOperand(k);
		} else {
			// @ts-ignore
			switch (e.key) {
				case 'Enter':
					// @ts-ignore
					e.preventDefault();
					handleEqual();
					break;
				case 'Backspace':
					handleClear();
					break;
				case 'Delete':
					handleAC();
					break;
				case '.':
					handleDecimal();
					break;
			}
		}
	}

	const textNumbers: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
	const buttons: buttonType[] = [
		{
			value: 'ac',
			func: handleAC,
			id: 'ac'
		},
		{
			value: 'c',
			func: handleClear,
			id: 'clear'
		},
		{
			value: '+/-',
			func: handleNegative,
			id: 'neg'
		},
		{
			value: '/',
			func: handleOperand,
			id: 'divide'
		},
		{
			value: 'x',
			func: handleOperand,
			id: 'multiply'
		},
		{
			value: '-',
			func: handleOperand,
			id: 'minus'
		},
		{
			value: '1',
			func: handleNumber,
			id: 'seven'
		},
		{
			value: '2',
			func: handleNumber,
			id: 'eight'
		},
		{
			value: '3',
			func: handleNumber,
			id: 'nine'
		},
		{
			value: '+',
			func: handleOperand,
			id: 'add'
		},
		{
			value: '4',
			func: handleNumber,
			id: 'four'
		},
		{
			value: '5',
			func: handleNumber,
			id: 'five'
		},
		{
			value: '6',
			func: handleNumber,
			id: 'six'
		},
		{
			value: '7',
			func: handleNumber,
			id: 'one'
		},
		{
			value: '8',
			func: handleNumber,
			id: 'two'
		},
		{
			value: '9',
			func: handleNumber,
			id: 'three'
		},
		{
			value: '=',
			func: handleEqual,
			id: 'equal'
		},
		{
			value: '0',
			func: handleNumber,
			id: 'zero'
		},
		{
			value: '.',
			func: handleDecimal,
			id: 'decimal'
		}
	];
</script>

<!-- <div class="frame">
	{#each textNumberss as text}
		<button id={text.id} on:click={text.func} color="orange">{text.value}</button>
	{/each}
</div> -->

<svelte:body on:keydown={handleKeypress} />

<Button {total} {buttons} {totalArr} />

<!-- <style lang="scss">
	.frame {
		width: 240px;
		display: flex;
		flex-wrap: wrap;
	}
</style> -->
