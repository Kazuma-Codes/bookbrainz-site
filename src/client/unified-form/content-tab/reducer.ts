import {ADD_SERIES, ADD_WORK, MOVE_WORK, REMOVE_SERIES, REMOVE_WORK, TOGGLE_COPY_AUTHOR_CREDITS, UPDATE_WORK, UPDATE_WORKS} from './action';
import {Action, State} from '../interface/type';
import {OrderedMap, fromJS} from 'immutable';


const initialState = OrderedMap<string, any>();

export function worksReducer(inputState = initialState, {type, payload}:Action):State {
	const state = OrderedMap.isOrderedMap(inputState) ? inputState : inputState.toOrderedMap();
	switch (type) {
		case ADD_WORK:
			return state.set(payload.id, fromJS(payload.value));
		case UPDATE_WORKS:
			return fromJS(payload);
		case REMOVE_WORK:
			return state.delete(payload);
		case UPDATE_WORK:
			return state.set(payload.id, fromJS(payload.value));
		case MOVE_WORK: {
			const entries = state.entrySeq().toArray();
			const index = entries.findIndex(([key]) => key === payload.id);
			if (index === -1) {
				return state;
			}
			const targetIndex = payload.direction === 'up' ? index - 1 : index + 1;
			if (targetIndex < 0 || targetIndex >= entries.length) {
				return state;
			}
			const item = entries.splice(index, 1)[0];
			entries.splice(targetIndex, 0, item);
			return OrderedMap(entries);
		}
		case TOGGLE_COPY_AUTHOR_CREDITS:
			return state.setIn([payload, 'checked'], !state.getIn([payload, 'checked']));
		default:
			return state;
	}
}

export function seriesReducer(state = initialState, {type, payload}:Action):State {
	switch (type) {
		case ADD_SERIES:
			return state.set(payload.id, fromJS(payload.value));
		case REMOVE_SERIES:
			return state.delete(payload);
		default:
			return state;
	}
}
