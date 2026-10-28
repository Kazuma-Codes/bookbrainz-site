import chai from 'chai';
import {transformFormData} from '../../../../../src/client/entity-editor/submission-section/actions';

const {expect} = chai;

describe('transformFormData', () => {
	it('should assign sequential position (1, 2, 3) and page attributes to contained works in an edition', () => {
		const inputData = {
			ISBN: {type: null, value: ''},
			Series: {},
			Works: {
				w0: {checked: false, id: 'work-bbid-1', name: 'Chapter 1', page: '1'},
				w1: {checked: false, id: 'work-bbid-2', name: 'Chapter 2', page: '45'},
				w2: {checked: false, id: 'work-bbid-3', name: 'Chapter 3', number: 'III', page: 'ix'}
			},
			identifierEditor: {},
			parentAuthorCredits: [],
			relationshipSection: {
				relationships: {}
			}
		};

		const result = transformFormData(inputData);
		const editionData = result.e0;
		expect(editionData).to.be.an('object');
		expect(editionData.type).to.equal('Edition');

		const relationships = editionData.relationshipSection.relationships;
		expect(relationships).to.be.an('object');

		// Check Work 1 relationship
		const rel0 = relationships.w0;
		expect(rel0.relationshipType.id).to.equal(10);
		expect(rel0.targetEntity.bbid).to.equal('work-bbid-1');
		expect(rel0.attributes).to.deep.equal([
			{attributeType: 1, value: {textValue: '1'}},
			{attributeType: 3, value: {textValue: '1'}}
		]);

		// Check Work 2 relationship
		const rel1 = relationships.w1;
		expect(rel1.relationshipType.id).to.equal(10);
		expect(rel1.targetEntity.bbid).to.equal('work-bbid-2');
		expect(rel1.attributes).to.deep.equal([
			{attributeType: 1, value: {textValue: '2'}},
			{attributeType: 3, value: {textValue: '45'}}
		]);

		// Check Work 3 relationship
		const rel2 = relationships.w2;
		expect(rel2.relationshipType.id).to.equal(10);
		expect(rel2.targetEntity.bbid).to.equal('work-bbid-3');
		expect(rel2.attributes).to.deep.equal([
			{attributeType: 1, value: {textValue: '3'}},
			{attributeType: 3, value: {textValue: 'ix'}},
			{attributeType: 2, value: {textValue: 'III'}}
		]);
	});

	it('should handle works without page attribute', () => {
		const inputData = {
			ISBN: {type: null, value: ''},
			Series: {},
			Works: {
				w0: {checked: false, id: 'work-bbid-1', name: 'Standalone Story'}
			},
			identifierEditor: {},
			parentAuthorCredits: [],
			relationshipSection: {
				relationships: {}
			}
		};

		const result = transformFormData(inputData);
		const rel0 = result.e0.relationshipSection.relationships.w0;
		expect(rel0.relationshipType.id).to.equal(10);
		expect(rel0.attributes).to.deep.equal([
			{attributeType: 1, value: {textValue: '1'}}
		]);
	});
});
