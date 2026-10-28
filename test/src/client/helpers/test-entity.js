import chai from 'chai';
import {getRelationshipTargetByTypeId} from '../../../../src/client/helpers/entity';

const {expect} = chai;

describe('getRelationshipTargetByTypeId', () => {
	it('should return empty array when entity has no relationships', () => {
		expect(getRelationshipTargetByTypeId({}, 10)).to.deep.equal([]);
		expect(getRelationshipTargetByTypeId({relationships: null}, 10)).to.deep.equal([]);
	});

	it('should filter relationships by relationshipTypeId', () => {
		const entity = {
			relationships: [
				{
					relationshipType: {id: 10},
					target: {bbid: 'target-1', name: 'Work 1'}
				},
				{
					relationshipType: {id: 8},
					target: {bbid: 'target-2', name: 'Author 1'}
				},
				{
					target: {bbid: 'target-3', name: 'Work 2'},
					typeId: 10
				}
			]
		};

		const result = getRelationshipTargetByTypeId(entity, 10);
		expect(result.length).to.equal(2);
		expect(result[0].bbid).to.equal('target-1');
		expect(result[1].bbid).to.equal('target-3');
	});

	it('should preserve position, page, and number attributes on the target object', () => {
		const entity = {
			relationships: [
				{
					number: 'IV',
					page: '42',
					position: '1',
					target: {bbid: 'work-1', name: 'Story 1'},
					typeId: 10
				}
			]
		};

		const result = getRelationshipTargetByTypeId(entity, 10);
		expect(result[0]).to.deep.include({
			bbid: 'work-1',
			displayNumber: true,
			name: 'Story 1',
			number: 'IV',
			page: '42',
			position: '1'
		});
	});

	it('should default number to position when number is absent', () => {
		const entity = {
			relationships: [
				{
					page: 'ix',
					position: '3',
					target: {bbid: 'work-3', name: 'Story 3'},
					typeId: 10
				}
			]
		};

		const result = getRelationshipTargetByTypeId(entity, 10);
		expect(result[0].displayNumber).to.be.true;
		expect(result[0].number).to.equal('3');
		expect(result[0].position).to.equal('3');
		expect(result[0].page).to.equal('ix');
	});

	it('should set displayNumber to false when neither position nor number is present', () => {
		const entity = {
			relationships: [
				{
					page: '5',
					target: {bbid: 'work-1', name: 'Story 1'},
					typeId: 10
				}
			]
		};

		const result = getRelationshipTargetByTypeId(entity, 10);
		expect(result[0].displayNumber).to.be.false;
		expect(result[0].page).to.equal('5');
	});

	it('should naturally sort targets by position (including multi-digit numbers)', () => {
		const entity = {
			relationships: [
				{
					position: '10',
					target: {bbid: 'work-10', name: 'Chapter 10'},
					typeId: 10
				},
				{
					position: '2',
					target: {bbid: 'work-2', name: 'Chapter 2'},
					typeId: 10
				},
				{
					position: '1',
					target: {bbid: 'work-1', name: 'Chapter 1'},
					typeId: 10
				}
			]
		};

		const result = getRelationshipTargetByTypeId(entity, 10);
		const positions = result.map((w) => w.position);
		expect(positions).to.deep.equal(['1', '2', '10']);
	});
});
