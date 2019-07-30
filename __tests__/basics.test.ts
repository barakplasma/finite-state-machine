import { FSM } from '../src/FSM';

describe('Finite State Machine', () => {
  it('should be initializable with states', () => {
    // Arrange
    const anFSM = new FSM(['on']);
    
    // Assert
    expect(anFSM).toBeDefined();
  })
})
