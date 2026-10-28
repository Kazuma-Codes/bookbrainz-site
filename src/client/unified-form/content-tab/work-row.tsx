import * as Bootstrap from 'react-bootstrap/';
import {WorkRowDispatchProps, WorkRowProps, WorkRowStateProps} from '../interface/type';
import {moveWork, removeWork, toggleCheck, updateWork} from './action';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import SearchEntityCreate from '../common/search-entity-create-select';
import {connect} from 'react-redux';
import {convertMapToObject} from '../../helpers/utils';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';


const {Row, Col, Button, FormCheck, ButtonGroup, Tooltip, OverlayTrigger, FormLabel} = Bootstrap;

function WorkRow({onChange, onMove, work, onRemove, onToggle, onCopyHandler, rowId, ...rest}:WorkRowProps) {
	const isChecked = work?.checked;
	const handleCopy = React.useCallback(() => onCopyHandler(rowId), [onCopyHandler, work]);
	const onChangeHandler = React.useCallback((value:any, action:any) => {
		if (['clear', 'remove-value', 'pop-value'].includes(action?.action)) {
			if (action.removedValue?.__isNew__) {
				onRemove();
			}
			onChange(null);
			return;
		}
		value.checked = isChecked;
		onChange(value);
	}, [isChecked, onChange, onRemove]);
	const onPageChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		onChange({...work, page: event.target.value});
	}, [onChange, work]);
	const handleMoveUp = React.useCallback(() => {
		onMove?.('up');
	}, [onMove]);
	const handleMoveDown = React.useCallback(() => {
		onMove?.('down');
	}, [onMove]);
	const checkToolTip = (
		<Tooltip id="work-check">This will set the book&apos;s Author Credits from the &lsquo;Cover&lsquo; tab as this Work&apos;s
	 Author
		</Tooltip>);
	const checkLabel = (
		<>
			<FormLabel className="font-weight-normal">
			Copy Authors from Author Credit
				<OverlayTrigger
					delay={50}
					overlay={checkToolTip}
				>
					<FontAwesomeIcon
						className="margin-left-0-5"
						icon={faInfoCircle}
					/>
				</OverlayTrigger>
			</FormLabel>
		</>);
	return (
		<div className="work-item">
			<Row>
				<Col lg={{span: 6}}>
					<SearchEntityCreate
						isClearable={false}
						recentlyUsedEntityType="Work"
						type="work"
						value={work}
						onChange={onChangeHandler}
						{...rest}
					/>
				</Col>
				<Col lg={{span: 2}}>
					<input
						className="form-control"
						placeholder="Page (e.g. 15, ix)"
						type="text"
						value={work?.page || ''}
						onChange={onPageChange}
					/>
				</Col>
				<Col lg={{span: 4}}>
					<ButtonGroup>
						<Button aria-label="Move up" size="sm" variant="outline-secondary" onClick={handleMoveUp}>↑</Button>
						<Button aria-label="Move down" size="sm" variant="outline-secondary" onClick={handleMoveDown}>↓</Button>
						<Button variant="primary" onClick={handleCopy as React.MouseEventHandler}>Duplicate</Button>
						<Button variant="danger" onClick={onRemove}>Remove</Button>
					</ButtonGroup>
				</Col>
			</Row>
			<FormCheck
				className="ml-1 mb-2"
				defaultChecked={isChecked}
				id={work.id}
				label={checkLabel}
				type="checkbox"
				onChange={onToggle}
			/>
		</div>
		 );
}

function mapStateToProps(state, {rowId}) {
	return {
		work: convertMapToObject(state.getIn(['Works', rowId]))
	};
}


function mapDispatchToProps(dispatch, {rowId}) {
	return {
		onChange: (value:any) => {
			if (value === null) {
				dispatch(removeWork(rowId));
				return;
			}
			dispatch(updateWork(rowId, value));
		},
		onMove: (direction:'up' | 'down') => dispatch(moveWork(rowId, direction)),
		onRemove: () => dispatch(removeWork(rowId)),
		onToggle: () => dispatch(toggleCheck(rowId))
	};
}

export default connect<WorkRowStateProps, WorkRowDispatchProps>(mapStateToProps, mapDispatchToProps)(WorkRow);
