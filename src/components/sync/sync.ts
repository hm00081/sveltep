import axios from 'axios';
import _ from 'lodash';
import { writable } from 'svelte/store';

export interface PriceUnit {
	denom: string;
	timestamp: number;
	price: number;
	marketCap: number;
	dayVolume: number;
}

export const priceData = writable<PriceUnit[]>([]);

// 네트워크 요청.
function getUrl(days: number) {
	return `https://dashboard-mintscan.s3.ap-northeast-2.amazonaws.com/research/market/${days}.csv`;
}

export async function updateData(days: number) {
	const data = (await axios.get<string>(getUrl(days))).data;
	// console.log(data);

	const prices = _(data.split('\n'))
		.drop(1)
		.map((l) => {
			const eles = l.split(',');
			return {
				denom: eles[0],
				timestamp: Number(eles[1]),
				price: Number(eles[2]),
				marketCap: Number(eles[3]),
				dayVolume: Number(eles[4])
			} as PriceUnit;
		})
		.value();
	priceData.set(prices);
}

// [[Prototype]]: Promise
// [[PromiseState]]: "fulfilled"
// [[PromiseResult]]: undefined
