import { FSM } from '../src/FSM';

describe('Finite State Machine', () => {
  it('should be initializable with states', () => {
    // Arrange
    const anFSM = new FSM();
    // Action
    anFSM.addState('on');
    // Assert
    expect(anFSM).toBeDefined();
  });
  it('should report current state as first state added', () => {
    // Arrange
    const firstState = 'on';
    const anFSM = new FSM();
    // Action
    anFSM.addState(firstState);
    // Assert
    expect(anFSM.getCurrentState()).toEqual(firstState);
  });
  it('should allow multiple states, and stay the same when adding a state', () => {
    // Arrange
    const firstState = 'on';
    const anFSM = new FSM();
    // Action
    anFSM.addState(firstState);
    anFSM.addState('off');
    // Assert
    expect(anFSM.getCurrentState()).toEqual(firstState);
  });
  it('should allow transitioning between states', () => {
    // Arrange
    const anFSM = new FSM();
    // Action
    anFSM.addState('on');
    anFSM.addState('off');
    anFSM.on({inputName: 'toggle'}, function(){
      return new Map([
        ['on','off'],
        ['off', 'on'],
      ])
    })
    const { dispatch } = anFSM;
    // Action
    dispatch({inputName: 'toggle'});
    // Assert
    expect(anFSM.getCurrentState()).toEqual('off');
  });
  it('allow states to have attached variables', () => {
    // Arrange
    const fuse = new FSM();
    // Action
    fuse.addState('closed');
    fuse.addState('open');
    fuse.on({inputName: 'powerSurge'}, function(payload){
      if (payload > 100) {
        return new Map([
          ['closed', 'open'],
          ['open', 'open'],
        ]);
      }
      return new Map([
        ['closed', 'closed'],
        ['open', 'open'],
      ])
    })
    const { dispatch } = fuse;
    // Action
    dispatch({inputName: 'powerSurge', payload: 99});
    // Assert
    expect(fuse.getCurrentState()).toEqual('closed');
    // Action
    dispatch({inputName: 'powerSurge', payload: 99});
    // Assert
    expect(fuse.getCurrentState()).toEqual('closed');
    // Action
    dispatch({inputName: 'powerSurge', payload: 101});
    // Assert
    expect(fuse.getCurrentState()).toEqual('open');
    // Action
    dispatch({inputName: 'powerSurge', payload: 99});
    // Assert
    expect(fuse.getCurrentState()).toEqual('open');
  });
});
