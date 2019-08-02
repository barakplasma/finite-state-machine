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
  constructor() {}
  private transitions: Map<string, TransitionHandler> = new Map();

  public addState(state: string): void {
    if (this.currentState === '' && typeof state === 'string') {
      this.currentState = state;
    }
    this.states.set(state, state);
  }

  public on = (input: IInput, reducer: TransitionHandler) => {
    this.transitions.set(input.inputName, reducer);
  }

  private missingTransitionHandlerError = (_?: any) => new Map();

  public dispatch = (input: IInput) => {
    const transitionHandler = this.transitions.get(input.inputName) || this.missingTransitionHandlerError;
    this.currentState = transitionHandler(input.payload).get(this.currentState);
  }

  public getCurrentState(): string {
    return this.currentState;
  }
}
