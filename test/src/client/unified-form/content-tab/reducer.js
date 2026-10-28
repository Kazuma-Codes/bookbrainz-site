/* eslint-disable no-undefined */
import {
	ADD_WORK,
	MOVE_WORK,
	REMOVE_WORK,
	UPDATE_WORK,
	moveWork
} from '../../../../../src/client/unified-form/content-tab/action';
import {OrderedMap, fromJS} from 'immutable';
import chai from 'chai';
import {worksReducer} from '../../../../../src/client/unified-form/content-tab/reducer';

const {expect} = chai;

describe('worksReducer', () => {
	it('should return initial state when state is undefined', () => {
		const state = worksReducer(undefined, {type: 'UNKNOWN'});
		expect(OrderedMap.isOrderedMap(state)).to.be.true;
		expect(state.size).to.equal(0);
	});

	it('should add a work to the state', () => {
		const work = {checked: true, id: 'w1', name: 'Work 1', page: '10'};
		const state = worksReducer(OrderedMap(), {
			payload: {id: 'w1', value: work},
			type: ADD_WORK
		});
		expect(state.size).to.equal(1);
		expect(state.get('w1').toJS()).to.deep.equal(work);
	});

	it('should update a work in the state', () => {
		const work = {checked: true, id: 'w1', name: 'Work 1', page: '10'};
		const initialState = OrderedMap([['w1', fromJS(work)]]);
		const updatedWork = {...work, page: '15'};
		const state = worksReducer(initialState, {
			payload: {id: 'w1', value: updatedWork},
			type: UPDATE_WORK
		});
		expect(state.getIn(['w1', 'page'])).to.equal('15');
	});

	it('should remove a work from the state', () => {
		const initialState = OrderedMap([
			['w1', fromJS({id: 'w1'})],
			['w2', fromJS({id: 'w2'})]
		]);
		const state = worksReducer(initialState, {
			payload: 'w1',
			type: REMOVE_WORK
		});
		expect(state.size).to.equal(1);
		expect(state.has('w1')).to.be.false;
		expect(state.has('w2')).to.be.true;
	});

	it('should reorder works correctly when moving a work down', () => {
		const initialState = OrderedMap([
			['w1', fromJS({id: 'w1', name: 'Work 1'})],
			['w2', fromJS({id: 'w2', name: 'Work 2'})],
			['w3', fromJS({id: 'w3', name: 'Work 3'})]
		]);
		const state = worksReducer(initialState, moveWork('w1', 'down'));
		expect(state.keySeq().toArray()).to.deep.equal(['w2', 'w1', 'w3']);
	});

	it('should reorder works correctly when moving a work up', () => {
		const initialState = OrderedMap([
			['w1', fromJS({id: 'w1', name: 'Work 1'})],
			['w2', fromJS({id: 'w2', name: 'Work 2'})],
			['w3', fromJS({id: 'w3', name: 'Work 3'})]
		]);
		const state = worksReducer(initialState, moveWork('w3', 'up'));
		expect(state.keySeq().toArray()).to.deep.equal(['w1', 'w3', 'w2']);
	});

	it('should not change order when moving the first work up', () => {
		const initialState = OrderedMap([
			['w1', fromJS({id: 'w1'})],
			['w2', fromJS({id: 'w2'})]
		]);
		const state = worksReducer(initialState, moveWork('w1', 'up'));
		expect(state.keySeq().toArray()).to.deep.equal(['w1', 'w2']);
	});

	it('should not change order when moving the last work down', () => {
		const initialState = OrderedMap([
			['w1', fromJS({id: 'w1'})],
			['w2', fromJS({id: 'w2'})]
		]);
		const state = worksReducer(initialState, moveWork('w2', 'down'));
		expect(state.keySeq().toArray()).to.deep.equal(['w1', 'w2']);
	});

	it('should return unchanged state when work id is not found', () => {
		const initialState = OrderedMap([
			['w1', fromJS({id: 'w1'})]
		]);
		const state = worksReducer(initialState, moveWork('non-existent', 'up'));
		expect(state.keySeq().toArray()).to.deep.equal(['w1']);
	});
});
