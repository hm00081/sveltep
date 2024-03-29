/* eslint-disable no-unused-vars */
import { CHANGE_STANDARD_SIMILARITY_SCORE } from '../actionTypes';
import { Reducer } from 'redux';
import { writable } from 'svelte/store';
import { ChangeStandardSimilarityScoreAction } from '../actions';
// import { maxSimilarityScore } from "../../views/ConceptualRecurrencePlot/DataStructureMaker";

export interface StandardSimilarityScoreState {
	standardSimilarityScore: number;
}
const initialState: StandardSimilarityScoreState = {
	// standardSimilarityScore: maxSimilarityScore,
	standardSimilarityScore: 100000
};

const standardSimilarityScoreReducer: Reducer<
	StandardSimilarityScoreState,
	ChangeStandardSimilarityScoreAction
> = (state = initialState, action: ChangeStandardSimilarityScoreAction) => {
	switch (action.type) {
		case CHANGE_STANDARD_SIMILARITY_SCORE: {
			return {
				...state,
				standardSimilarityScore: action.payload.standardSimilarityScore
			};
		}
		default:
			return state;
	}
};

export default standardSimilarityScoreReducer;
