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
  it('should not allow adding a transition to an unknown state', () => {
    // Arrange
    const anFSM = new FSM();
    // Action
    anFSM.addState('on');
    // we're missing the 'off' state
    const shouldThrow = () => anFSM.on({inputName: 'toggle'}, () => {
      return new Map([
        ['on','off'],
        ['off', 'on'],
      ])
    })
    // Assert
    expect(shouldThrow).toThrow('unknown state in transition handler')
  });
  it('should allow transitioning between states', () => {
    // Arrange
    const anFSM = new FSM();
    // Action
    anFSM.addState('on');
    anFSM.addState('off');
    anFSM.on({inputName: 'toggle'}, () => {
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
    fuse.on({inputName: 'powerSurge'}, (payload) => {
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
  it('should allow multiple FSMs to interact via a mediator', () => {
    // Arrange
    const enum TrafficLightColors {
      'red' = 'red',
      'yellow' = 'yellow',
      'green' = 'green'
    }
    const TrafficLightFactory = () => {
      const TrafficLight = new FSM();
      
      TrafficLight.addState(TrafficLightColors.red);
      TrafficLight.addState(TrafficLightColors.yellow);
      TrafficLight.addState(TrafficLightColors.green);
      TrafficLight.on({inputName: 'turnExpired'}, () => {
        return new Map([
          [TrafficLightColors.green, TrafficLightColors.yellow],
          [TrafficLightColors.yellow, TrafficLightColors.red],
          [TrafficLightColors.red, TrafficLightColors.green],
        ])
      });
      return TrafficLight;
    }

    const NSTrafficLight = TrafficLightFactory();
    const EWTrafficLight = TrafficLightFactory();
    // should start the same
    expect(NSTrafficLight.getCurrentState()).toEqual(TrafficLightColors.red);
    expect(EWTrafficLight.getCurrentState()).toEqual(TrafficLightColors.red);
    // changing one shouldn't change the other
    NSTrafficLight.dispatch({inputName: 'turnExpired'});
    expect(NSTrafficLight.getCurrentState()).toEqual(TrafficLightColors.green);
    expect(EWTrafficLight.getCurrentState()).toEqual(TrafficLightColors.red);
    // let's connect one to the other using a third object
    enum trafficStates {
      'trafficMoving' = 'crossTrafficMoving',
      'allTrafficStopped' = 'allTrafficStopped',
      'trafficStopping' = 'trafficStopping',
    }
    class TrafficLightMediator {
      private trafficLights: FSM[] = [];
      private mediatorFSM: FSM = new FSM();
      constructor(trafficLights: FSM[]) {
        this.trafficLights = trafficLights;
        this.mediatorFSM.addState(trafficStates.trafficMoving);
        this.mediatorFSM.addState(trafficStates.trafficStopping);
        this.mediatorFSM.addState(trafficStates.allTrafficStopped);
        this.mediatorFSM.on({inputName: 'tick'}, (payload: TrafficLightColors[] | undefined) => {
          if (payload) {
          const isTrafficMoving = () => payload.find(tl => tl === TrafficLightColors.green) !== undefined;

          switch (true) {
            case isTrafficMoving():
              const movingTL = this.trafficLights.find(tl => 
                tl.getCurrentState() === TrafficLightColors.green
              )
              if (movingTL) {
                movingTL.dispatch({inputName: 'turnExpired'})
              }
              break;
            default:
              this.trafficLights.forEach(tl => tl.dispatch({inputName: 'turnExpired'}))
              break;
          }
        }
          return new Map([
            [trafficStates.allTrafficStopped, trafficStates.trafficMoving],
            [trafficStates.trafficMoving, trafficStates.trafficStopping],
            [trafficStates.trafficStopping, trafficStates.allTrafficStopped],
          ])
        })
      }
      turnExpired = () => {
        const payload = this.trafficLights.map(tl => tl.getCurrentState());
        this.mediatorFSM.dispatch({inputName: 'tick', payload});
      }
    };
    const TLM = new TrafficLightMediator([NSTrafficLight, EWTrafficLight]);
    // Action start stopping traffic
    TLM.turnExpired();
    // Assert
    expect(NSTrafficLight.getCurrentState()).toEqual(TrafficLightColors.yellow);
    expect(EWTrafficLight.getCurrentState()).toEqual(TrafficLightColors.red);
    // Action allow cross traffic to start
    TLM.turnExpired();
    // Assert end of second turn
    expect(NSTrafficLight.getCurrentState()).toEqual(TrafficLightColors.red);
    expect(EWTrafficLight.getCurrentState()).toEqual(TrafficLightColors.green);
    // Action start stopping cross traffic
    TLM.turnExpired();
    // Assert end of third turn
    expect(NSTrafficLight.getCurrentState()).toEqual(TrafficLightColors.red);
    expect(EWTrafficLight.getCurrentState()).toEqual(TrafficLightColors.yellow);
    // Action allow traffic to start
    TLM.turnExpired();
    // Assert end of fourth turn
    expect(NSTrafficLight.getCurrentState()).toEqual(TrafficLightColors.green);
    expect(EWTrafficLight.getCurrentState()).toEqual(TrafficLightColors.red);
  })
});
