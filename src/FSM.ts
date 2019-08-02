interface IInput {
  inputName: string
  payload?: any
}

interface TransitionHandler {
  (payload?: any): Map<string, string>
};

export class FSM {
  private currentState: string = '';
  public states: Map<string, string> = new Map();
  private transitions: Map<string, TransitionHandler> = new Map();

  public addState = (state: string): void => {
    if (this.currentState === '' && typeof state === 'string') {
      this.currentState = state;
    }
    this.states.set(state, state);
  }

  private checkThatAllTransitionsAreValid = (transitionHandler: TransitionHandler) => {
    const defaultTransitions = transitionHandler();
    const possibleStates = [...defaultTransitions.keys()];
    possibleStates.forEach(state => {
      if (!this.states.has(state)) {
        throw new Error('unknown state in transition handler')
      }
    });
  }

  public on = (input: IInput, transitionHandler: TransitionHandler) => {
    this.checkThatAllTransitionsAreValid(transitionHandler);
    this.transitions.set(input.inputName, transitionHandler);
  }

  private missingTransitionHandlerError = (_?: any) => new Map();

  public dispatch = (input: IInput) => {
    const transitionHandler = this.transitions.get(input.inputName) || this.missingTransitionHandlerError;
    const newState = transitionHandler(input.payload).get(this.currentState);
    if (!this.states.has(newState)) {
      throw new Error('unknown new current state');
    }
    this.currentState = newState;
  }

  public getCurrentState = (): string => {
    return this.currentState;
  }
}
