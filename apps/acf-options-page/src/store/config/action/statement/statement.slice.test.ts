import { EActionConditionOperator, EActionStatus, EErrorOptions, getDefaultActionCondition } from '@dhruv-techapps/acf-common';
import { describe, expect, it } from 'vitest';
import {
  actionStatementReducer,
  addActionStatementCondition,
  IActionStatementStore,
  removeActionStatementCondition,
  setActionStatementError,
  setActionStatementMessage,
  switchActionStatementModal,
  updateActionStatementCondition,
  updateActionStatementGoto,
  updateActionStatementOption
} from './statement.slice';

Object.defineProperty(window, 'dataLayer', { value: [], writable: true });
const initialState: IActionStatementStore = { visible: false, statement: {} };

describe('actionStatement slice', () => {
  it('should return initial state', () => {
    const state = actionStatementReducer(undefined, { type: '@@INIT' });
    expect(state.visible).toBe(false);
    expect(state.statement).toEqual({});
  });

  it('switchActionStatementModal should toggle visible', () => {
    let state = actionStatementReducer(initialState, switchActionStatementModal());
    expect(state.visible).toBe(true);
    state = actionStatementReducer(state, switchActionStatementModal());
    expect(state.visible).toBe(false);
  });

  it('addActionStatementCondition should add condition to empty statement', () => {
    const condition = getDefaultActionCondition(crypto.randomUUID());
    const state = actionStatementReducer(initialState, addActionStatementCondition(condition));
    expect(state.statement.conditions).toHaveLength(1);
    expect(state.statement.conditions![0].id).toBe(condition.id);
  });

  it('addActionStatementCondition should append to existing conditions', () => {
    const condition1 = getDefaultActionCondition(crypto.randomUUID());
    const condition2 = getDefaultActionCondition(crypto.randomUUID(), EActionConditionOperator.AND);
    let state = actionStatementReducer(initialState, addActionStatementCondition(condition1));
    state = actionStatementReducer(state, addActionStatementCondition(condition2));
    expect(state.statement.conditions).toHaveLength(2);
  });

  it('removeActionStatementCondition should remove condition by id', () => {
    const condition = getDefaultActionCondition(crypto.randomUUID());
    let state = actionStatementReducer(initialState, addActionStatementCondition(condition));
    state = actionStatementReducer(state, removeActionStatementCondition(condition.id));
    expect(state.statement.conditions).toHaveLength(0);
  });

  it('removeActionStatementCondition should set error when id not found', () => {
    const condition = getDefaultActionCondition(crypto.randomUUID());
    let state = actionStatementReducer(initialState, addActionStatementCondition(condition));
    state = actionStatementReducer(state, removeActionStatementCondition('nonexistent' as any));
    expect(state.error).toBe('Invalid Condition');
  });

  it('updateActionStatementCondition should update a condition field', () => {
    const condition = getDefaultActionCondition(crypto.randomUUID());
    let state = actionStatementReducer(initialState, addActionStatementCondition(condition));
    state = actionStatementReducer(state, updateActionStatementCondition({ id: condition.id, name: 'status', value: EActionStatus.SKIPPED }));
    expect(state.statement.conditions![0].status).toBe(EActionStatus.SKIPPED);
  });

  it('updateActionStatementCondition should set error when id not found', () => {
    const state = actionStatementReducer(initialState, updateActionStatementCondition({ id: 'bad' as any, name: 'status', value: EActionStatus.DONE }));
    expect(state.error).toBe('Invalid Condition');
  });

  it('updateActionStatementOption should set option', () => {
    const state = actionStatementReducer(initialState, updateActionStatementOption(EErrorOptions.SKIP));
    expect(state.statement.option).toBe(EErrorOptions.SKIP);
  });

  it('updateActionStatementGoto should set goto', () => {
    const state = actionStatementReducer(initialState, updateActionStatementGoto(3));
    expect(state.statement.goto).toBe(3);
  });

  it('setActionStatementMessage should set message and clear error', () => {
    const withError = { ...initialState, error: 'bad' };
    const state = actionStatementReducer(withError, setActionStatementMessage('done'));
    expect(state.message).toBe('done');
    expect(state.error).toBeUndefined();
  });

  it('setActionStatementError should set error and clear message', () => {
    const withMessage = { ...initialState, message: 'ok' };
    const state = actionStatementReducer(withMessage, setActionStatementError('fail'));
    expect(state.error).toBe('fail');
    expect(state.message).toBeUndefined();
  });
});
