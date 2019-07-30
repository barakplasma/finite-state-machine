import { FSM } from '../src/FSM';

describe('Finite State Machine', () => {
  it('should be initializable with states', () => {
    // Arrange
    const anFSM = new FSM(['on']);

    // Assert
    expect(anFSM).toBeDefined();
  })
  it('should have a current state on initialization', () => {
    // Arrange
    const firstState = 'on'
    const anFSM = new FSM([firstState]);

    // Assert
    expect(anFSM.getCurrentState()).toEqual(firstState);
  })
})
